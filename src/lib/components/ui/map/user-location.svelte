<script lang="ts">
	import MapMarker from './map-marker.svelte';

	let coords = $state<{ longitude: number; latitude: number } | null>(null);

	$effect(() => {
		if (!navigator.geolocation) return;

		const id = navigator.geolocation.watchPosition(
			(pos) => {
				coords = {
					longitude: pos.coords.longitude,
					latitude: pos.coords.latitude,
				};
			},
			() => {
				// permission denied or unavailable — fail silently
			},
			{ enableHighAccuracy: true }
		);

		return () => navigator.geolocation.clearWatch(id);
	});
</script>

{#if coords}
	<MapMarker longitude={coords.longitude} latitude={coords.latitude} anchor="center">
		<div class="relative flex items-center justify-center">
			<div class="absolute size-8 animate-ping rounded-full bg-blue-400 opacity-60"></div>
			<div class="size-3 rounded-full bg-blue-500 shadow-md ring-2 ring-white"></div>
		</div>
	</MapMarker>
{/if}
