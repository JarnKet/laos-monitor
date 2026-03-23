export interface WeatherInfo {
  description: string;
  icon: string;
}

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) return { description: 'Clear sky', icon: '☀️' };
  if (code === 1) return { description: 'Mainly clear', icon: '🌤️' };
  if (code === 2) return { description: 'Partly cloudy', icon: '⛅' };
  if (code === 3) return { description: 'Overcast', icon: '☁️' };
  if (code === 45 || code === 48) return { description: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { description: 'Drizzle', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { description: 'Rain', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { description: 'Snow', icon: '❄️' };
  if (code >= 80 && code <= 82) return { description: 'Rain showers', icon: '🌧️' };
  if (code >= 85 && code <= 86) return { description: 'Snow showers', icon: '🌨️' };
  if (code === 95) return { description: 'Thunderstorm', icon: '⛈️' };
  if (code >= 96) return { description: 'Thunderstorm + hail', icon: '⛈️' };
  return { description: 'Unknown', icon: '🌡️' };
}

const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export function getWindDirection(degrees: number): string {
  return WIND_DIRS[Math.round(degrees / 45) % 8];
}

export interface UVLevel {
  label: string;
  color: string;
}

export function getUVLevel(uv: number): UVLevel {
  if (uv <= 2) return { label: 'Low', color: '#3ea72d' };
  if (uv <= 5) return { label: 'Moderate', color: '#f7e401' };
  if (uv <= 7) return { label: 'High', color: '#f18b00' };
  if (uv <= 10) return { label: 'Very High', color: '#e53210' };
  return { label: 'Extreme', color: '#b567a4' };
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function getDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  const d = new Date(dateStr);
  return DAY_NAMES[d.getDay()];
}
