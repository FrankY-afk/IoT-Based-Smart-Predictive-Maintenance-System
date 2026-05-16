import React from 'react';
import { motion } from 'framer-motion';

export default function DigitalTwin({ severity, temperature }) {
  // Determine colors based on severity
  const isCritical = severity === 'Critical';
  const isWarning = severity === 'Warning';
  
  const baseColor = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';
  const glow = `drop-shadow(0 0 15px ${baseColor})`;

  // Shaking animation for faults
  const shakeAnimation = isCritical 
    ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.1 } }
    : isWarning 
      ? { x: [-1, 1, -1, 1, 0], transition: { repeat: Infinity, duration: 0.3 } }
      : { x: 0, y: 0 };

  // Speed of rotation
  const rotateDuration = isCritical ? '0.2s' : isWarning ? '0.4s' : '0.8s';

  return (
    <div className="relative w-full h-full min-h-[250px] flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgyMHYyMEgxVjF6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* Temperature gradient overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: temperature > 80 ? 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(0,0,0,0) 70%)' : 'none',
          opacity: temperature > 80 ? 1 : 0
        }}
      />

      <motion.div 
        className="relative z-10 w-48 h-48"
        animate={shakeAnimation}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: glow }}>
          {/* Base Mount */}
          <rect x="30" y="150" width="140" height="20" rx="5" fill="#374151" stroke="#4B5563" strokeWidth="2" />
          <rect x="40" y="140" width="120" height="10" fill="#4B5563" />
          
          {/* Main Body */}
          <path d="M50 60 A 50 50 0 0 1 150 60 L 150 140 L 50 140 Z" fill="#1F2937" stroke={baseColor} strokeWidth="4" />
          
          {/* Cooling Fins */}
          <line x1="60" y1="70" x2="140" y2="70" stroke="#374151" strokeWidth="3" />
          <line x1="60" y1="85" x2="140" y2="85" stroke="#374151" strokeWidth="3" />
          <line x1="60" y1="100" x2="140" y2="100" stroke="#374151" strokeWidth="3" />
          <line x1="60" y1="115" x2="140" y2="115" stroke="#374151" strokeWidth="3" />
          <line x1="60" y1="130" x2="140" y2="130" stroke="#374151" strokeWidth="3" />

          {/* Rotor Shaft Container (Spinning) */}
          <g style={{ transformOrigin: '25px 92.5px', animation: `spin ${rotateDuration} linear infinite` }}>
            <rect x="0" y="85" width="50" height="15" rx="2" fill="#9CA3AF" />
            <line x1="0" y1="92.5" x2="50" y2="92.5" stroke="#4B5563" strokeWidth="2" />
            <line x1="25" y1="85" x2="25" y2="100" stroke="#4B5563" strokeWidth="2" />
          </g>
          
          <g style={{ transformOrigin: '160px 92.5px', animation: `spin ${rotateDuration} linear infinite` }}>
            <rect x="150" y="85" width="20" height="15" rx="2" fill="#9CA3AF" />
            <line x1="150" y1="92.5" x2="170" y2="92.5" stroke="#4B5563" strokeWidth="2" />
            <line x1="160" y1="85" x2="160" y2="100" stroke="#4B5563" strokeWidth="2" />
          </g>

          {/* Glowing Center */}
          <circle cx="100" cy="100" r="15" fill={baseColor} opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur={isCritical ? "0.2s" : "1.5s"} repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Labels */}
        <div className="absolute top-0 right-0 -mr-12 -mt-4 bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700 shadow-lg whitespace-nowrap">
          <span className="text-gray-400">Sensor:</span> MPU6050
        </div>
        <div className="absolute bottom-10 left-0 -ml-8 bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700 shadow-lg whitespace-nowrap">
          <span className="text-gray-400">Motor:</span> 3 Phase AC
        </div>

        <style jsx>{`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
