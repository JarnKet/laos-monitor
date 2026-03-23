<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import { setMode, resetMode } from 'mode-watcher';
	import { cn } from '$lib/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();
</script>

<header class={cn('flex h-12 shrink-0 items-center border-b bg-card px-4', className)}>
	<div class="flex items-center gap-2">
		<span class="text-lg">🇱🇦</span>
		<span class="text-sm font-semibold tracking-wide">Laos Monitor</span>
	</div>

	<div class="ml-auto">
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
