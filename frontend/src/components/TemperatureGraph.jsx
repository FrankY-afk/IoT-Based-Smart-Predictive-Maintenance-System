import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function TemperatureGraph({ currentTemp }) {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 50 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: Array(50).fill(40), // Initial baseline temp
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (currentTemp !== undefined) {
      setChartData((prev) => {
        const newData = [...prev.datasets[0].data.slice(1), currentTemp];
        
        let color = '#10B981'; // Green
        let bgColor = 'rgba(16, 185, 129, 0.2)';
        
        if (currentTemp > 80) {
          color = '#EF4444'; // Red
          bgColor = 'rgba(239, 68, 68, 0.2)';
        } else if (currentTemp > 50) {
          color = '#F59E0B'; // Yellow
          bgColor = 'rgba(245, 158, 11, 0.2)';
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
    }
  }, [currentTemp]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Disable animation for real-time performance
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        min: 20,
        max: 120,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: { color: '#9CA3AF' }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
  };

  return <Line data={chartData} options={options} />;
}
