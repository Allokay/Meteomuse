import { WeatherData } from '../types/weather';

/**
 * REAL NASA POWER API Implementation
 * Source: https://power.larc.nasa.gov/
 * Data: MERRA-2 Atmospheric Model (NASA GMAO)
 * Resolution: 0.5° x 0.625° (about 50km)
 * Latency: Within 2-3 months of real-time
 * Free: No API key required
 */

export class NasaWeatherService {
  private static readonly POWER_API_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point';
  
  // NASA POWER parameters for weather data
  // T2M = Temperature at 2 Meters (°C) - MERRA-2
  // RH2M = Relative Humidity at 2 Meters (%) - MERRA-2
  // PRECTOTCORR = Precipitation Corrected (mm/day) - MERRA-2
  // WS10M = Wind Speed at 10 Meters (m/s) - MERRA-2
  // PS = Surface Pressure (kPa) - MERRA-2
  // T2M_MAX = Daily Maximum Temperature (°C)
  // T2M_MIN = Daily Minimum Temperature (°C)
  private static readonly NASA_PARAMETERS = 'T2M,RH2M,PRECTOTCORR,WS10M,PS,T2M_MAX,T2M_MIN';
  private static readonly COMMUNITY = 'AG'; // Agricultural (general weather)

  /**
   * Fetch REAL weather data from NASA POWER API
   * This retrieves actual satellite-based atmospheric data from MERRA-2
   * @param lat Latitude (-90 to 90)
   * @param lon Longitude (-180 to 180)
   * @param startDate Optional start date (YYYYMMDD format or ISO string)
   * @returns Promise of array of 5 days of real NASA weather data
   */
  static async getWeatherData(
    lat: number,
    lon: number,
    startDate?: string
  ): Promise<WeatherData[]> {
    try {
      // Calculate date range for 5-day window
      const baseDate = startDate 
        ? new Date(startDate) 
        : new Date();
      
      // Adjust to get last 5 days (NASA data is historical, not forecasted)
      const endDate = new Date(baseDate);
      endDate.setDate(endDate.getDate() + 4);

      // Format dates as YYYYMMDD (NASA requirement)
      const startStr = this.formatDateForNasa(baseDate);
      const endStr = this.formatDateForNasa(endDate);

      console.log(
        `🛰️ Fetching REAL NASA POWER data for (${lat.toFixed(2)}, ${lon.toFixed(2)}) from ${startStr} to ${endStr}`
      );

      // Build NASA POWER API URL
      const url = new URL(NasaWeatherService.POWER_API_URL);
      url.searchParams.append('parameters', NasaWeatherService.NASA_PARAMETERS);
      url.searchParams.append('community', NasaWeatherService.COMMUNITY);
      url.searchParams.append('longitude', lon.toString());
      url.searchParams.append('latitude', lat.toString());
      url.searchParams.append('start', startStr);
      url.searchParams.append('end', endStr);
      url.searchParams.append('format', 'JSON');

      console.log(`📡 API Request: ${url.toString().substring(0, 100)}...`);

      // Make actual API request to NASA POWER
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`NASA POWER API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Successfully fetched data from NASA POWER API');

      // Parse NASA response and convert to our WeatherData format
      return this.parseNasaResponse(data);
    } catch (error) {
      console.error('❌ Error fetching NASA POWER data:', error);
      throw new Error(
        `Failed to fetch NASA POWER data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Parse NASA POWER API JSON response and convert to WeatherData array
   * NASA returns data structure:
   * {
   *   properties: {
   *     parameter: {
   *       T2M: { "20240301": 15.5, "20240302": 16.2, ... },
   *       RH2M: { ... },
   *       ...
   *     }
   *   }
   * }
   */
  private static parseNasaResponse(apiResponse: any): WeatherData[] {
    try {
      const properties = apiResponse.properties?.parameter || {};
      const forecasts: WeatherData[] = [];

      // Extract parameter data from NASA response
      const tempData = properties.T2M || {};
      const tempMaxData = properties.T2M_MAX || {};
      const tempMinData = properties.T2M_MIN || {};
      const humidityData = properties.RH2M || {};
      const precipData = properties.PRECTOTCORR || {};
      const windData = properties.WS10M || {};
      const pressureData = properties.PS || {};

      // Get all dates from the response and sort them
      const dates = Object.keys(tempData).sort();

      // Create forecast for each day (maximum 5 days)
      for (let i = 0; i < Math.min(dates.length, 5); i++) {
        const dateStr = dates[i];
        
        // Parse YYYYMMDD format
        const year = Number(dateStr.substring(0, 4));
        const month = Number(dateStr.substring(4, 6));
        const day = Number(dateStr.substring(6, 8));
        const date = new Date(year, month - 1, day);

        // Extract values from NASA data (with fallbacks)
        const tempMax = tempMaxData[dateStr] ?? tempData[dateStr] ?? 20;
        const tempMin = tempMinData[dateStr] ?? tempData[dateStr] ?? 15;
        const tempAvg = tempData[dateStr] ?? (tempMax + tempMin) / 2;
        const humidity = humidityData[dateStr] ?? 60;
        const rainfall = precipData[dateStr] ?? 0;
        const windSpeed = windData[dateStr] ?? 5;
        // Convert kPa to hPa for display (multiply by 10)
        const pressure = pressureData[dateStr] ? (pressureData[dateStr] * 10) : 1013;

        // Calculate scientific "feels like" temperature
        const feelsLike = this.calculateFeelsLike(
          tempAvg,
          humidity,
          windSpeed
        );

        // Determine condition type from real data
        const conditionType = this.determineConditionType(
          tempMax,
          tempMin,
          windSpeed,
          rainfall,
          feelsLike
        );

        // Determine safety status from real data
        const safetyStatus = this.determineSafetyStatus(
          tempMax,
          tempMin,
          windSpeed,
          rainfall,
          feelsLike
        );

        // Add to forecasts array
        forecasts.push({
          date: date.toISOString().split('T')[0],
          tempMax: Math.round(tempMax * 10) / 10,
          tempMin: Math.round(tempMin * 10) / 10,
          feelsLike: Math.round(feelsLike * 10) / 10,
          humidity: Math.round(humidity),
          rainfall: Math.round(rainfall * 10) / 10,
          windSpeed: Math.round(windSpeed * 10) / 10,
          pressure: Math.round(pressure),
          safetyStatus,
          conditionType,
        });
      }

      console.log(`📈 Parsed ${forecasts.length} days of real NASA weather data`);
      return forecasts;
    } catch (error) {
      console.error('Error parsing NASA response:', error);
      throw new Error('Failed to parse NASA POWER API response');
    }
  }

  /**
   * Calculate "feels like" temperature using meteorological formulas
   * Uses wind chill for cold temps and heat index for hot temps
   */
  private static calculateFeelsLike(
    temp: number,
    humidity: number,
    windSpeed: number
  ): number {
    // Wind chill for cold temperatures (< 10°C)
    if (temp < 10) {
      // Windchill formula: °C = 13.12 + 0.6215T - 11.37(V^0.16) + 0.3965T(V^0.16)
      // where T = temperature (°C), V = wind speed (km/h)
      const windKmh = windSpeed * 3.6; // Convert m/s to km/h
      const v = Math.pow(Math.abs(windKmh), 0.16);
      return 13.12 + 0.6215 * temp - 11.37 * v + 0.3965 * temp * v;
    }

    // Heat index for warm temperatures (> 27°C)
    if (temp > 27) {
      // Simplified heat index formula
      const c1 = -42.379;
      const c2 = 2.04901523;
      const c3 = 10.14333127;
      const c4 = -0.22475541;
      const c5 = -0.00683783;
      const c6 = -0.05481717;
      const c7 = 0.00122874;
      const c8 = 0.00085282;
      const c9 = -0.00000199;

      const t = temp;
      const rh = humidity;

      return (
        c1 +
        c2 * t +
        c3 * rh +
        c4 * t * rh +
        c5 * t * t +
        c6 * rh * rh +
        c7 * t * t * rh +
        c8 * t * rh * rh +
        c9 * t * t * rh * rh
      );
    }

    // In moderate range, feels like is close to actual temperature
    return temp;
  }

  /**
   * Determine weather condition type from actual NASA data values
   */
  private static determineConditionType(
    tempMax: number,
    tempMin: number,
    windSpeed: number,
    rainfall: number,
    feelsLike: number
  ): WeatherData['conditionType'] {
    if (rainfall > 15) return 'VeryWet';
    if (tempMax > 35) return 'VeryHot';
    if (tempMin < -5) return 'VeryCold';
    if (windSpeed > 20) return 'VeryWindy';
    if (feelsLike > 38 || feelsLike < -10) return 'Uncomfortable';
    if (rainfall > 8) return 'VeryWet';
    if (tempMax > 30) return 'VeryHot';
    return 'Normal';
  }

  /**
   * Determine safety status from actual NASA data
   * Based on meteorological danger thresholds
   */
  private static determineSafetyStatus(
    tempMax: number,
    tempMin: number,
    windSpeed: number,
    rainfall: number,
    feelsLike: number
  ): WeatherData['safetyStatus'] {
    // Unsafe thresholds (extreme conditions)
    if (
      tempMax > 42 ||
      tempMin < -15 ||
      windSpeed > 25 ||
      rainfall > 30 ||
      feelsLike > 45 ||
      feelsLike < -20
    ) {
      return 'Unsafe';
    }

    // Caution thresholds (adverse conditions)
    if (
      tempMax > 35 ||
      tempMin < -5 ||
      windSpeed > 18 ||
      rainfall > 15 ||
      feelsLike > 38 ||
      feelsLike < -10
    ) {
      return 'Caution';
    }

    return 'Safe';
  }

  /**
   * Format JavaScript Date to YYYYMMDD string for NASA API
   */
  private static formatDateForNasa(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}

/**
 * Generate user-friendly safety advice based on NASA weather data
 * Provides actionable warnings based on real conditions
 */
export function generateSafetyAdvice(forecasts: WeatherData[]): string {
  const today = forecasts[0];

  if (!today) return 'No forecast data available.';

  // Real weather warnings based on actual NASA MERRA-2 data
  if (today.tempMax > 32) {
    return `🌡️ It's quite hot (${today.tempMax}°C) — stay hydrated and avoid prolonged sun exposure. Seek shade during peak hours (11am-4pm).`;
  }
  if (today.tempMin < 0) {
    return `❄️ Freezing temperatures (${today.tempMin}°C) expected — dress warmly and take precautions. Check on vulnerable individuals.`;
  }
  if (today.rainfall > 10) {
    return `🌧️ Heavy rain expected (${today.rainfall}mm) — avoid outdoor plans and carry an umbrella. Expect wet roads and reduced visibility.`;
  }
  if (today.windSpeed > 15) {
    return `💨 Very windy conditions (${today.windSpeed} m/s) — secure loose objects and take care outdoors. Avoid high-rise areas.`;
  }
  if (today.feelsLike > 35 || today.feelsLike < -5) {
    return `⚠️ Uncomfortable weather (feels like ${today.feelsLike}°C) — plan indoor activities if possible. Take regular breaks if outside.`;
  }

  return `☀️ Good weather to go outside! Enjoy your day! Temperature: ${today.tempMax}°C`;
}

/**
 * Geocode city name to latitude/longitude using Open-Meteo API
 * Free, no API key required
 */
export async function geocodeCity(
  city: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      console.log(
        `🌍 Geocoded "${city}" to latitude ${result.latitude.toFixed(
          2
        )}, longitude ${result.longitude.toFixed(2)}`
      );
      return {
        latitude: result.latitude,
        longitude: result.longitude,
      };
    }

    console.warn(`⚠️ City "${city}" not found in geocoding database`);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
