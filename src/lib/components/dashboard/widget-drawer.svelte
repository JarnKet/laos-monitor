<script lang="ts">
  import { WIDGET_REGISTRY } from '$lib/widgets/registry.js';
  import XIcon from '@lucide/svelte/icons/x';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import CheckIcon from '@lucide/svelte/icons/check';
  import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
  import { cn } from '$lib/utils.js';

  type Props = {
    open: boolean;
    activeWidgetTypes: string[];
    onClose: () => void;
    onAdd: (type: string) => void;
    onRemove: (type: string) => void;
  };

  let { open, activeWidgetTypes, onClose, onAdd, onRemove }: Props = $props();
</script>

<!-- Backdrop: always in DOM, visible when open -->
<button
  class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
  class:opacity-0={!open}
  class:pointer-events-none={!open}
  onclick={onClose}
  aria-label="Close widget drawer"
  tabindex={open ? 0 : -1}
></button>

<!-- Drawer panel: slides from right, starts below navbar (top-12 = 3rem = 48px) -->
<div
  class="fixed right-0 top-12 bottom-0 z-50 flex w-80 flex-col border-l border-border bg-popover shadow-2xl transition-transform duration-300"
  class:translate-x-full={!open}
>
  <!-- Header -->
  <div class="flex items-center justify-between border-b px-4 py-3">
    <div class="flex items-center gap-2">
      <LayoutDashboardIcon class="size-4 text-muted-foreground" />
      <span class="text-sm font-semibold">Widget Library</span>
    </div>
    <button
      onclick={onClose}
      class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Close"
    >
      <XIcon class="size-4" />
    </button>
  </div>

  <!-- Widget count badge -->
  <div class="px-4 py-2 text-xs text-muted-foreground">
    {activeWidgetTypes.length} of {WIDGET_REGISTRY.length} widgets active
  </div>

  <!-- Widget list -->
  <div class="flex-1 overflow-auto px-3 pb-4">
    {#each WIDGET_REGISTRY as def}
      {@const isActive = activeWidgetTypes.includes(def.type)}
      <div
        class={cn(
          'mb-2 rounded-lg border p-3 transition-colors',
          isActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
        )}
      >
        <!-- Title row -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{def.title}</span>
          {#if isActive}
            <span class="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
              Active
            </span>
          {/if}
        </div>

        <!-- Description -->
        <p class="mt-1 text-xs text-muted-foreground">{def.description}</p>

        <!-- Button row -->
        <div class="mt-3 flex justify-end">
          {#if isActive}
            <button
              onclick={() => onRemove(def.type)}
              class="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <CheckIcon class="size-3" />
              Remove
            </button>
          {:else}
            <button
              onclick={() => onAdd(def.type)}
              class="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <PlusIcon class="size-3" />
              Add Widget
            </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
