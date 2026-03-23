<script lang="ts">
	import 'gridstack/dist/gridstack.min.css';
	import { tick } from 'svelte';
	import type { GridStack, GridStackWidget } from 'gridstack';
	import { cn } from '$lib/utils.js';
	import { setGridContext } from './grid-context.js';
	import { getDashboardContext } from '$lib/context/dashboard.svelte.js';
	import WidgetDrawer from './widget-drawer.svelte';
	import WidgetRenderer from './widget-renderer.svelte';
	import { WIDGET_REGISTRY, DEFAULT_ACTIVE_WIDGETS, type ActiveWidget } from '$lib/widgets/registry.js';

	const LAYOUT_KEY = 'laos-monitor-grid-layout';
	const WIDGETS_KEY = 'laos-monitor-widgets';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	let el = $state<HTMLDivElement | undefined>(undefined);
	let gridInstance = $state<GridStack | null>(null);
	let preEditLayout: GridStackWidget[] | undefined;
	let preEditWidgets: ActiveWidget[] | undefined;

	const dashCtx = getDashboardContext();

	function loadWidgets(): ActiveWidget[] {
		if (typeof window === 'undefined') return DEFAULT_ACTIVE_WIDGETS;
		try {
			const saved = localStorage.getItem(WIDGETS_KEY);
			return saved ? (JSON.parse(saved) as ActiveWidget[]) : DEFAULT_ACTIVE_WIDGETS;
		} catch {
			return DEFAULT_ACTIVE_WIDGETS;
		}
	}

	let activeWidgets = $state<ActiveWidget[]>(DEFAULT_ACTIVE_WIDGETS);

	$effect(() => {
		activeWidgets = loadWidgets();
	});

	function saveWidgets() {
		localStorage.setItem(WIDGETS_KEY, JSON.stringify(activeWidgets));
	}

	const activeWidgetTypes = $derived(activeWidgets.map((w) => w.type));

	// Register grid implementation with the dashboard context
	dashCtx.register({
		onStartEdit() {
			preEditLayout = gridInstance?.save(false) as GridStackWidget[] | undefined;
			preEditWidgets = [...activeWidgets];
		},
		onCancelEdit() {
			if (preEditWidgets) activeWidgets = preEditWidgets;
			if (preEditLayout && gridInstance) gridInstance.load(preEditLayout, false);
		},
		onSaveLayout() {
			if (gridInstance) {
				const layout = gridInstance.save(false);
				localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
			}
			saveWidgets();
		},
		async onAddWidget(type: string) {
			await handleAddWidget(type);
		},
		onRemoveWidget(type: string) {
			handleRemoveWidget(type);
		},
	});

	setGridContext({
		get editMode() {
			return dashCtx.editMode;
		},
		removeWidget(id: string) {
			const itemEl = el?.querySelector(`[gs-id="${id}"]`);
			if (itemEl && gridInstance) {
				gridInstance.removeWidget(itemEl as HTMLElement, false, false);
			}
			activeWidgets = activeWidgets.filter((w) => w.id !== id);
			saveWidgets();
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
					margin: 10,
					column: 12,
					resizable: { handles: 'se' },
					animate: true,
					float: false,
					staticGrid: true,
				},
				el,
			);

			const saved = localStorage.getItem(LAYOUT_KEY);
			if (saved) {
				try {
					grid.load(JSON.parse(saved) as GridStackWidget[], false);
				} catch {
					// ignore corrupt data
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

	// Toggle static mode when editMode changes
	$effect(() => {
		if (!gridInstance) return;
		gridInstance.setStatic(!dashCtx.editMode);
	});

	async function handleAddWidget(type: string) {
		const def = WIDGET_REGISTRY.find((d) => d.type === type);
		if (!def) return;

		const id = `${type}-${Date.now()}`;
		const newWidget: ActiveWidget = {
			id,
			type: type as ActiveWidget['type'],
			x: 0,
			y: 9999,
			w: def.defaultW,
			h: def.defaultH,
		};

		activeWidgets = [...activeWidgets, newWidget];
		await tick();

		const newEl = el?.querySelector(`[gs-id="${id}"]`);
		if (newEl && gridInstance) {
			gridInstance.makeWidget(newEl as HTMLElement);
		}
		saveWidgets();
	}

	function handleRemoveWidget(type: string) {
		const toRemove = activeWidgets.filter((w) => w.type === type);
		for (const widget of toRemove) {
			const itemEl = el?.querySelector(`[gs-id="${widget.id}"]`);
			if (itemEl && gridInstance) {
				gridInstance.removeWidget(itemEl as HTMLElement, false, false);
			}
		}
		activeWidgets = activeWidgets.filter((w) => w.type !== type);
		saveWidgets();
	}
</script>

<WidgetDrawer
	open={dashCtx.drawerOpen}
	{activeWidgetTypes}
	onClose={dashCtx.closeDrawer}
	onAdd={handleAddWidget}
	onRemove={handleRemoveWidget}
/>

<div class={cn('w-full', className)}>
	<div bind:this={el} class="grid-stack w-full">
		{#each activeWidgets as widget (widget.id)}
			<WidgetRenderer {widget} />
		{/each}
	</div>
</div>
