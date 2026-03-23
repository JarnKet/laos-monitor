<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import TradingViewEmbed from '$lib/components/ui/tradingview/tradingview-embed.svelte';

	type Props = { id?: string; x?: number; y?: number; w?: number; h?: number };
	let { id = 'trading-market-overview', x = 0, y = 0, w = 6, h = 8 }: Props = $props();

	const config = {
		width: '100%',
		height: '100%',
		showSymbolLogo: true,
		isTransparent: false,
		locale: 'en',
		tabs: [
			{
				title: 'Indices',
				originalTitle: 'Indices',
				symbols: [
					{ s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
					{ s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
					{ s: 'FOREXCOM:DJI', d: 'Dow Jones' },
					{ s: 'INDEX:NKY', d: 'Nikkei 225' },
					{ s: 'INDEX:HSI', d: 'Hang Seng' },
					{ s: 'SET:SET', d: 'SET Thailand' },
				],
			},
			{
				title: 'Commodities',
				originalTitle: 'Commodities',
				symbols: [
					{ s: 'COMEX:GC1!', d: 'Gold' },
					{ s: 'COMEX:SI1!', d: 'Silver' },
					{ s: 'NYMEX:CL1!', d: 'Crude Oil' },
					{ s: 'NYMEX:NG1!', d: 'Natural Gas' },
					{ s: 'CBOT:ZC1!', d: 'Corn' },
					{ s: 'CBOT:ZW1!', d: 'Wheat' },
				],
			},
			{
				title: 'ASEAN',
				originalTitle: 'ASEAN',
				symbols: [
					{ s: 'FX:USDTHB', d: 'USD/THB' },
					{ s: 'FX:USDVND', d: 'USD/VND' },
					{ s: 'FX:USDMYR', d: 'USD/MYR' },
					{ s: 'FX:USDSGD', d: 'USD/SGD' },
					{ s: 'FX:USDIDR', d: 'USD/IDR' },
					{ s: 'FX:USDPHP', d: 'USD/PHP' },
				],
			},
			{
				title: 'Crypto',
				originalTitle: 'Crypto',
				symbols: [
					{ s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
					{ s: 'BITSTAMP:ETHUSD', d: 'Ethereum' },
					{ s: 'BINANCE:BNBUSDT', d: 'BNB' },
					{ s: 'COINBASE:SOLUSD', d: 'Solana' },
					{ s: 'BINANCE:XRPUSDT', d: 'XRP' },
					{ s: 'BINANCE:ADAUSDT', d: 'Cardano' },
				],
			},
		],
	};
</script>

<Widget {id} title="ພາບລວມຕະຫຼາດ • Market Overview" {x} {y} {w} {h} minW={3} minH={5}>
	<TradingViewEmbed widgetName="market-overview" {config} />
</Widget>
