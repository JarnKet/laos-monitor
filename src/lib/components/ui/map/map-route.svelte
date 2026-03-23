<script lang="ts">
	import { getMapContext } from './map-context.js';

	type Props = {
		id?: string;
		coordinates: [number, number][];
		color?: string;
		width?: number;
		opacity?: number;
		dashArray?: [number, number];
		onClick?: () => void;
		onMouseEnter?: () => void;
		onMouseLeave?: () => void;
		interactive?: boolean;
	};

	let {
		id = crypto.randomUUID(),
		coordinates,
		color = '#4285F4',
		width = 3,
		opacity = 0.8,
		dashArray,
		onClick,
		onMouseEnter,
		onMouseLeave,
		interactive = true,
	}: Props = $props();

	const ctx = getMapContext();

	const sourceId = `route-source-${id}`;
	const layerId = `route-layer-${id}`;

	$effect(() => {
		if (!ctx.map || !ctx.isLoaded) return;
		const map = ctx.map;

		map.addSource(sourceId, {
			type: 'geojson',
			data: {
				type: 'Feature',
				properties: {},
				geometry: { type: 'LineString', coordinates },
			},
		});

		const paint: import('maplibre-gl').LineLayerSpecification['paint'] = {
			'line-color': color,
			'line-width': width,
			'line-opacity': opacity,
		};
		if (dashArray) (paint as Record<string, unknown>)['line-dasharray'] = dashArray;

		map.addLayer({
			id: layerId,
			type: 'line',
			source: sourceId,
			layout: { 'line-join': 'round', 'line-cap': 'round' },
			paint,
		});

		if (interactive) {
			if (onClick) map.on('click', layerId, onClick);
			if (onMouseEnter) map.on('mouseenter', layerId, onMouseEnter);
			if (onMouseLeave) map.on('mouseleave', layerId, onMouseLeave);
		}

		return () => {
			if (interactive) {
				if (onClick) map.off('click', layerId, onClick);
				if (onMouseEnter) map.off('mouseenter', layerId, onMouseEnter);
				if (onMouseLeave) map.off('mouseleave', layerId, onMouseLeave);
			}
			if (map.getLayer(layerId)) map.removeLayer(layerId);
			if (map.getSource(sourceId)) map.removeSource(sourceId);
		};
	});

	$effect(() => {
		if (!ctx.map || !ctx.isLoaded) return;
		const source = ctx.map.getSource(sourceId) as import('maplibre-gl').GeoJSONSource | undefined;
		source?.setData({
			type: 'Feature',
			properties: {},
			geometry: { type: 'LineString', coordinates },
		});
	});
</script>
