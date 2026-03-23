<script lang="ts">
	import type { PageData } from './$types';
	import Grid from '$lib/components/dashboard/grid.svelte';
	import { setPageDataContext } from '$lib/context/page-data.svelte.js';

	let { data }: { data: PageData } = $props();

	setPageDataContext(data);
</script>

<Grid />
