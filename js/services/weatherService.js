/**
 * @file weatherService.js
 * Weather Intelligence Service for FarmWise
 * Integrates real Open-Meteo Live API with fallback simulation mode.
 * Real district coordinates for Punjab, Maharashtra, Haryana, MP, UP.
 */

const DISTRICT_COORDINATES = {
  // Punjab
  Ludhiana: { lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  Bhatinda: { lat: 30.2110, lon: 74.9455, state: 'Punjab' },
  Amritsar: { lat: 31.6340, lon: 74.8723, state: 'Punjab' },
  Patiala: { lat: 30.3398, lon: 76.3869, state: 'Punjab' },
  Jalandhar: { lat: 31.3260, lon: 75.5762, state: 'Punjab' },
  Sangrur: { lat: 30.2458, lon: 75.8421, state: 'Punjab' },
  Firozpur: { lat: 30.9237, lon: 74.6110, state: 'Punjab' },

  // Maharashtra
  Yavatmal: { lat: 20.3888, lon: 78.1204, state: 'Maharashtra' },
  Nagpur: { lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
  Amravati: { lat: 20.9320, lon: 77.7523, state: 'Maharashtra' },
  Aurangabad: { lat: 19.8762, lon: 75.3433, state: 'Maharashtra' },
  Nashik: { lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
  Kolhapur: { lat: 16.7050, lon: 74.2433, state: 'Maharashtra' },
  Akola: { lat: 20.7002, lon: 77.0082, state: 'Maharashtra' },

  // Madhya Pradesh
  Indore: { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  Ujjain: { lat: 23.1765, lon: 75.7885, state: 'Madhya Pradesh' },
  Dewas: { lat: 22.9676, lon: 76.0534, state: 'Madhya Pradesh' },

  // Haryana
  Karnal: { lat: 29.6857, lon: 76.9905, state: 'Haryana' },
  Hisar: { lat: 29.1492, lon: 75.7217, state: 'Haryana' },

  // Uttar Pradesh
  Meerut: { lat: 28.9845, lon: 77.7064, state: 'Uttar Pradesh' },
  Varanasi: { lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },

  // Andhra Pradesh
  Guntur: { lat: 16.3067, lon: 80.4365, state: 'Andhra Pradesh' }
};

const STORAGE_KEY_WEATHER_MODE = 'farmwise_weather_mode'; // 'live' | 'simulation'

export class WeatherService {
  /**
   * Get active mode: 'live' | 'simulation' (defaults to 'live')
   */
  static getMode() {
    try {
      return localStorage.getItem(STORAGE_KEY_WEATHER_MODE) || 'live';
    } catch {
      return 'live';
    }
  }

  static setMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY_WEATHER_MODE, mode);
    } catch (e) {
      console.warn('Could not save weather mode:', e);
    }
  }

  /**
   * Fetches weather for a district.
   * If live mode is active, calls Open-Meteo API. If offline/error or simulation mode, returns simulated weather.
   */
  static async fetchWeatherForDistrict(districtName = 'Ludhiana') {
    const mode = this.getMode();
    const coords = DISTRICT_COORDINATES[districtName] || DISTRICT_COORDINATES['Ludhiana'];

    if (mode === 'simulation') {
      return this.getSimulatedWeather(districtName, coords);
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo HTTP ${response.status}`);
      }

      const data = await response.json();
      const current = data.current || {};
      const daily = data.daily || {};

      const tempC = Math.round(current.temperature_2m ?? 26);
      const humidity = Math.round(current.relative_humidity_2m ?? 60);
      const windSpeed = Math.round(current.wind_speed_10m ?? 8);
      const rainProb = daily.precipitation_probability_max?.[0] ?? 15;
      
      // Calculate 7-day sum of rainfall
      const forecast7DayRain = daily.precipitation_sum
        ? Math.round(daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + (b || 0), 0))
        : 8;

      const weatherCode = current.weather_code || 0;
      const weatherSummary = this.mapWeatherCodeToSummary(weatherCode, tempC, rainProb);

      // Construct 5-day forecast list
      const forecastDays = [];
      if (daily.time && daily.time.length > 0) {
        for (let i = 0; i < Math.min(5, daily.time.length); i++) {
          forecastDays.push({
            date: daily.time[i],
            maxTemp: Math.round(daily.temperature_2m_max[i]),
            minTemp: Math.round(daily.temperature_2m_min[i]),
            rainProb: daily.precipitation_probability_max[i] || 0,
            rainMm: Math.round(daily.precipitation_sum[i] || 0),
            icon: this.mapWeatherCodeToIcon(daily.weather_code[i])
          });
        }
      }

      return {
        isLive: true,
        source: 'Open-Meteo Live API',
        district: districtName,
        state: coords.state,
        temperatureC: tempC,
        humidityPercent: humidity,
        windSpeedKmH: windSpeed,
        rainfallProbability: rainProb,
        forecastRainMm: forecast7DayRain,
        weatherSummary,
        forecastDays,
        timestamp: Date.now()
      };
    } catch (err) {
      console.warn('Live weather fetch failed, falling back to simulation:', err);
      const sim = this.getSimulatedWeather(districtName, coords);
      sim.fallbackReason = 'Live weather server unreachable; displaying simulated seasonal weather.';
      return sim;
    }
  }

  static getSimulatedWeather(districtName, coords) {
    const isNorth = coords.state === 'Punjab' || coords.state === 'Haryana';
    const baseTemp = isNorth ? 23 : 31;
    const baseHumidity = isNorth ? 58 : 68;

    return {
      isLive: false,
      source: 'SIMULATION MODE (Seasonal Climatology Model)',
      district: districtName,
      state: coords.state,
      temperatureC: baseTemp,
      humidityPercent: baseHumidity,
      windSpeedKmH: 10,
      rainfallProbability: 25,
      forecastRainMm: 12,
      weatherSummary: isNorth
        ? 'Partly cloudy, mild winter breeze, optimal conditions for crop growth.'
        : 'Warm and humid, favorable for vegetative growth with occasional scattered showers.',
      forecastDays: [
        { date: 'Day 1', maxTemp: baseTemp + 2, minTemp: baseTemp - 8, rainProb: 20, rainMm: 2, icon: '⛅' },
        { date: 'Day 2', maxTemp: baseTemp + 3, minTemp: baseTemp - 7, rainProb: 35, rainMm: 5, icon: '🌦️' },
        { date: 'Day 3', maxTemp: baseTemp + 1, minTemp: baseTemp - 9, rainProb: 15, rainMm: 0, icon: '☀️' },
        { date: 'Day 4', maxTemp: baseTemp + 2, minTemp: baseTemp - 8, rainProb: 10, rainMm: 0, icon: '☀️' },
        { date: 'Day 5', maxTemp: baseTemp + 4, minTemp: baseTemp - 6, rainProb: 40, rainMm: 8, icon: '🌧️' }
      ],
      timestamp: Date.now()
    };
  }

  static mapWeatherCodeToSummary(code, temp, rainProb) {
    if (code === 0) return `Clear skies, bright sunshine (${temp}°C). Optimal field conditions.`;
    if (code >= 1 && code <= 3) return `Mainly clear to partly cloudy (${temp}°C). Mild breeze.`;
    if (code >= 51 && code <= 67) return `Light to moderate rain showers expected (${rainProb}% probability). Delay pesticide sprays.`;
    if (code >= 71 && code <= 77) return `Cold conditions with low frost warning. Monitor sensitive crops.`;
    if (code >= 80 && code <= 82) return `Heavy rain showers expected (${rainProb}% prob). Avoid high field irrigation.`;
    if (code >= 95) return `Thunderstorm warnings. Secure spray equipment and stay clear of open metal structures.`;
    return `Partly cloudy with mild conditions (${temp}°C).`;
  }

  static mapWeatherCodeToIcon(code) {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌦️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 95) return '⛈️';
    return '⛅';
  }
}
