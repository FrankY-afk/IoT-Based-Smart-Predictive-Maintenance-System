import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Cpu, Activity, Laptop } from 'lucide-react';

export default function SystemArchitecture({ activeComponent }) {
  const isAlert = activeComponent === 'alert';

  const nodes = [
    { id: 'motor', label: 'DC Motor', icon: <Activity />, x: 10, y: 50 },
    { id: 'esp32', label: 'ESP32 Node', icon: <Cpu />, x: 35, y: 50 },
    { id: 'backend', label: 'FastAPI', icon: <Server />, x: 60, y: 50 },
    { id: 'db', label: 'SQLite', icon: <Database />, x: 60, y: 80 },
    { id: 'dashboard', label: 'Dashboard', icon: <Laptop />, x: 85, y: 50 },
  ];

  return (
    <div className="relative w-full h-48 bg-gray-900/50 rounded-lg p-4 overflow-hidden border border-gray-800">
      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {/* Motor to ESP */}
        <line x1="10%" y1="50%" x2="35%" y2="50%" stroke="#4B5563" strokeWidth="2" strokeDasharray="4" />
        <motion.circle cx="22.5%" cy="50%" r="3" fill={isAlert ? "#EF4444" : "#10B981"}
          animate={{ cx: ["10%", "35%"] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

        {/* ESP to Backend */}
        <line x1="35%" y1="50%" x2="60%" y2="50%" stroke="#4B5563" strokeWidth="2" strokeDasharray="4" />
        <motion.circle cx="47.5%" cy="50%" r="3" fill={isAlert ? "#EF4444" : "#3B82F6"}
          animate={{ cx: ["35%", "60%"] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

        {/* Backend to DB */}
        <line x1="60%" y1="50%" x2="60%" y2="80%" stroke="#4B5563" strokeWidth="2" strokeDasharray="4" />
        <motion.circle cx="60%" cy="65%" r="3" fill="#8B5CF6"
          animate={{ cy: ["50%", "80%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />

        {/* Backend to Dashboard */}
        <line x1="60%" y1="50%" x2="85%" y2="50%" stroke="#4B5563" strokeWidth="2" strokeDasharray="4" />
        <motion.circle cx="72.5%" cy="50%" r="3" fill={isAlert ? "#EF4444" : "#10B981"}
          animate={{ cx: ["60%", "85%"] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: 10 }}
        >
          <div className={`p-2 rounded-full ${isAlert && node.id !== 'db' ? 'bg-critical/20 text-critical shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gray-800 text-blue-400 border border-gray-700'}`}>
            {node.icon}
          </div>
          <span className="text-xs mt-1 text-gray-400 font-medium whitespace-nowrap">{node.label}</span>
        </div>
      ))}
    </div>
  );
}
