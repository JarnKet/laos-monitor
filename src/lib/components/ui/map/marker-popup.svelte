<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PopupOptions } from 'maplibre-gl';
	import { cn } from '$lib/utils.js';
	import { getMarkerContext } from './map-context.js';

	type Props = Omit<PopupOptions, 'closeButton'> & {
		children?: Snippet;
		class?: string;
		closeButton?: boolean;
	};

	let { children, class: className, closeButton = false, ...popupOptions }: Props = $props();

	const markerCtx = getMarkerContext();
	let popupEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!markerCtx.marker || !popupEl) return;
		const marker = markerCtx.marker;
		const content = popupEl;

		let destroyed = false;
		let popupInstance: import('maplibre-gl').Popup | null = null;

		import('maplibre-gl').then(({ Popup }) => {
			if (destroyed) return;

			popupInstance = new Popup({
				closeButton,
				...popupOptions,
			}).setDOMContent(content);

			marker.setPopup(popupInstance);
		});

		return () => {
			destroyed = true;
			if (popupInstance) {
				marker.setPopup(undefined as never);
				popupInstance.remove();
			}
		};
	});
</script>

<div bind:this={popupEl} class={cn('p-1 text-sm', className)}>
	{@render children?.()}
</div>
