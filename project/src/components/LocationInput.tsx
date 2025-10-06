import { useState } from 'react';
import { MapPin, Navigation, Calendar } from 'lucide-react';

interface LocationInputProps {
  onSearch: (city: string, date: string) => void;
  onUseLocation: () => void;
  isLoading: boolean;
}

export function LocationInput({ onSearch, onUseLocation, isLoading }: LocationInputProps) {
  const [city, setCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim(), selectedDate);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
        </div>
        <div className="relative sm:w-48">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLoading}
          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Use my location"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
