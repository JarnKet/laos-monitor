<script lang="ts">
	import 'gridstack/dist/gridstack.min.css';
	import type { Snippet } from 'svelte';
	import type { GridStack, GridStackWidget } from 'gridstack';
	import { cn } from '$lib/utils.js';
	import { setGridContext } from './grid-context.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const LAYOUT_KEY = 'laos-monitor-grid-layout';

	type Props = {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children }: Props = $props();

	let el: HTMLDivElement | undefined = $state();
	let gridInstance = $state<GridStack | null>(null);
	let editMode = $state(false);
	let preEditLayout: GridStackWidget[] | undefined;

	setGridContext({
		get editMode() {
			return editMode;
		},
	});

	// Initialize gridstack
	$effect(() => {
		if (!el) return;

		let destroyed = false;

		import('gridstack').then(({ GridStack }) => {
			if (destroyed) return;

			const grid = GridStack.init(
				{
					cellHeight: 70,
					margin: 6,
					column: 12,
					resizable: { handles: 'se' },
					animate: true,
					float: false,
					staticGrid: true,
				},
				el
			);

			// Restore saved layout
			const saved = localStorage.getItem(LAYOUT_KEY);
			if (saved) {
				try {
					grid.load(JSON.parse(saved) as GridStackWidget[], false);
				} catch {
					// ignore corrupt saved data
				}
			}

			gridInstance = grid;
		});

		return () => {
			destroyed = true;
			gridInstance?.destroy(false);
			gridInstance = null;
		};
	});

	// Toggle static mode reactively when editMode or gridInstance changes
	$effect(() => {
		if (!gridInstance) return;
		gridInstance.setStatic(!editMode);
	});

	function startEdit() {
		preEditLayout = gridInstance?.save(false) as GridStackWidget[] | undefined;
		editMode = true;
	}

	function cancelEdit() {
		if (preEditLayout && gridInstance) {
			gridInstance.load(preEditLayout, false);
		}
		editMode = false;
	}

	function saveLayout() {
		if (gridInstance) {
			const layout = gridInstance.save(false);
			localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
		}
		editMode = false;
	}
</script>

<div class={cn('relative w-full', className)}>
	<!-- Floating toolbar -->
	<div class="absolute right-2 top-2 z-50 flex gap-2">
		{#if editMode}
			<Button size="sm" variant="outline" onclick={cancelEdit}>Cancel</Button>
			<Button size="sm" onclick={saveLayout}>Save Layout</Button>
		{:else}
			<Button size="sm" variant="outline" onclick={startEdit}>Edit Layout</Button>
		{/if}
	</div>

	<div bind:this={el} class="grid-stack w-full">
		{@render children?.()}
	</div>
</div>
