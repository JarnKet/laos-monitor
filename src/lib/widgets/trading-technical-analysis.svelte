<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import TradingViewEmbed from '$lib/components/ui/tradingview/tradingview-embed.svelte';

	type Props = { id?: string; x?: number; y?: number; w?: number; h?: number };
	let { id = 'trading-technical-analysis', x = 0, y = 0, w = 4, h = 7 }: Props = $props();

	const config = {
		width: '100%',
		height: '100%',
		symbol: 'OANDA:XAUUSD',
		showIntervalTabs: true,
		interval: '1h',
		isTransparent: false,
		locale: 'en',
	};
</script>

<Widget {id} title="ການວິເຄາະທາງເທັກນິກ • Technical Analysis" {x} {y} {w} {h} minW={3} minH={4}>
	<TradingViewEmbed widgetName="technical-analysis" {config} />
</Widget>
