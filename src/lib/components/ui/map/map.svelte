<script lang="ts">
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { Snippet } from 'svelte';
	import type { Map as MaplibreMap, ProjectionSpecification } from 'maplibre-gl';
	import { cn } from '$lib/utils.js';
	import { setMapContext } from './map-context.js';

	type MapViewport = {
		center?: [number, number];
		zoom?: number;
		bearing?: number;
		pitch?: number;
	};

	type Props = {
		class?: string;
		children?: Snippet;
		center?: [number, number];
		zoom?: number;
		styles?: { light?: string; dark?: string };
		projection?: ProjectionSpecification;
		viewport?: MapViewport;
		onViewportChange?: (viewport: MapViewport) => void;
		loading?: boolean;
		theme?: 'light' | 'dark';
		language?: string;
	};

	const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
	const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

	let {
		class: className,
		children,
		center = [0, 0],
		zoom = 2,
		styles,
		projection,
		viewport,
		onViewportChange,
		loading = false,
		theme,
		language,
	}: Props = $props();

	function applyLanguage(instance: MaplibreMap, lang: string) {
		for (const layer of instance.getStyle().layers) {
			if (layer.type === 'symbol' && layer.layout?.['text-field']) {
				instance.setLayoutProperty(layer.id, 'text-field', [
					'coalesce',
					['get', `name:${lang}`],
					['get', 'name'],
				]);
			}
		}
	}

	let container: HTMLDivElement | undefined = $state();
	let map = $state<MaplibreMap | null>(null);
	let isLoaded = $state(false);

	function getStyleUrl(dark: boolean): string {
		return dark ? (styles?.dark ?? DARK_STYLE) : (styles?.light ?? LIGHT_STYLE);
	}

	setMapContext({
		get map() {
			return map;
		},
		get isLoaded() {
			return isLoaded;
		},
	});

	$effect(() => {
		if (!container) return;

		let instance: MaplibreMap | null = null;
		let destroyed = false;
		let themeObserver: MutationObserver | undefined;

		import('maplibre-gl').then(({ Map: MapLibre }) => {
			if (destroyed) return;

			const isDark =
				theme === 'dark' ? true : theme === 'light' ? false : document.documentElement.classList.contains('dark');

			instance = new MapLibre({
				container: container!,
				style: getStyleUrl(isDark),
				center: viewport?.center ?? center,
				zoom: viewport?.zoom ?? zoom,
			});

			if (projection) {
				instance.on('load', () => instance!.setProjection(projection));
			}

			instance.on('load', () => {
				if (destroyed) return;
				if (language) applyLanguage(instance!, language);
				map = instance;
				isLoaded = true;
			});

			instance.on('style.load', () => {
				if (destroyed || !language) return;
				applyLanguage(instance!, language);
			});

			instance.on('moveend', () => {
				if (!instance) return;
				onViewportChange?.({
					center: instance.getCenter().toArray() as [number, number],
					zoom: instance.getZoom(),
					bearing: instance.getBearing(),
					pitch: instance.getPitch(),
				});
			});

			if (theme === undefined) {
				const observer = new MutationObserver(() => {
					instance?.setStyle(getStyleUrl(document.documentElement.classList.contains('dark')));
				});
				observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
				themeObserver = observer;
			}
		});

		return () => {
			destroyed = true;
			themeObserver?.disconnect();
			instance?.remove();
			map = null;
			isLoaded = false;
		};
	});

	$effect(() => {
		if (!map || !isLoaded || !viewport) return;
		const m = map;
		if (viewport.center) m.setCenter(viewport.center);
		if (viewport.zoom !== undefined) m.setZoom(viewport.zoom);
		if (viewport.bearing !== undefined) m.setBearing(viewport.bearing);
		if (viewport.pitch !== undefined) m.setPitch(viewport.pitch);
	});
</script>

<div class={cn('relative h-full w-full', className)}>
	<div bind:this={container} class="h-full w-full"></div>
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center bg-background/50">
			<div class="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
		</div>
	{/if}
	{#if isLoaded}
		{@render children?.()}
	{/if}
</div>
