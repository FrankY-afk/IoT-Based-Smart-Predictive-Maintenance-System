import React from 'react';
import { Wrench, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MaintenanceEngine({ recommendations, severity }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-indigo-400" />
        Prescriptive Maintenance Actions
      </h2>
      
      <div className="flex-1 bg-gray-900/40 rounded-lg p-4 overflow-y-auto border border-gray-800">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec + severity} // re-animate when recommendation or severity changes
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`mb-3 p-3 rounded border flex items-start gap-3 ${
                severity === 'Critical' 
                  ? 'bg-critical/10 border-critical/30 text-red-200' 
                  : severity === 'Warning'
                    ? 'bg-warning/10 border-warning/30 text-yellow-200'
                    : 'bg-success/10 border-success/30 text-green-200'
              }`}
            >
              <div className="mt-0.5">
                {severity === 'Normal' ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <AlertTriangle className={`w-4 h-4 ${severity === 'Critical' ? 'text-critical' : 'text-warning'}`} />
                )}
              </div>
              <p className="text-sm font-medium">{rec}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
