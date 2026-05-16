import asyncio
import random
import math
import json
from datetime import datetime
from ml_model import model
from database import SessionLocal, SensorData

class DeviceSimulator:
    def __init__(self):
        self.state = "Normal" # 'Normal', 'Minor Imbalance', 'Severe Anomaly'
        self.running = False
        self.time_step = 0
        self.base_health = 100.0
        self.uptime_seconds = 0
        self.fault_count = 0

    def set_state(self, new_state):
        self.state = new_state

    def generate_waveform(self, duration_ms=100, sample_rate=1000):
        samples = int((duration_ms / 1000) * sample_rate)
        waveform = []
        base_freq = 50.0 
        
        for i in range(samples):
            t = (self.time_step + i) / sample_rate
            if self.state == "Normal":
                amp = 1.0
                noise = random.uniform(-0.2, 0.2)
                val = amp * math.sin(2 * math.pi * base_freq * t) + noise
            elif self.state == "Minor Imbalance":
                amp = 3.0
                noise = random.uniform(-0.5, 0.5)
                val = amp * math.sin(2 * math.pi * base_freq * t) + 1.5 * math.sin(2 * math.pi * 2 * base_freq * t) + noise
            else:
                amp = 8.0
                noise = random.uniform(-2.0, 2.0)
                val = amp * math.sin(2 * math.pi * base_freq * t) + 4.0 * math.sin(2 * math.pi * 3 * base_freq * t) + noise
                
            waveform.append(round(val, 3))
            
        self.time_step += samples
        return waveform

    async def run(self, websocket):
        self.running = True
        db = SessionLocal()
        
        try:
            while self.running:
                waveform = self.generate_waveform()
                self.uptime_seconds += 0.1
                
                rms = round(math.sqrt(sum(x*x for x in waveform) / len(waveform)), 2)
                peak = round(max(abs(x) for x in waveform), 2)
                
                if self.state == "Normal":
                    dominant_freq = random.uniform(49.5, 50.5)
                    temperature = random.uniform(40.0, 48.0)
                    self.base_health = min(100.0, self.base_health + 0.1)
                elif self.state == "Minor Imbalance":
                    dominant_freq = random.uniform(99.0, 101.0)
                    temperature = random.uniform(55.0, 68.0)
                    self.base_health = max(60.0, self.base_health - 0.5)
                else:
                    dominant_freq = random.uniform(148.0, 155.0)
                    temperature = random.uniform(85.0, 105.0)
                    self.base_health = max(10.0, self.base_health - 1.5)

                prediction = model.predict(rms, peak, dominant_freq, temperature)
                if prediction["severity"] != "Normal":
                    self.fault_count += 1
                
                # Extended calculated features
                rpm = round(dominant_freq * 60, 0) if self.state == "Normal" else round((dominant_freq / (2 if self.state == "Minor Imbalance" else 3)) * 60, 0)
                signal_quality = round(random.uniform(95, 100) if self.state == "Normal" else random.uniform(70, 90), 1)
                packet_rate = random.randint(95, 105)
                thermal_stress = round((temperature - 40) / (105 - 40) * 100, 1) # 0-100% scale
                vibration_severity = round(rms * 1.5, 2)

                payload = {
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "features": {
                        "rms": rms,
                        "peak": peak,
                        "dominant_freq": round(dominant_freq, 2),
                        "temperature": round(temperature, 2),
                        "rpm": rpm,
                        "signal_quality": signal_quality,
                        "thermal_stress": thermal_stress,
                        "vibration_severity": vibration_severity
                    },
                    "system_health": {
                        "health_percentage": round(self.base_health, 1),
                        "uptime_seconds": round(self.uptime_seconds, 0),
                        "fault_count": self.fault_count,
                        "packet_rate": packet_rate,
                        "status": "Online"
                    },
                    "prediction": prediction,
                    "waveform": waveform,
                    "fft": self.generate_mock_fft(self.state)
                }

                if prediction["severity"] != "Normal" or random.random() < 0.05:
                    log_entry = SensorData(
                        rms=rms,
                        peak=peak,
                        dominant_freq=dominant_freq,
                        temperature=temperature,
                        rpm=rpm,
                        health_percentage=round(self.base_health, 1),
                        fault_class=prediction["fault_class"],
                        severity=prediction["severity"]
                    )
                    db.add(log_entry)
                    try:
                        db.commit()
                    except:
                        db.rollback()

                await websocket.send_text(json.dumps(payload))
                await asyncio.sleep(0.1)
        except Exception as e:
            print(f"Simulation error: {e}")
        finally:
            db.close()
            
    def generate_mock_fft(self, state):
        freqs = list(range(0, 500, 5))
        amps = []
        for f in freqs:
            if state == "Normal":
                if 45 <= f <= 55: amps.append(random.uniform(5, 10))
                else: amps.append(random.uniform(0, 0.5))
            elif state == "Minor Imbalance":
                if 45 <= f <= 55: amps.append(random.uniform(8, 12))
                elif 95 <= f <= 105: amps.append(random.uniform(4, 8))
                else: amps.append(random.uniform(0, 1))
            else:
                if 45 <= f <= 55: amps.append(random.uniform(10, 15))
                elif 145 <= f <= 155: amps.append(random.uniform(15, 25))
                else: amps.append(random.uniform(0, 3))
        return [{"freq": f, "amp": round(a, 2)} for f, a in zip(freqs, amps)]

simulator = DeviceSimulator()
