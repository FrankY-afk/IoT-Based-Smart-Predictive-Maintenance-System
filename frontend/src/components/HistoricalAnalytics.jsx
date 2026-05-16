import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HistoricalAnalytics({ healthPercentage }) {
  const [historyData, setHistoryData] = useState({
    labels: Array.from({ length: 50 }, (_, i) => ''),
    datasets: [
      {
        label: 'Health Degradation (%)',
        data: Array(50).fill(100),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    setHistoryData((prev) => {
      const newData = [...prev.datasets[0].data.slice(1), healthPercentage];
      
      // Determine color based on current health
      let color = '#10B981';
      let bgColor = 'rgba(16, 185, 129, 0.1)';
      if (healthPercentage < 40) {
        color = '#EF4444';
        bgColor = 'rgba(239, 68, 68, 0.1)';
      } else if (healthPercentage < 80) {
        color = '#F59E0B';
        bgColor = 'rgba(245, 158, 11, 0.1)';
      }

      return {
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: newData,
            borderColor: color,
            backgroundColor: bgColor,
          },
        ],
      };
    });
  }, [healthPercentage]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: { color: '#9CA3AF' }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-emerald-400" />
        Health Degradation Trend
      </h2>
      <div className="flex-1 min-h-[150px]">
        <Line data={historyData} options={options} />
      </div>
    </div>
  );
}
