import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FFTChart({ data }) {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 100 }, (_, i) => (i * 5).toString()),
    datasets: [
      {
        label: 'Amplitude',
        data: Array(100).fill(0),
        backgroundColor: '#F59E0B',
      },
    ],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData((prev) => ({
        labels: data.map(d => d.freq),
        datasets: [
          {
            ...prev.datasets[0],
            data: data.map(d => d.amp),
          },
        ],
      }));
    }
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 100 },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9CA3AF',
          maxTicksLimit: 10,
        }
      },
      y: {
        min: 0,
        max: 30,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: { color: '#9CA3AF' }
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={chartData} options={options} />;
}
