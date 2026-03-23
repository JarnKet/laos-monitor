<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import TradingViewEmbed from '$lib/components/ui/tradingview/tradingview-embed.svelte';

	type Props = { id?: string; x?: number; y?: number; w?: number; h?: number };
	let { id = 'trading-forex-cross-rates', x = 0, y = 0, w = 6, h = 7 }: Props = $props();

	const config = {
		width: '100%',
		height: '100%',
		currencies: ['USD', 'EUR', 'JPY', 'THB', 'CNY', 'SGD'],
		isTransparent: false,
		locale: 'en',
	};
</script>

<Widget {id} title="ອັດຕາແລກປ່ຽນ • Forex Cross Rates" {x} {y} {w} {h} minW={3} minH={4}>
	<TradingViewEmbed widgetName="forex-cross-rates" {config} />
</Widget>
