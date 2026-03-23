<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MarkerOptions, Marker } from 'maplibre-gl';
	import { getMapContext, setMarkerContext } from './map-context.js';

	type Props = Omit<MarkerOptions, 'element'> & {
		longitude: number;
		latitude: number;
		children?: Snippet;
		onClick?: (e: MouseEvent) => void;
		onMouseEnter?: (e: MouseEvent) => void;
		onMouseLeave?: (e: MouseEvent) => void;
	};

	let {
		longitude,
		latitude,
		children,
		onClick,
		onMouseEnter,
		onMouseLeave,
		...markerOptions
	}: Props = $props();

	const ctx = getMapContext();

	let el: HTMLDivElement | undefined = $state();
	let marker = $state<Marker | null>(null);

	setMarkerContext({
		get marker() {
			return marker;
		},
	});

	$effect(() => {
		if (!ctx.map || !ctx.isLoaded || !el) return;
		const map = ctx.map;
		const element = el;

		let markerInstance: Marker | null = null;
		let destroyed = false;

		import('maplibre-gl').then(({ Marker: MaplibreMarker }) => {
			if (destroyed) return;

			markerInstance = new MaplibreMarker({ element, ...markerOptions })
				.setLngLat([longitude, latitude])
				.addTo(map);

			marker = markerInstance;
		});

		return () => {
			destroyed = true;
			markerInstance?.remove();
			marker = null;
		};
	});

	$effect(() => {
		marker?.setLngLat([longitude, latitude]);
	});
</script>

<div
	bind:this={el}
	class="relative"
	onclick={onClick}
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
>
	{@render children?.()}
</div>
