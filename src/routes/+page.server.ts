import type { PageServerLoad } from './$types';
import {
  fetchWeather,
  fetchAirQuality,
  type WeatherStation,
  type AirQualityStation,
} from '$lib/server/open-meteo';
import { fetchRssFeed, type RssFeed } from '$lib/server/rss';
import { env } from '$env/dynamic/private';

const LAOS_STATIONS = [
  { id: 'vientiane', label: 'ວຽງຈັນ', lat: 17.9667, lon: 102.6 },
  { id: 'luangprabang', label: 'ຫຼວງພະບາງ', lat: 19.8833, lon: 102.1333 },
  { id: 'savannakhet', label: 'ສະຫວັນນະເຂດ', lat: 16.5667, lon: 104.75 },
  { id: 'pakse', label: 'ປາກເຊ', lat: 15.1167, lon: 105.8 },
] as const;

export const load: PageServerLoad = async () => {
  const token = env.AQICN_TOKEN ?? 'demo';

  // Fetch weather, air quality, and news in parallel
  const [weather, airQuality, news] = await Promise.all([
    Promise.all(
      LAOS_STATIONS.map(
        async (s): Promise<WeatherStation> => ({
          id: s.id,
          label: s.label,
          data: await fetchWeather(s.id, s.lat, s.lon),
        }),
      ),
    ),
    Promise.all(
      LAOS_STATIONS.map(
        async (s): Promise<AirQualityStation> => ({
          id: s.id,
          label: s.label,
          data: await fetchAirQuality(s.id, s.lat, s.lon),
        }),
      ),
    ),
    fetchRssFeed('https://laotiantimes.com/feed/', 20).catch((): RssFeed => ({
      title: 'Laotian Times',
      items: [],
      fetchedAt: Date.now(),
    })),
  ]);

  // Token is intentionally exposed to the client — AQICN tile URLs
  // are browser-side requests and the token is visible in network traffic.
  return { weather, airQuality, aqicnToken: token, news };
};
