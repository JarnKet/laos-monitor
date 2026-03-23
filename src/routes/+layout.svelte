<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { untrack } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { setCounterContext } from '$lib/context/counter.svelte';
	import { createLocationState, setLocationContext } from '$lib/context/location.svelte';
	import { createDashboardContext, setDashboardContext } from '$lib/context/dashboard.svelte.js';
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import TickerTape from '$lib/components/ui/tradingview/ticker-tape.svelte';

	let { children, data } = $props();

	setCounterContext({ count: untrack(() => data.count) });
	setLocationContext(createLocationState());
	setDashboardContext(createDashboardContext());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Laos Monitor</title>
</svelte:head>

<ModeWatcher />

<div class="flex h-screen flex-col overflow-hidden bg-background">
	<Navbar />
	<TickerTape />
	<main class="flex-1 overflow-auto p-2">
		{@render children()}
	</main>
</div>
