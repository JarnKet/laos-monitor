<script lang="ts">
  import Widget from '$lib/components/dashboard/widget.svelte';
  import type { AirQualityStation } from '$lib/server/open-meteo.js';
  import { getAQILevel } from '$lib/utils/aqi.js';
  import { getUVLevel } from '$lib/utils/weather.js';

  type Props = {
    id?: string;
    airQuality: AirQualityStation[];
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  };

  let { id = 'air-quality-widget', airQuality, x = 6, y = 0, w = 6, h = 7 }: Props = $props();

  let selected = $state(0);
  const station = $derived(airQuality[selected]);
  const data = $derived(station?.data?.current ?? null);
  const level = $derived(data ? getAQILevel(data.us_aqi) : null);
  const uvLevel = $derived(data ? getUVLevel(data.uv_index) : null);
</script>

<Widget {id} title="ຄຸນນະພາບອາກາດ • Air Quality" {x} {y} {w} {h} minW={3} minH={5}>
  <div class="flex h-full flex-col gap-3 overflow-auto p-4">
    <!-- City tabs -->
    <div class="flex flex-wrap gap-1.5">
      {#each airQuality as s, i}
        <button
          class="rounded-full border px-2.5 py-0.5 text-xs transition-colors"
          class:bg-muted={selected !== i}
          class:border-transparent={selected !== i}
          class:font-medium={selected === i}
          onclick={() => (selected = i)}
          style={selected === i && level ? `border-color: ${level.color}` : ''}
        >
          {s.label}
        </button>
      {/each}
    </div>

    {#if data && level}
      <!-- US AQI large display -->
      <div class="flex items-baseline gap-3">
        <span class="text-5xl font-bold tabular-nums leading-none" style="color: {level.color}">
          {data.us_aqi}
        </span>
        <div class="flex flex-col">
          <span class="text-[10px] uppercase tracking-wide text-muted-foreground">US AQI</span>
          <span class="text-sm font-medium" style="color: {level.color}">{level.label}</span>
        </div>
        <!-- EU AQI badge -->
        <div class="ml-auto flex flex-col items-end">
          <span class="text-[10px] uppercase tracking-wide text-muted-foreground">EU AQI</span>
          <span class="text-sm font-semibold tabular-nums">{data.european_aqi}</span>
        </div>
      </div>

      <!-- PM2.5 featured -->
      <div class="rounded-lg border p-3">
        <div class="text-[10px] uppercase tracking-wide text-muted-foreground">PM2.5</div>
        <div class="mt-0.5 flex items-baseline gap-1">
          <span class="text-2xl font-semibold tabular-nums">{data.pm2_5.toFixed(1)}</span>
          <span class="text-xs text-muted-foreground">µg/m³</span>
        </div>
      </div>

      <!-- Stats grid: PM10, NO2, O3, SO2, Dust, CO -->
      <div class="grid grid-cols-3 gap-2">
        {#each [
          { key: 'pm10', label: 'PM10', unit: 'µg/m³', value: data.pm10.toFixed(0) },
          { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'µg/m³', value: data.nitrogen_dioxide.toFixed(1) },
          { key: 'ozone', label: 'O₃', unit: 'µg/m³', value: data.ozone.toFixed(1) },
          { key: 'sulphur_dioxide', label: 'SO₂', unit: 'µg/m³', value: data.sulphur_dioxide.toFixed(1) },
          { key: 'dust', label: 'Dust', unit: 'µg/m³', value: data.dust.toFixed(1) },
          { key: 'carbon_monoxide', label: 'CO', unit: 'µg/m³', value: data.carbon_monoxide.toFixed(0) },
        ] as p (p.key)}
          <div class="rounded-lg border p-2 text-center">
            <div class="text-[10px] text-muted-foreground">{p.label}</div>
            <div class="text-sm font-medium tabular-nums">{p.value}</div>
          </div>
        {/each}
      </div>

      <!-- UV Index -->
      {#if uvLevel}
        <div class="flex items-center justify-between rounded-lg border p-2.5">
          <div>
            <div class="text-[10px] uppercase tracking-wide text-muted-foreground">UV Index</div>
            <div class="mt-0.5 flex items-baseline gap-1.5">
              <span class="text-lg font-semibold tabular-nums">{data.uv_index.toFixed(1)}</span>
              <span class="text-xs font-medium" style="color: {uvLevel.color}">{uvLevel.label}</span>
            </div>
          </div>
          <div class="text-3xl leading-none">☀️</div>
        </div>
      {/if}

      <!-- Source attribution -->
      <div class="mt-auto border-t pt-2 text-[10px] text-muted-foreground">
        Source: Copernicus CAMS via Open-Meteo · Updated {data.time.split('T')[1]?.slice(0, 5) ?? ''}
      </div>
    {:else}
      <div class="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    {/if}
  </div>
</Widget>
