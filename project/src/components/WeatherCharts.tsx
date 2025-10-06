import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { WeatherData } from '../types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartsProps {
  forecasts: WeatherData[];
}

export function WeatherCharts({ forecasts }: WeatherChartsProps) {
  const labels = forecasts.map((f) => {
    const date = new Date(f.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const temperatureData = {
    labels,
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: forecasts.map((f) => f.tempMax),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Min Temperature (°C)',
        data: forecasts.map((f) => f.tempMin),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const rainfallData = {
    labels,
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: forecasts.map((f) => f.rainfall),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 2,
      },
    ],
  };

  const temperatureOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Temperature Trend (5 Days)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  const rainfallOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rainfall (5 Days)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Rainfall (mm)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-[300px]">
          <Line data={temperatureData} options={temperatureOptions} />
        </div>
        <div className="h-[300px]">
          <Bar data={rainfallData} options={rainfallOptions} />
        </div>
      </div>
    </div>
  );
}
