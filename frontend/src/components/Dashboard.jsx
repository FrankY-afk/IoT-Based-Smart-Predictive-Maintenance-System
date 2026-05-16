import React, { useState, useEffect, useRef } from 'react';
import { Activity, Thermometer, Zap, AlertTriangle, CheckCircle, Server, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VibrationChart from './VibrationChart';
import FFTChart from './FFTChart';
import TemperatureGraph from './TemperatureGraph';
import FeatureCards from './FeatureCards';
import SystemArchitecture from './SystemArchitecture';
import FaultLog from './FaultLog';
import DigitalTwin from './DigitalTwin';
import MaintenanceEngine from './MaintenanceEngine';
import HistoricalAnalytics from './HistoricalAnalytics';

const WS_URL = 'ws://localhost:8000/ws/sensor-data';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [simulationState, setSimulationState] = useState('Normal');
  const [faultLogs, setFaultLogs] = useState([]);
  
  const ws = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket(WS_URL);
    
    ws.current.onopen = () => setStatus('Connected');
    ws.current.onclose = () => {
      setStatus('Disconnected');
      setTimeout(connectWebSocket, 3000);
    };
    ws.current.onerror = () => setStatus('Error');
    
    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
      
      if (parsed.prediction.severity !== 'Normal') {
        setFaultLogs(prev => {
          // Avoid duplicate logs within same second
          if (prev.length > 0 && prev[0].timestamp === parsed.timestamp) return prev;
          const newLog = {
            id: Date.now() + Math.random(),
            timestamp: parsed.timestamp,
            ...parsed.features,
            ...parsed.prediction
          };
          return [newLog, ...prev].slice(0, 100);
        });
      }
    };
  };

  const updateSimulation = async (newState) => {
    try {
      await fetch('http://localhost:8000/api/simulation/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      });
      setSimulationState(newState);
    } catch (e) {
      console.error('Failed to change state', e);
    }
  };

  const getStatusColor = (severity) => {
    if (severity === 'Normal') return 'text-success';
    if (severity === 'Warning') return 'text-warning';
    return 'text-critical';
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen flex-col bg-background text-white">
        <Activity className="w-16 h-16 text-primary animate-pulse mb-4" />
        <h2 className="text-2xl font-semibold tracking-wider">SCADA INITIALIZATION</h2>
        <p className="text-gray-400 mt-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          {status}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 pb-8">
      {/* Alert Banners */}
      <AnimatePresence>
        {data.prediction.severity !== 'Normal' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`w-full p-3 rounded-lg flex items-center justify-center gap-3 font-bold tracking-wide shadow-lg
              ${data.prediction.severity === 'Critical' ? 'bg-critical text-white' : 'bg-warning text-gray-900'}`}
          >
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            {data.prediction.severity === 'Critical' ? 'CRITICAL SYSTEM ANOMALY DETECTED' : 'WARNING: VIBRATION IMBALANCE'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-400" />
            Predictive Maintenance Console
          </h1>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 uppercase tracking-widest font-mono">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3 text-indigo-400" /> ESP32 Edge Node
            </span>
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${status === 'Connected' ? 'bg-success shadow-[0_0_8px_#10B981]' : 'bg-critical'} animate-pulse`} />
              {status}
            </span>
            <span className="text-gray-500">|</span>
            <span>Transmission: {data.system_health.packet_rate} pkts/s</span>
            <span className="text-gray-500">|</span>
            <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-4 md:mt-0 flex gap-2">
          <button onClick={() => updateSimulation('Normal')} className={`px-4 py-2 rounded uppercase tracking-wider text-xs font-bold transition-all ${simulationState === 'Normal' ? 'bg-success/20 text-success border border-success/50' : 'bg-panel-border hover:bg-gray-700'}`}>Normal Ops</button>
          <button onClick={() => updateSimulation('Minor Imbalance')} className={`px-4 py-2 rounded uppercase tracking-wider text-xs font-bold transition-all ${simulationState === 'Minor Imbalance' ? 'bg-warning/20 text-warning border border-warning/50' : 'bg-panel-border hover:bg-gray-700'}`}>Imbalance</button>
          <button onClick={() => updateSimulation('Severe Anomaly')} className={`px-4 py-2 rounded uppercase tracking-wider text-xs font-bold transition-all ${simulationState === 'Severe Anomaly' ? 'bg-critical/20 text-critical border border-critical/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-panel-border hover:bg-gray-700'}`}>Severe Fault</button>
        </div>
      </header>

      <FeatureCards features={data.features} health={data.system_health} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel">
            <div className="flex flex-col items-center justify-center py-2">
              <motion.div 
                key={data.prediction.severity}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-2"
              >
                {data.prediction.severity === 'Normal' ? (
                  <CheckCircle className="w-16 h-16 text-success drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                ) : (
                  <AlertTriangle className={`w-16 h-16 ${getStatusColor(data.prediction.severity)} drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]`} />
                )}
              </motion.div>
              <h3 className={`text-xl uppercase tracking-wider font-bold ${getStatusColor(data.prediction.severity)}`}>
                {data.prediction.fault_class}
              </h3>
              <p className="text-gray-400 mt-1 font-mono text-sm">Confidence: {(data.prediction.confidence * 100).toFixed(1)}%</p>
            </div>
            
            <div className="mt-4 space-y-2">
              {Object.entries(data.prediction.probabilities).map(([className, prob]) => (
                <div key={className} className="flex flex-col gap-1 text-xs font-mono uppercase">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{className}</span>
                    <span className="text-gray-300">{(prob * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <motion.div 
                      className={`h-1 rounded-full ${className === 'Normal' ? 'bg-success' : className === 'Minor Fault' ? 'bg-warning' : 'bg-critical'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${prob * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel h-64">
             <DigitalTwin severity={data.prediction.severity} temperature={data.features.temperature} />
          </div>

          <div className="glass-panel">
            <HistoricalAnalytics healthPercentage={data.system_health.health_percentage} />
          </div>
        </div>

        {/* Center Column: Graphs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel h-[250px]">
            <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-400 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-primary" /> Live Time-Domain Waveform
            </h2>
            <VibrationChart data={data.waveform} />
          </div>
          
          <div className="glass-panel h-[250px]">
            <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-warning" /> FFT Frequency Spectrum Analyis
            </h2>
            <FFTChart data={data.fft} />
          </div>

          <div className="glass-panel h-[200px]">
            <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-400 uppercase tracking-wider">
              <Thermometer className="w-4 h-4 text-red-400" /> Temperature Trend
            </h2>
            <TemperatureGraph currentTemp={data.features.temperature} />
          </div>
        </div>

        {/* Right Column: Analytics & Logs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel h-64">
            <MaintenanceEngine recommendations={data.prediction.recommendations} severity={data.prediction.severity} />
          </div>

          <div className="glass-panel">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-400 uppercase tracking-wider">
              <Server className="w-4 h-4 text-indigo-400" /> Data Pipeline Topology
            </h2>
            <SystemArchitecture activeComponent={data.prediction.severity === 'Normal' ? 'normal' : 'alert'} />
          </div>

          <div className="glass-panel">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-critical" /> Historical Event Log
            </h2>
            <FaultLog logs={faultLogs} />
          </div>
        </div>

      </div>
    </div>
  );
}
