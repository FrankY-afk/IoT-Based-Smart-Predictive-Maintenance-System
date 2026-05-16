import React from 'react';
import { Activity, Thermometer, Zap, BarChart2, Radio, Gauge, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeatureCards({ features, health }) {
  const cards = [
    {
      title: 'RMS Vibration',
      value: features.rms.toFixed(2),
      unit: 'g',
      icon: <Activity className="w-5 h-5 text-primary" />,
      color: 'border-primary'
    },
    {
      title: 'Peak Amplitude',
      value: features.peak.toFixed(2),
      unit: 'g',
      icon: <BarChart2 className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-400'
    },
    {
      title: 'RPM Estimate',
      value: features.rpm.toFixed(0),
      unit: 'rpm',
      icon: <Gauge className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-400'
    },
    {
      title: 'Dominant Freq',
      value: features.dominant_freq.toFixed(1),
      unit: 'Hz',
      icon: <Zap className="w-5 h-5 text-warning" />,
      color: 'border-warning'
    },
    {
      title: 'Temperature',
      value: features.temperature.toFixed(1),
      unit: '°C',
      icon: <Thermometer className={`w-5 h-5 ${features.temperature > 80 ? 'text-critical' : features.temperature > 50 ? 'text-warning' : 'text-success'}`} />,
      color: features.temperature > 80 ? 'border-critical' : features.temperature > 50 ? 'border-warning' : 'border-success'
    },
    {
      title: 'Thermal Stress',
      value: features.thermal_stress.toFixed(1),
      unit: '%',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      color: 'border-red-400'
    },
    {
      title: 'Signal Quality',
      value: features.signal_quality.toFixed(1),
      unit: '%',
      icon: <Radio className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-400'
    },
    {
      title: 'Uptime',
      value: health.uptime_seconds > 3600 ? (health.uptime_seconds/3600).toFixed(1) : (health.uptime_seconds/60).toFixed(1),
      unit: health.uptime_seconds > 3600 ? 'hr' : 'min',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`glass-panel border-l-4 ${card.color} flex flex-col items-start p-4 bg-gray-900/50 hover:bg-gray-800/50 transition-colors`}
        >
          <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            {card.icon}
            {card.title}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold tracking-tight text-white">{card.value}</span>
            <span className="text-xs text-gray-500 font-medium">{card.unit}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
