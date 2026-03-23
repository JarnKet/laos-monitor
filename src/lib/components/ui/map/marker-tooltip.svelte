<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PopupOptions } from 'maplibre-gl';
	import { cn } from '$lib/utils.js';
	import { getMarkerContext, getMapContext } from './map-context.js';

	type Props = Omit<PopupOptions, 'closeButton' | 'closeOnClick'> & {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...popupOptions }: Props = $props();

	const mapCtx = getMapContext();
	const markerCtx = getMarkerContext();
	let popupEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!mapCtx.map || !mapCtx.isLoaded || !markerCtx.marker || !popupEl) return;
		const map = mapCtx.map;
		const marker = markerCtx.marker;
		const content = popupEl;
		const markerEl = marker.getElement();

		let destroyed = false;
		let popupInstance: import('maplibre-gl').Popup | null = null;
		let showHandler: () => void;
		let hideHandler: () => void;

		import('maplibre-gl').then(({ Popup }) => {
			if (destroyed) return;

			popupInstance = new Popup({
				closeButton: false,
				closeOnClick: false,
				...popupOptions,
			}).setDOMContent(content);

			showHandler = () => {
				const lngLat = marker.getLngLat();
				popupInstance?.setLngLat(lngLat).addTo(map);
			};

			hideHandler = () => {
				popupInstance?.remove();
			};

			markerEl.addEventListener('mouseenter', showHandler);
			markerEl.addEventListener('mouseleave', hideHandler);
		});

		return () => {
			destroyed = true;
			popupInstance?.remove();
			if (showHandler) markerEl.removeEventListener('mouseenter', showHandler);
			if (hideHandler) markerEl.removeEventListener('mouseleave', hideHandler);
		};
	});
</script>

<div bind:this={popupEl} class={cn('px-2 py-1 text-xs', className)}>
	{@render children?.()}
</div>
