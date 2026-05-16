import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function FaultLog({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
        <p>No faults detected recently.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto h-64 overflow-y-auto pr-2 custom-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-400 uppercase bg-gray-800/50 sticky top-0">
          <tr>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">RMS</th>
            <th className="px-4 py-3">Temp</th>
            <th className="px-4 py-3 text-right">Confidence</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {logs.map((log) => (
              <motion.tr 
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`border-b border-gray-800/50 ${log.severity === 'Critical' ? 'bg-critical/10' : 'bg-warning/10'}`}
              >
                <td className="px-4 py-3 font-mono text-gray-300">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 font-medium">
                  <span className={log.severity === 'Critical' ? 'text-critical' : 'text-warning'}>
                    {log.fault_class}
                  </span>
                </td>
                <td className="px-4 py-3">{log.rms.toFixed(2)}</td>
                <td className="px-4 py-3">{log.temperature.toFixed(1)}°C</td>
                <td className="px-4 py-3 text-right">{(log.confidence * 100).toFixed(1)}%</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
