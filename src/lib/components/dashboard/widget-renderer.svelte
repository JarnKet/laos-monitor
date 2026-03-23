<script lang="ts">
	import type { ActiveWidget } from '$lib/widgets/registry.js';
	import { getPageDataContext } from '$lib/context/page-data.svelte.js';
	import MapWidget from '$lib/widgets/map-widget.svelte';
	import AirQualityWidget from '$lib/widgets/air-quality-widget.svelte';
	import AqiMapWidget from '$lib/widgets/aqi-map-widget.svelte';
	import WeatherWidget from '$lib/widgets/weather-widget.svelte';
	import NewsWidget from '$lib/widgets/news-widget.svelte';
	import TradingMarketOverviewWidget from '$lib/widgets/trading-market-overview.svelte';
	import TradingForexCrossRatesWidget from '$lib/widgets/trading-forex-cross-rates.svelte';
	import TradingEconomicCalendarWidget from '$lib/widgets/trading-economic-calendar.svelte';
	import TradingTechnicalAnalysisWidget from '$lib/widgets/trading-technical-analysis.svelte';
	import TradingAdvancedChartWidget from '$lib/widgets/trading-advanced-chart.svelte';

	let { widget }: { widget: ActiveWidget } = $props();
	const pageData = getPageDataContext();
</script>

{#if widget.type === 'map'}
	<MapWidget id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h} />
{:else if widget.type === 'air-quality'}
	<AirQualityWidget
		id={widget.id}
		x={widget.x}
		y={widget.y}
		w={widget.w}
		h={widget.h}
		airQuality={pageData.airQuality}
	/>
{:else if widget.type === 'aqi-map'}
	<AqiMapWidget
		id={widget.id}
		x={widget.x}
		y={widget.y}
		w={widget.w}
		h={widget.h}
		token={pageData.aqicnToken}
	/>
{:else if widget.type === 'weather'}
	<WeatherWidget
		id={widget.id}
		x={widget.x}
		y={widget.y}
		w={widget.w}
		h={widget.h}
		weather={pageData.weather}
	/>
{:else if widget.type === 'news'}
	<NewsWidget
		id={widget.id}
		x={widget.x}
		y={widget.y}
		w={widget.w}
		h={widget.h}
		news={pageData.news}
	/>
{:else if widget.type === 'trading-market-overview'}
	<TradingMarketOverviewWidget id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h} />
{:else if widget.type === 'trading-forex-cross-rates'}
	<TradingForexCrossRatesWidget id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h} />
{:else if widget.type === 'trading-economic-calendar'}
	<TradingEconomicCalendarWidget id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h} />
{:else if widget.type === 'trading-technical-analysis'}
	<TradingTechnicalAnalysisWidget id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h} />
{:else if widget.type === 'trading-advanced-chart'}
	<TradingAdvancedChartWidget id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h} />
{/if}
