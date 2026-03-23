// ─── Weather ─────────────────────────────────────────────────────────────────

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast;
}

export interface WeatherStation {
  id: string;
  label: string;
  data: WeatherData | null;
}

const weatherCache = new Map<string, { data: WeatherData; expiresAt: number }>();
const WEATHER_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchWeather(
  id: string,
  lat: number,
  lon: number,
): Promise<WeatherData | null> {
  const now = Date.now();
  const cached = weatherCache.get(id);
  if (cached && cached.expiresAt > now) return cached.data;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max',
  );
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('timezone', 'Asia/Vientiane');
  url.searchParams.set('forecast_days', '7');

  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = (await res.json()) as WeatherData;
    weatherCache.set(id, { data: json, expiresAt: now + WEATHER_TTL });
    return json;
  } catch {
    return null;
  }
}

// ─── Air Quality (Copernicus CAMS via Open-Meteo) ─────────────────────────────

export interface CurrentAirQuality {
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  ozone: number;
  sulphur_dioxide: number;
  dust: number;
  uv_index: number;
  us_aqi: number;
  european_aqi: number;
  time: string;
}

export interface AirQualityData {
  current: CurrentAirQuality;
}

export interface AirQualityStation {
  id: string;
  label: string;
  data: AirQualityData | null;
}

const aqiCache = new Map<string, { data: AirQualityData; expiresAt: number }>();
const AQI_TTL = 60 * 1000; // 1 minute

export async function fetchAirQuality(
  id: string,
  lat: number,
  lon: number,
): Promise<AirQualityData | null> {
  const now = Date.now();
  const cached = aqiCache.get(id);
  if (cached && cached.expiresAt > now) return cached.data;

  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set(
    'current',
    'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,dust,uv_index,us_aqi,european_aqi',
  );
  url.searchParams.set('timezone', 'Asia/Vientiane');

  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = (await res.json()) as AirQualityData;
    aqiCache.set(id, { data: json, expiresAt: now + AQI_TTL });
    return json;
  } catch {
    return null;
  }
}
