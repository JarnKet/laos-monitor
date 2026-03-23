<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PopupOptions } from 'maplibre-gl';
	import { cn } from '$lib/utils.js';
	import { getMapContext } from './map-context.js';

	type Props = Omit<PopupOptions, 'closeButton'> & {
		longitude: number;
		latitude: number;
		children?: Snippet;
		class?: string;
		closeButton?: boolean;
		onClose?: () => void;
	};

	let {
		longitude,
		latitude,
		children,
		class: className,
		closeButton = false,
		onClose,
		...popupOptions
	}: Props = $props();

	const ctx = getMapContext();
	let popupEl: HTMLDivElement | undefined = $state();
	let popupInstance = $state<import('maplibre-gl').Popup | null>(null);

	$effect(() => {
		if (!ctx.map || !ctx.isLoaded || !popupEl) return;
		const map = ctx.map;
		const content = popupEl;

		let destroyed = false;
		let instance: import('maplibre-gl').Popup | null = null;

		import('maplibre-gl').then(({ Popup }) => {
			if (destroyed) return;

			instance = new Popup({
				closeButton,
				...popupOptions,
			})
				.setLngLat([longitude, latitude])
				.setDOMContent(content)
				.addTo(map);

			if (onClose) instance.on('close', onClose);
			popupInstance = instance;
		});

		return () => {
			destroyed = true;
			instance?.remove();
			popupInstance = null;
		};
	});

	$effect(() => {
		popupInstance?.setLngLat([longitude, latitude]);
	});
</script>

<div bind:this={popupEl} class={cn('p-1 text-sm', className)}>
	{@render children?.()}
</div>
