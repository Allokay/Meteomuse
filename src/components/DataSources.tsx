import { Database } from 'lucide-react';

export function DataSources() {
  return (
    <div className="bg-gray-800 text-gray-100 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5" />
        <h3 className="text-lg font-bold">NASA Data Sources</h3>
      </div>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 font-bold">•</span>
          <span>NASA POWER API (Temperature, Radiation)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 font-bold">•</span>
          <span>MERRA-2 (Atmospheric Data)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 font-bold">•</span>
          <span>GPM (Precipitation)</span>
        </li>
      </ul>
      <p className="mt-4 text-xs text-gray-400">
        Real-time weather data sourced from NASA's satellite systems and climate models
      </p>
    </div>
  );
}