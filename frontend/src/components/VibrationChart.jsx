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

export default function VibrationChart({ data }) {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 100 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Vibration Amplitude (g)',
        data: Array(100).fill(0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: data,
          },
        ],
      }));
    }
  }, [data]);

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
        min: -15,
        max: 15,
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
