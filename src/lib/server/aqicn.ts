const CACHE_TTL_MS = 60_000; // 1 minute

export interface AQIPollutant {
  v: number;
}

export interface AQIStation {
  aqi: number;
  city: {
    name: string;
    geo: [number, number];
    url: string;
  };
  time: {
    s: string;
    tz: string;
    v: number;
  };
  iaqi: {
    pm25?: AQIPollutant;
    pm10?: AQIPollutant;
    o3?: AQIPollutant;
    no2?: AQIPollutant;
    so2?: AQIPollutant;
    co?: AQIPollutant;
    t?: AQIPollutant; // temperature
    h?: AQIPollutant; // humidity
    w?: AQIPollutant; // wind
  };
  dominentpol?: string;
}

interface CacheEntry {
  data: AQIStation;
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();

export async function fetchAQIStation(location: string, token: string): Promise<AQIStation | null> {
  const now = Date.now();
  const cached = cache.get(location);

  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://api.waqi.info/feed/${location}/?token=${token}`, {
      signal: AbortSignal.timeout(5000),
    });
    const json: { status: string; data: AQIStation | string } = await res.json();

    if (json.status !== 'ok' || typeof json.data === 'string') {
      return null;
    }

    cache.set(location, { data: json.data, cachedAt: now });
    return json.data;
  } catch {
    return null;
  }
}
