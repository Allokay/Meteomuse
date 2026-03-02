import { Database } from 'lucide-react';

export function DataSources() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-lg shadow-lg p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-bold text-blue-300">Real NASA POWER Data</h3>
      </div>

      {/* Data Source Information */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex items-start gap-2">
          <span className="text-green-400 font-bold text-lg">✓</span>
          <div>
            <p className="font-semibold text-slate-100">MERRA-2 Atmospheric Model</p>
            <p className="text-slate-400 text-xs">
              NASA's Modern-Era Retrospective analysis for Research and Applications
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-green-400 font-bold text-lg">✓</span>
          <div>
            <p className="font-semibold text-slate-100">Global Coverage</p>
            <p className="text-slate-400 text-xs">
              All latitudes (-90° to +90°) and longitudes (-180° to +180°)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-green-400 font-bold text-lg">✓</span>
          <div>
            <p className="font-semibold text-slate-100">High Resolution</p>
            <p className="text-slate-400 text-xs">
              0.5° × 0.625° spatial resolution (~50km grid cells)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-green-400 font-bold text-lg">✓</span>
          <div>
            <p className="font-semibold text-slate-100">Near Real-Time Data</p>
            <p className="text-slate-400 text-xs">
              Updated within 2-3 months of real-time observations
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-green-400 font-bold text-lg">✓</span>
          <div>
            <p className="font-semibold text-slate-100">No API Key Required</p>
            <p className="text-slate-400 text-xs">
              Free and open access for research and education
            </p>
          </div>
        </div>
      </div>

      {/* Parameters Being Used */}
      <div className="bg-slate-800 rounded p-3 mb-6">
        <p className="text-xs font-semibold text-slate-300 mb-2">PARAMETERS RETRIEVED:</p>
        <ul className="text-xs text-slate-400 space-y-1 font-mono">
          <li>• <span className="text-blue-300">T2M</span> - Temperature at 2m (°C)</li>
          <li>• <span className="text-blue-300">T2M_MAX/MIN</span> - Daily max/min temperature</li>
          <li>• <span className="text-blue-300">RH2M</span> - Relative humidity at 2m (%)</li>
          <li>• <span className="text-blue-300">PRECTOTCORR</span> - Precipitation (mm/day)</li>
          <li>• <span className="text-blue-300">WS10M</span> - Wind speed at 10m (m/s)</li>
          <li>• <span className="text-blue-300">PS</span> - Surface pressure (kPa)</li>
        </ul>
      </div>

      {/* Citation and Attribution */}
      <div className="border-t border-slate-700 pt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-300 mb-1">OFFICIAL CITATION:</p>
          <p className="text-xs text-slate-400 italic">
            "The data was obtained from the National Aeronautics and Space Administration (NASA) 
            Langley Research Center (LaRC) Prediction of Worldwide Energy Resource (POWER) Project 
            funded through the NASA Earth Science/Applied Science Program."
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-300 mb-1">API ENDPOINT:</p>
          <p className="text-xs text-blue-400 font-mono break-all">
            https://power.larc.nasa.gov/api/temporal/daily/point
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-300 mb-1">LEARN MORE:</p>
          <ul className="text-xs space-y-1">
            <li>
              <a 
                href="https://power.larc.nasa.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                NASA POWER Homepage
              </a>
            </li>
            <li>
              <a 
                href="https://power.larc.nasa.gov/docs/services/api/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                API Documentation
              </a>
            </li>
            <li>
              <a 
                href="https://power.larc.nasa.gov/parameters/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Parameter Dictionary
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Data Quality Notice */}
      <div className="bg-blue-950 border border-blue-800 rounded p-3 mt-4">
        <p className="text-xs text-blue-200">
          <span className="font-semibold">ℹ️ Data Quality Note:</span> This app displays real NASA POWER 
          data from the MERRA-2 atmospheric model. Data is historical/recent (within 2-3 months) and 
          is NOT a weather forecast. For official forecasts, consult your local meteorological service.
        </p>
      </div>
    </div>
  );
}
