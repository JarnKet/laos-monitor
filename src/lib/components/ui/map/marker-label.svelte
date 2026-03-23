<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	type Props = {
		children?: Snippet;
		class?: string;
		position?: 'top' | 'bottom';
	};

	let { children, class: className, position = 'top' }: Props = $props();
</script>

<div
	class={cn(
		'absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-background px-1.5 py-0.5 text-xs shadow-sm',
		position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
		className
	)}
>
	{@render children?.()}
</div>
