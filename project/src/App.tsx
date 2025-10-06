import { useState } from 'react';
import { Cloud } from 'lucide-react';
import { LocationInput } from './components/LocationInput';
import { ForecastCard } from './components/ForecastCard';
import { WeatherCharts } from './components/WeatherCharts';
import { SafetySummary } from './components/SafetySummary';
import { DataSources } from './components/DataSources';
import { WeatherData } from './types/weather';
import { NasaWeatherService, generateSafetyAdvice, geocodeCity } from './services/weatherService';

function App() {
  const [forecasts, setForecasts] = useState<WeatherData[]>([]);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 🔎 Handle city + date search
  const handleSearch = async (city: string, date: string) => {
    setIsLoading(true);
    setError('');

    try {
      const coords = await geocodeCity(city);

      if (!coords) {
        setError('City not found. Please try another location.');
        return;
      }

      const data = await NasaWeatherService.getWeatherData(coords.latitude, coords.longitude, date);
      setForecasts(data);
      setLocationName(city);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 📍 Handle current location
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // ✅ FIX: use reverse geocoding (not search)
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en`
          );
          const locationData = await response.json();
          const cityName = locationData.results?.[0]?.name || 'Your Location';

          const data = await NasaWeatherService.getWeatherData(latitude, longitude);
          setForecasts(data);
          setLocationName(cityName);
        } catch (err) {
          console.error(err);
          setError('Failed to get location data.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-blue-50 animate-gradient-slow">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-12 h-12 text-blue-700 drop-shadow-md animate-bounce" />
            <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
              MeteoMuse
            </h1>
          </div>
          <p className="text-gray-600 italic text-lg">
            Explore the skies with NASA-powered precision forecasts
          </p>
        </div>

        {/* Search Section */}
        <div className="backdrop-blur-lg bg-white/70 p-6 rounded-2xl shadow-xl mb-8 transition-all hover:shadow-2xl">
          <LocationInput onSearch={handleSearch} onUseLocation={handleUseLocation} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 mb-6 shadow-lg text-center">
            {error}
          </div>
        )}

        {/* Forecasts */}
        {forecasts.length > 0 && (
          <>
            <SafetySummary advice={generateSafetyAdvice(forecasts)} locationName={locationName} />

            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                5-Day Forecast for <span className="text-blue-700">{locationName}</span>
              </h2>

              {/* Scrollable forecast cards */}
              <div className="overflow-x-auto pb-6 pl-4 md:pl-6 scroll-smooth snap-x snap-mandatory">
                <div className="flex gap-5 justify-start flex-nowrap">
                  {forecasts.map((forecast, index) => (
                    <div
                      key={index}
                      className="transform hover:scale-105 transition-transform duration-300 snap-start"
                    >
                      <ForecastCard data={forecast} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg mb-8">
              <WeatherCharts forecasts={forecasts} />
            </div>

            {/* Sources */}
            <div className="mt-10">
              <DataSources />
            </div>
          </>
        )}

        {/* Empty state */}
        {forecasts.length === 0 && !error && !isLoading && (
          <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg transition-all hover:shadow-2xl">
            <Cloud className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No forecast data yet
            </h3>
            <p className="text-gray-500 text-lg">
              Enter a city name or use your location to view real-time NASA weather insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
