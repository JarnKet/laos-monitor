<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import TradingViewEmbed from '$lib/components/ui/tradingview/tradingview-embed.svelte';

	type Props = { id?: string; x?: number; y?: number; w?: number; h?: number };
	let { id = 'trading-advanced-chart', x = 0, y = 0, w = 8, h = 9 }: Props = $props();

	const config = {
		width: '100%',
		height: '100%',
		symbol: 'OANDA:XAUUSD',
		interval: 'D',
		timezone: 'Asia/Vientiane',
		style: '1',
		locale: 'en',
		allow_symbol_change: true,
		calendar: false,
		hide_top_toolbar: false,
		hide_legend: false,
		save_image: false,
		isTransparent: false,
	};
</script>

<Widget {id} title="ກຣາຟລາຄາ • Advanced Chart" {x} {y} {w} {h} minW={4} minH={5}>
	<TradingViewEmbed widgetName="advanced-chart" {config} />
</Widget>
