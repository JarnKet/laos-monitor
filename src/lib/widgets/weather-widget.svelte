<script lang="ts">
	import Widget from '$lib/components/dashboard/widget.svelte';
	import type { WeatherStation } from '$lib/server/open-meteo.js';
	import { getWeatherInfo, getWindDirection, getDayName } from '$lib/utils/weather.js';
	import { cn } from '$lib/utils.js';

	type Props = {
		id?: string;
		weather: WeatherStation[];
		x?: number;
		y?: number;
		w?: number;
		h?: number;
	};

	let { id = 'weather-widget', weather, x = 0, y = 0, w = 4, h = 7 }: Props = $props();

	let selected = $state(0);

	const station = $derived(weather[selected]);
	const data = $derived(station?.data ?? null);
	const current = $derived(data?.current ?? null);
	const daily = $derived(data?.daily ?? null);
	const info = $derived(current ? getWeatherInfo(current.weather_code) : null);
	const gustsStrong = $derived(
		current !== null && current.wind_gusts_10m >= 60 && current.wind_gusts_10m < 90,
	);
	const gustsStorm = $derived(current !== null && current.wind_gusts_10m >= 90);
</script>

<Widget {id} title="ອາກາດ • Weather" {x} {y} {w} {h} minW={3} minH={5}>
	<div class="flex h-full flex-col gap-4 overflow-auto p-4">
		<!-- City tabs -->
		<div class="flex flex-wrap gap-1.5">
			{#each weather as s, i}
				<button
					class="rounded-full border px-2.5 py-0.5 text-xs transition-colors"
					class:bg-muted={selected !== i}
					class:border-transparent={selected !== i}
					class:font-medium={selected === i}
					onclick={() => (selected = i)}
				>
					{s.label}
				</button>
			{/each}
		</div>

		<!-- Current weather or no-data message -->
		{#if current && info}
			<!-- Big weather display -->
			<div class="flex items-center gap-4">
				<span class="text-6xl leading-none" role="img" aria-label={info.description}>
					{info.icon}
				</span>
				<div>
					<div class="text-4xl font-bold tabular-nums leading-none">
						{Math.round(current.temperature_2m)}°C
					</div>
					<div class="mt-1 text-sm text-muted-foreground">{info.description}</div>
				</div>
			</div>

			<!-- Stats grid -->
			<div class="grid grid-cols-2 gap-2">
				<!-- Feels like -->
				<div class="rounded-lg border p-2.5">
					<div class="text-[10px] uppercase tracking-wide text-muted-foreground">Feels like</div>
					<div class="mt-0.5 text-sm font-semibold">{Math.round(current.apparent_temperature)}°C</div>
				</div>
				<!-- Humidity -->
				<div class="rounded-lg border p-2.5">
					<div class="text-[10px] uppercase tracking-wide text-muted-foreground">Humidity</div>
					<div class="mt-0.5 text-sm font-semibold">{current.relative_humidity_2m}%</div>
				</div>
				<!-- Wind -->
				<div class="rounded-lg border p-2.5">
					<div class="text-[10px] uppercase tracking-wide text-muted-foreground">Wind</div>
					<div class="mt-0.5 text-sm font-semibold">
						{Math.round(current.wind_speed_10m)} km/h {getWindDirection(current.wind_direction_10m)}
					</div>
				</div>
				<!-- Precipitation -->
				<div class="rounded-lg border p-2.5">
					<div class="text-[10px] uppercase tracking-wide text-muted-foreground">Precipitation</div>
					<div class="mt-0.5 text-sm font-semibold">{current.precipitation} mm</div>
				</div>
				<!-- Wind Gusts -->
				<div
					class={cn(
						'col-span-2 rounded-lg border p-2.5 transition-colors',
						gustsStrong && 'border-orange-500/40 bg-orange-500/5',
						gustsStorm && 'border-red-500/40 bg-red-500/5',
					)}
				>
					<div class="text-[10px] uppercase tracking-wide text-muted-foreground">
						Wind Gusts
						{#if gustsStorm}
							<span class="ml-1 font-medium text-red-500">⚠ Storm</span>
						{:else if gustsStrong}
							<span class="ml-1 font-medium text-orange-500">⚠ Strong</span>
						{/if}
					</div>
					<div
						class={cn(
							'mt-0.5 text-sm font-semibold',
							gustsStrong && 'text-orange-500',
							gustsStorm && 'text-red-500',
						)}
					>
						{Math.round(current.wind_gusts_10m)} km/h
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-1 items-center justify-center text-sm text-muted-foreground">
				No data available
			</div>
		{/if}

		<!-- 7-day forecast -->
		{#if daily}
			<div class="border-t pt-3">
				<div class="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">7-day forecast</div>
				<div class="space-y-1.5">
					{#each daily.time as dateStr, i}
						{@const dayInfo = getWeatherInfo(daily.weather_code[i])}
						{@const gusts = daily.wind_gusts_10m_max[i]}
						<div class="flex items-center gap-2 text-sm">
							<span class="w-8 text-xs text-muted-foreground">{getDayName(dateStr, i)}</span>
							<span class="text-base leading-none" role="img" aria-label={dayInfo.description}>{dayInfo.icon}</span>
							{#if daily.precipitation_probability_max[i] > 0}
								<span class="text-[10px] text-blue-500">{daily.precipitation_probability_max[i]}%💧</span>
							{/if}
							{#if gusts >= 60}
								<span class={cn('text-[10px]', gusts >= 90 ? 'text-red-500' : 'text-orange-500')}>
									{Math.round(gusts)}↑
								</span>
							{/if}
							<div class="ml-auto flex gap-2 tabular-nums">
								<span class="font-medium">{Math.round(daily.temperature_2m_max[i])}°</span>
								<span class="text-muted-foreground">{Math.round(daily.temperature_2m_min[i])}°</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</Widget>
