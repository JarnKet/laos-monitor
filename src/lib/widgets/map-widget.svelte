<script lang="ts">
	import { Map, MapControls, UserLocation } from '$lib/components/ui/map/index.js';
	import Widget from '$lib/components/dashboard/widget.svelte';

	type Props = {
		id?: string;
		x?: number;
		y?: number;
		w?: number;
		h?: number;
	};

	let { id = 'map-widget', x = 0, y = 0, w = 6, h = 7 }: Props = $props();
</script>

<Widget {id} title="ແຜນທີ່ລາວ • Map" {x} {y} {w} {h} minW={3} minH={4}>
	<Map center={[102.495, 17.975]} zoom={6} language="lo" class="rounded-none">
		<MapControls showZoom showCompass />
		<UserLocation />
	</Map>
</Widget>
