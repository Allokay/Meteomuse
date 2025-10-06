import { WeatherData } from '../types/weather';
import { Droplets, Wind, Gauge, Thermometer, Sun, CloudRain, Snowflake, Cloud } from 'lucide-react';

interface ForecastCardProps {
  data: WeatherData;
}

const conditionGradients: Record<WeatherData['conditionType'], string> = {
  VeryHot: 'from-orange-400 via-red-500 to-pink-500',
  VeryCold: 'from-sky-500 via-blue-500 to-indigo-600',
  VeryWindy: 'from-purple-400 via-violet-500 to-fuchsia-500',
  VeryWet: 'from-cyan-400 via-blue-400 to-teal-500',
  Uncomfortable: 'from-yellow-400 via-orange-400 to-red-500',
  Normal: 'from-emerald-400 via-green-500 to-teal-400',
};

const safetyBadgeColors: Record<WeatherData['safetyStatus'], string> = {
  Safe: 'bg-green-100/50 text-green-900 border-green-300 shadow-md',
  Caution: 'bg-yellow-100/50 text-yellow-900 border-yellow-300 shadow-md',
  Unsafe: 'bg-red-100/50 text-red-900 border-red-300 shadow-md',
};

export function ForecastCard({ data }: ForecastCardProps) {
  const date = new Date(data.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getIcon = () => {
    switch (data.conditionType) {
      case 'VeryHot': return <Sun className="w-12 h-12 text-yellow-300 drop-shadow-[0_0_12px_rgba(255,255,200,0.8)] animate-pulse" />;
      case 'VeryCold': return <Snowflake className="w-12 h-12 text-blue-200 drop-shadow-[0_0_12px_rgba(180,220,255,0.8)] animate-pulse" />;
      case 'VeryWet': return <CloudRain className="w-12 h-12 text-blue-300 drop-shadow-[0_0_12px_rgba(135,206,250,0.8)] animate-pulse" />;
      case 'VeryWindy': return <Wind className="w-12 h-12 text-violet-300 drop-shadow-[0_0_12px_rgba(200,180,255,0.8)] animate-pulse" />;
      case 'Uncomfortable': return <Thermometer className="w-12 h-12 text-orange-200 drop-shadow-[0_0_12px_rgba(255,200,150,0.8)] animate-pulse" />;
      default: return <Cloud className="w-12 h-12 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] animate-pulse" />;
    }
  };

  return (
    <div
      className={`relative rounded-3xl p-6 w-[280px] text-white shadow-2xl bg-gradient-to-br ${conditionGradients[data.conditionType]} 
      transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl`}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-2xl font-bold tracking-wide">{dayName}</div>
            <div className="text-sm opacity-90">{dateStr}</div>
          </div>
          <div>{getIcon()}</div>
        </div>

        {/* Temperature Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-5 h-5" />
            <span className="text-4xl font-extrabold drop-shadow-md">{data.tempMax}°C</span>
          </div>
          <p className="text-sm opacity-90">Min: {data.tempMin}°C</p>
          <p className="text-sm opacity-90">Feels like: {data.feelsLike}°C</p>
        </div>

        {/* Weather Details */}
        <div className="space-y-2 mb-4 text-sm text-white/90">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            <span>Humidity: {data.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4" />
            <span>Rainfall: {data.rainfall} mm</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            <span>Wind: {data.windSpeed} m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            <span>Pressure: {data.pressure} hPa</span>
          </div>
        </div>

        {/* Safety Badge */}
        <div
          className={`px-4 py-2 rounded-full border text-center font-semibold text-sm ${safetyBadgeColors[data.safetyStatus]} backdrop-blur-md`}
        >
          {data.safetyStatus}
        </div>
      </div>
    </div>
  );
}
