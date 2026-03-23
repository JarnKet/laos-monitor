<script lang="ts">
	import { getMapContext } from './map-context.js';

	type Props = {
		id?: string;
		tiles: string[];
		opacity?: number;
		attribution?: string;
	};

	let {
		id = 'raster-layer',
		tiles,
		opacity = 0.7,
		attribution = '© <a href="https://waqi.info">WAQI</a>',
	}: Props = $props();

	const ctx = getMapContext();

	const sourceId = `${id}-source`;
	const layerId = `${id}-layer`;

	$effect(() => {
		if (!ctx.map || !ctx.isLoaded) return;
		const map = ctx.map;

		// Reading `tiles` here makes this effect re-run when tiles change
		const currentTiles = tiles;

		map.addSource(sourceId, {
			type: 'raster',
			tiles: currentTiles,
			tileSize: 256,
			attribution,
		});

		map.addLayer({
			id: layerId,
			type: 'raster',
			source: sourceId,
			paint: { 'raster-opacity': opacity },
		});

		return () => {
			if (map.getLayer(layerId)) map.removeLayer(layerId);
			if (map.getSource(sourceId)) map.removeSource(sourceId);
		};
	});

	// Update opacity without recreating the layer
	$effect(() => {
		if (!ctx.map || !ctx.isLoaded) return;
		if (!ctx.map.getLayer(layerId)) return;
		ctx.map.setPaintProperty(layerId, 'raster-opacity', opacity);
	});
</script>
