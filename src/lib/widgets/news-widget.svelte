<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import type { RssFeed } from '$lib/server/rss.js';

	type Props = {
		id?: string;
		news: RssFeed;
		x?: number;
		y?: number;
		w?: number;
		h?: number;
	};

	let { id = 'news-widget', news, x = 0, y = 0, w = 4, h = 8 }: Props = $props();

	function relativeTime(isoDate: string): string {
		const diff = Date.now() - new Date(isoDate).getTime();
		const minutes = Math.floor(diff / 60_000);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}
</script>

<Widget {id} title="ຂ່າວ • News" {x} {y} {w} {h} minW={3} minH={5}>
	<div class="flex h-full flex-col overflow-auto">
		{#if news.items.length === 0}
			<div class="flex flex-1 items-center justify-center text-sm text-muted-foreground">
				No news available
			</div>
		{:else}
			<div class="divide-y">
				{#each news.items as item (item.link)}
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						class="block px-4 py-3 transition-colors hover:bg-muted/50"
					>
						<div class="text-sm font-medium leading-snug">{item.title}</div>
						{#if item.description}
							<div class="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</div>
						{/if}
						<div class="mt-1.5 flex flex-wrap items-center gap-1.5">
							<span class="text-[10px] text-muted-foreground">{relativeTime(item.pubDate)}</span>
							{#each item.categories.slice(0, 3) as cat}
								<span class="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
									{cat}
								</span>
							{/each}
						</div>
					</a>
				{/each}
			</div>
			<div class="border-t px-4 py-2 text-[10px] text-muted-foreground">
				Source: Laotian Times · {news.items.length} articles
			</div>
		{/if}
	</div>
</Widget>
