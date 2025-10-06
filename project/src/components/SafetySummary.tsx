import { AlertCircle, Info } from 'lucide-react';

interface SafetySummaryProps {
  advice: string;
  locationName: string;
}

export function SafetySummary({ advice, locationName }: SafetySummaryProps) {
  const isWarning = advice.includes('hot') || advice.includes('rain') || advice.includes('wind') || advice.includes('Freezing') || advice.includes('Uncomfortable');

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 ${isWarning ? 'bg-amber-50 border-2 border-amber-300' : 'bg-green-50 border-2 border-green-300'}`}>
      <div className="flex items-start gap-3">
        {isWarning ? (
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        ) : (
          <Info className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
        )}
        <div>
          <h3 className={`text-lg font-bold mb-2 ${isWarning ? 'text-amber-900' : 'text-green-900'}`}>
            {locationName} - Weather Advisory
          </h3>
          <p className={`${isWarning ? 'text-amber-800' : 'text-green-800'}`}>{advice}</p>
        </div>
      </div>
    </div>
  );
}
