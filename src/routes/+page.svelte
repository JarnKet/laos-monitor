<script lang="ts">
	import Grid from '$lib/components/dashboard/grid.svelte';
	import MapWidget from '$lib/widgets/map-widget.svelte';
</script>

<Grid>
	<MapWidget x={0} y={0} w={6} h={7} />
</Grid>
