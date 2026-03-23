<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	type Props = {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className }: Props = $props();
</script>

{#if children}
	<div class={cn('cursor-pointer', className)}>
		{@render children()}
	</div>
{:else}
	<div class={cn('size-3 cursor-pointer rounded-full bg-primary ring-2 ring-background', className)}></div>
{/if}
