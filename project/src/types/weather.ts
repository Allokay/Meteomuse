export interface WeatherData {
  date: string;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  safetyStatus: 'Safe' | 'Caution' | 'Unsafe';
  conditionType: 'Normal' | 'VeryHot' | 'VeryCold' | 'VeryWindy' | 'VeryWet' | 'Uncomfortable';
}

export interface LocationInput {
  city?: string;
  latitude?: number;
  longitude?: number;
}
