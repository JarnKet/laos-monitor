<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import { getGridContext } from './grid-context.js';

	type Props = {
		id?: string;
		title: string;
		x?: number;
		y?: number;
		w?: number;
		h?: number;
		minW?: number;
		minH?: number;
		noResize?: boolean;
		noMove?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		id,
		title,
		x = 0,
		y = 0,
		w = 4,
		h = 5,
		minW = 2,
		minH = 3,
		noResize = false,
		noMove = false,
		class: className,
		children,
	}: Props = $props();

	const gridCtx = getGridContext();
</script>

<div
	class="grid-stack-item"
	gs-id={id}
	gs-x={x}
	gs-y={y}
	gs-w={w}
	gs-h={h}
	gs-min-w={minW}
	gs-min-h={minH}
	gs-no-resize={noResize ? 'true' : undefined}
	gs-no-move={noMove ? 'true' : undefined}
>
	<div class="grid-stack-item-content h-full">
		<Card class="h-full overflow-hidden rounded-none">
			<CardHeader
				class={cn(
					'flex h-9 shrink-0 flex-row items-center border-b px-3 py-0 transition-colors select-none',
					gridCtx.editMode
						? 'cursor-grab bg-muted/40 active:cursor-grabbing'
						: 'cursor-default'
				)}
			>
				<CardTitle>{title}</CardTitle>
				{#if gridCtx.editMode}
					<span class="ml-auto text-[10px] text-muted-foreground">drag to move</span>
				{/if}
			</CardHeader>
			<div class={cn('min-h-0 flex-1 overflow-hidden', className)}>
				{@render children?.()}
			</div>
		</Card>
	</div>
</div>
