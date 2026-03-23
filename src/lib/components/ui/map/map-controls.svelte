<script lang="ts">
	import type { ControlPosition } from 'maplibre-gl';
	import { getMapContext } from './map-context.js';

	type Props = {
		position?: ControlPosition;
		showZoom?: boolean;
		showCompass?: boolean;
		showLocate?: boolean;
		showFullscreen?: boolean;
		onLocate?: (coords: { longitude: number; latitude: number }) => void;
	};

	let {
		position = 'bottom-right',
		showZoom = true,
		showCompass = false,
		showLocate = false,
		showFullscreen = false,
		onLocate,
	}: Props = $props();

	const ctx = getMapContext();

	$effect(() => {
		if (!ctx.map || !ctx.isLoaded) return;
		const map = ctx.map;

		const controls: import('maplibre-gl').IControl[] = [];
		let destroyed = false;

		import('maplibre-gl').then(({ NavigationControl, GeolocateControl, FullscreenControl }) => {
			if (destroyed) return;

			if (showZoom || showCompass) {
				const nav = new NavigationControl({ showZoom, showCompass });
				map.addControl(nav, position);
				controls.push(nav);
			}

			if (showLocate) {
				const geolocate = new GeolocateControl({
					positionOptions: { enableHighAccuracy: true },
					trackUserLocation: false,
				});
				geolocate.on('geolocate', (e: GeolocationPosition) => {
					onLocate?.({ longitude: e.coords.longitude, latitude: e.coords.latitude });
				});
				map.addControl(geolocate, position);
				controls.push(geolocate);
			}

			if (showFullscreen) {
				const fullscreen = new FullscreenControl();
				map.addControl(fullscreen, position);
				controls.push(fullscreen);
			}
		});

		return () => {
			destroyed = true;
			for (const control of controls) {
				map.removeControl(control);
			}
		};
	});
</script>
