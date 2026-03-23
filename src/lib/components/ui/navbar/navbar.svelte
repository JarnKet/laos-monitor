<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import LocateIcon from '@lucide/svelte/icons/locate';
	import LocateFixedIcon from '@lucide/svelte/icons/locate-fixed';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import SaveIcon from '@lucide/svelte/icons/save';
	import XIcon from '@lucide/svelte/icons/x';
	import PencilRulerIcon from '@lucide/svelte/icons/pencil-ruler';
	import { setMode, resetMode } from 'mode-watcher';
	import { cn } from '$lib/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants, Button } from '$lib/components/ui/button/index.js';
	import { getLocationContext } from '$lib/context/location.svelte.js';
	import { getDashboardContext } from '$lib/context/dashboard.svelte.js';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	const locationCtx = getLocationContext();
	const dashCtx = getDashboardContext();
</script>

<header class={cn('flex h-12 shrink-0 items-center border-b bg-card px-4', className)}>
	<div class="flex items-center gap-2">
		<span class="text-lg">🇱🇦</span>
		<span class="text-sm font-semibold tracking-wide">Laos Monitor</span>
	</div>

	<div class="ml-auto flex items-center gap-1">
		<!-- Separator -->
		<div class="mx-2 h-5 w-px bg-border"></div>

		<!-- Widgets button - always visible -->
		<Button size="sm" variant="ghost" onclick={dashCtx.openDrawer} class="gap-1.5 text-xs">
			<LayoutDashboardIcon class="size-3.5" />
			Widgets
		</Button>

		<!-- Edit mode buttons -->
		{#if dashCtx.editMode}
			<Button size="sm" variant="ghost" onclick={dashCtx.cancelEdit} class="gap-1.5 text-xs">
				<XIcon class="size-3.5" />
				Cancel
			</Button>
			<Button size="sm" onclick={dashCtx.saveLayout} class="gap-1.5 text-xs">
				<SaveIcon class="size-3.5" />
				Save Layout
			</Button>
		{:else}
			<Button size="sm" variant="ghost" onclick={dashCtx.startEdit} class="gap-1.5 text-xs">
				<PencilRulerIcon class="size-3.5" />
				Edit Layout
			</Button>
		{/if}

		<div class="mx-1 h-5 w-px bg-border"></div>

		<button
			class={buttonVariants({ variant: 'ghost', size: 'icon' })}
			title="My Location"
			onclick={locationCtx.locate}
		>
			{#if locationCtx.loading}
				<Loader2Icon class="size-[1.2rem] animate-spin" />
			{:else if locationCtx.tracking}
				<LocateFixedIcon class="size-[1.2rem] text-blue-500" />
			{:else}
				<LocateIcon class="size-[1.2rem]" />
			{/if}
			<span class="sr-only">My Location</span>
		</button>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => setMode('light')}>
					<SunIcon class="mr-2 size-4" />
					Light
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setMode('dark')}>
					<MoonIcon class="mr-2 size-4" />
					Dark
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => resetMode()}>
					<MonitorIcon class="mr-2 size-4" />
					System
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
