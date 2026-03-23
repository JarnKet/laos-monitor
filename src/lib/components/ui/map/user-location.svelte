<script lang="ts">
	import { getMapContext } from './map-context.js';
	import { getLocationContext } from '$lib/context/location.svelte.js';

	const mapCtx = getMapContext();
	const locationCtx = getLocationContext();

	let markerInstance = $state<import('maplibre-gl').Marker | null>(null);

	// 1. Create marker element once when map is ready
	$effect(() => {
		if (!mapCtx.map || !mapCtx.isLoaded) return;

		let destroyed = false;
		let marker: import('maplibre-gl').Marker | null = null;

		const el = document.createElement('div');
		el.className = 'relative flex items-center justify-center';

		const ping = document.createElement('div');
		ping.className = 'absolute size-8 animate-ping rounded-full bg-blue-400 opacity-60';

		const dot = document.createElement('div');
		dot.className = 'size-3 rounded-full bg-blue-500 shadow-md ring-2 ring-white';

		el.appendChild(ping);
		el.appendChild(dot);

		import('maplibre-gl').then(({ Marker }) => {
			if (destroyed) return;
			marker = new Marker({ element: el, anchor: 'center' });
			markerInstance = marker;
		});

		return () => {
			destroyed = true;
			marker?.remove();
			markerInstance = null;
		};
	});

	// 2. Show / update marker position when coords arrive
	$effect(() => {
		const coords = locationCtx.coords;
		if (!coords || !markerInstance || !mapCtx.map) return;
		markerInstance.setLngLat([coords.longitude, coords.latitude]).addTo(mapCtx.map);
	});

	// 3. Fly to location when navbar button triggered it
	$effect(() => {
		const coords = locationCtx.coords;
		if (!coords || !mapCtx.map || !locationCtx.shouldFlyTo) return;
		mapCtx.map.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14 });
		locationCtx.clearFlyTo();
	});
</script>
