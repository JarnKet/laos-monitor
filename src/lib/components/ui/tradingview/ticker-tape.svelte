<script lang="ts">
	import { mode } from 'mode-watcher';

	let container: HTMLDivElement;

	const symbols = [
		{ proName: 'OANDA:XAUUSD', title: 'Gold' },
		{ proName: 'NYMEX:CL1!', title: 'Crude Oil' },
		{ proName: 'FX:USDTHB', title: 'USD/THB' },
		{ proName: 'FX:USDCNY', title: 'USD/CNY' },
		{ proName: 'FX:USDSGD', title: 'USD/SGD' },
		{ proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
		{ proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq' },
		{ proName: 'INDEX:NKY', title: 'Nikkei 225' },
		{ proName: 'INDEX:HSI', title: 'Hang Seng' },
		{ proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
		{ proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
		{ proName: 'COMEX:GC1!', title: 'Gold Futures' },
	];

	function inject(isDark: boolean) {
		if (!container) return;
		container.innerHTML = '';
		const inner = document.createElement('div');
		inner.className = 'tradingview-widget-container__widget';
		container.appendChild(inner);

		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src =
			'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
		script.async = true;
		script.innerHTML = JSON.stringify({
			symbols,
			showSymbolLogo: true,
			isTransparent: false,
			displayMode: 'compact',
			colorTheme: isDark ? 'dark' : 'light',
			locale: 'en',
		});
		container.appendChild(script);
	}

	$effect(() => {
		const isDark = mode.current === 'dark';
		inject(isDark);
		return () => {
			if (container) container.innerHTML = '';
		};
	});
</script>

<div
	bind:this={container}
	class="tradingview-widget-container w-full overflow-hidden border-b"
	style="height: 46px;"
></div>
