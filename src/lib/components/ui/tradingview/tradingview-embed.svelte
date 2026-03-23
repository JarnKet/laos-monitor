<script lang="ts">
	import { onMount } from 'svelte';

	let {
		widgetName,
		config,
	}: {
		widgetName: string;
		config: Record<string, unknown>;
	} = $props();

	let widgetEl: HTMLDivElement;

	function inject(isDark: boolean) {
		if (!widgetEl) return;
		// Remove any previously injected script + iframe
		widgetEl.innerHTML = '';

		const theme = isDark ? 'dark' : 'light';
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widgetName}.js`;
		script.async = true;
		script.innerHTML = JSON.stringify({ ...config, colorTheme: theme, theme });
		widgetEl.appendChild(script);
	}

	onMount(() => {
		inject(document.documentElement.classList.contains('dark'));

		const observer = new MutationObserver(() => {
			inject(document.documentElement.classList.contains('dark'));
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => {
			observer.disconnect();
			if (widgetEl) widgetEl.innerHTML = '';
		};
	});
</script>

<div class="tradingview-widget-container h-full w-full overflow-hidden">
	<div bind:this={widgetEl} class="tradingview-widget-container__widget h-full w-full"></div>
</div>
