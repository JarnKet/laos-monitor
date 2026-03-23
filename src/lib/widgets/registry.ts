export type WidgetType =
  | 'map'
  | 'air-quality'
  | 'aqi-map'
  | 'weather'
  | 'news'
  | 'trading-market-overview'
  | 'trading-forex-cross-rates'
  | 'trading-economic-calendar'
  | 'trading-technical-analysis'
  | 'trading-advanced-chart';

export interface WidgetDef {
  type: WidgetType;
  title: string;
  description: string;
  defaultW: number;
  defaultH: number;
  minW: number;
  minH: number;
}

export interface ActiveWidget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WIDGET_REGISTRY: WidgetDef[] = [
  {
    type: 'map',
    title: 'ແຜນທີ່ • Map',
    description: 'Interactive map of Laos PDR with Lao place names',
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 4,
  },
  {
    type: 'air-quality',
    title: 'ຄຸນນະພາບອາກາດ • Air Quality',
    description: 'Real-time PM2.5 and AQI data for major Laos cities',
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    type: 'aqi-map',
    title: 'ແຜນທີ່ AQI • Air Quality Map',
    description: 'AQICN tile overlay showing air quality across Southeast Asia',
    defaultW: 8,
    defaultH: 8,
    minW: 3,
    minH: 4,
  },
  {
    type: 'weather',
    title: 'ອາກາດ • Weather',
    description: 'Current weather and 7-day forecast for major Laos cities — powered by Open-Meteo',
    defaultW: 4,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    type: 'news',
    title: 'ຂ່າວ • News',
    description: 'Latest news from Laotian Times RSS feed',
    defaultW: 4,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    type: 'trading-market-overview',
    title: 'ພາບລວມຕະຫຼາດ • Market Overview',
    description: 'Global indices, commodities, ASEAN currencies, and crypto — powered by TradingView',
    defaultW: 6,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    type: 'trading-forex-cross-rates',
    title: 'ອັດຕາແລກປ່ຽນ • Forex Cross Rates',
    description: 'USD, EUR, JPY, THB, CNY, SGD cross-rate matrix — powered by TradingView',
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 4,
  },
  {
    type: 'trading-economic-calendar',
    title: 'ປະຕິທິນເສດຖະກິດ • Economic Calendar',
    description: 'Upcoming economic events for Asia-Pacific and global markets — powered by TradingView',
    defaultW: 5,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    type: 'trading-technical-analysis',
    title: 'ການວິເຄາະທາງເທັກນິກ • Technical Analysis',
    description: 'Oscillators and moving averages summary for XAUUSD — powered by TradingView',
    defaultW: 4,
    defaultH: 7,
    minW: 3,
    minH: 4,
  },
  {
    type: 'trading-advanced-chart',
    title: 'ກຣາຟລາຄາ • Advanced Chart',
    description: 'Interactive candlestick chart, Asia/Vientiane timezone, default XAUUSD — powered by TradingView',
    defaultW: 8,
    defaultH: 9,
    minW: 4,
    minH: 5,
  },
];

export const DEFAULT_ACTIVE_WIDGETS: ActiveWidget[] = [
  { id: 'map', type: 'map', x: 0, y: 0, w: 6, h: 7 },
  { id: 'air-quality', type: 'air-quality', x: 6, y: 0, w: 6, h: 7 },
  { id: 'aqi-map', type: 'aqi-map', x: 0, y: 7, w: 8, h: 8 },
];
