# IoT-Based-Smart-Predictive-Maintenance-System

An intelligent industrial IoT platform that performs real-time machine health monitoring using vibration and temperature analysis. The system uses ESP32, MPU6050, signal processing techniques such as RMS and FFT, and a machine learning model to detect anomalies and predict machine faults through a modern SCADA-style dashboard.

---

## 🚀 Features

- Real-time vibration monitoring
- FFT frequency spectrum analysis
- Machine learning-based anomaly detection
- SCADA-style industrial dashboard
- Live sensor data streaming using WebSockets
- RMS and peak vibration analysis
- Machine health score visualization
- Fault severity classification
- Temperature monitoring
- Historical event logging
- Real-time alerts and notifications
- Predictive maintenance analytics

---

## 🧠 Machine Learning

The system uses a Random Forest Classifier trained on:
- RMS vibration values
- Peak amplitude
- Dominant frequency
- Temperature data

Prediction Classes:
- Normal
- Minor Fault
- Severe Fault

---

## 📊 Signal Processing

Implemented techniques:
- Root Mean Square (RMS)
- Fast Fourier Transform (FFT)
- Peak Detection
- Real-Time Streaming Analysis
- Circular Buffer Processing

---

## ⚙️ Hardware Components

- ESP32 Development Board
- MPU6050 Accelerometer + Gyroscope
- Temperature Sensor
- DC Motor
- L293D Motor Driver
- Breadboard
- Jumper Wires

---

## 💻 Software Stack

### Frontend
- React
- Tailwind CSS
- Framer Motion
- Chart.js / Plotly

### Backend
- FastAPI
- WebSocket
- REST APIs

### Machine Learning
- Python
- Scikit-learn
- NumPy
- Pandas

### Database
- PostgreSQL / SQLite

---

## 🔄 System Architecture

```text
DC Motor
   ↓
MPU6050 + Temperature Sensor
   ↓
ESP32
   ↓
WiFi Communication
   ↓
FastAPI Backend
   ↓
Signal Processing + ML Model
   ↓
Database
   ↓
SCADA Dashboard
