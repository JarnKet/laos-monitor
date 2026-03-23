<script lang="ts">
	import { Map, MapControls, UserLocation } from '$lib/components/ui/map/index.js';
	import MapRasterLayer from '$lib/components/ui/map/map-raster-layer.svelte';
	import Widget from '$lib/components/dashboard/widget.svelte';

	const LAYERS = [
		{ type: 'usepa-aqi', label: 'AQI' },
		{ type: 'usepa-pm25', label: 'PM2.5' },
		{ type: 'usepa-10', label: 'PM10' },
		{ type: 'usepa-o3', label: 'O₃' },
		{ type: 'usepa-no2', label: 'NO₂' },
	] as const;

	type LayerType = (typeof LAYERS)[number]['type'];

	type Props = {
		id?: string;
		token: string;
		x?: number;
		y?: number;
		w?: number;
		h?: number;
	};

	let { id = 'aqi-map-widget', token, x = 0, y = 7, w = 8, h = 8 }: Props = $props();

	let activeLayer = $state<LayerType>('usepa-aqi');

	const tiles = $derived([
		`https://tiles.aqicn.org/tiles/${activeLayer}/{z}/{x}/{y}.png?token=${token}`,
	]);
</script>

<Widget {id} title="ແຜນທີ່ AQI • Air Quality Map" {x} {y} {w} {h} minW={3} minH={4}>
	<Map center={[102.495, 17.975]} zoom={5} language="lo" class="rounded-none">
		<MapRasterLayer id="aqicn" {tiles} opacity={0.75} />
		<MapControls showZoom showCompass />
		<UserLocation />

		<!-- Layer selector overlay -->
		<div class="absolute bottom-8 left-2 z-10 flex gap-1 rounded-lg bg-background/80 p-1 shadow-sm backdrop-blur-sm">
			{#each LAYERS as layer}
				<button
					class="rounded px-2 py-0.5 text-xs font-medium transition-colors"
					class:bg-primary={activeLayer === layer.type}
					class:text-primary-foreground={activeLayer === layer.type}
					class:bg-muted={activeLayer !== layer.type}
					class:text-muted-foreground={activeLayer !== layer.type}
					onclick={() => (activeLayer = layer.type)}
				>
					{layer.label}
				</button>
			{/each}
		</div>
	</Map>
</Widget>
