<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import TradingViewEmbed from '$lib/components/ui/tradingview/tradingview-embed.svelte';

	type Props = { id?: string; x?: number; y?: number; w?: number; h?: number };
	let { id = 'trading-economic-calendar', x = 0, y = 0, w = 5, h = 8 }: Props = $props();

	const config = {
		width: '100%',
		height: '100%',
		isTransparent: false,
		locale: 'en',
		importanceFilter: '-1,0,1',
		countryFilter: 'cn,jp,au,in,sg,th,kr,hk,nz,id,my,ph,vn,us,eu,gb',
	};
</script>

<Widget {id} title="ປະຕິທິນເສດຖະກິດ • Economic Calendar" {x} {y} {w} {h} minW={3} minH={5}>
	<TradingViewEmbed widgetName="events" {config} />
</Widget>
