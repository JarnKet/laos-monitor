import { getContext, setContext } from 'svelte';
import type { Map as MaplibreMap, Marker } from 'maplibre-gl';

const MAP_KEY = Symbol('map');
const MARKER_KEY = Symbol('marker');

export interface MapCtx {
  get map(): MaplibreMap | null;
  get isLoaded(): boolean;
}

export interface MarkerCtx {
  get marker(): Marker | null;
}

export function setMapContext(ctx: MapCtx) {
  setContext(MAP_KEY, ctx);
}

export function getMapContext(): MapCtx {
  return getContext<MapCtx>(MAP_KEY);
}

export function setMarkerContext(ctx: MarkerCtx) {
  setContext(MARKER_KEY, ctx);
}

export function getMarkerContext(): MarkerCtx {
  return getContext<MarkerCtx>(MARKER_KEY);
}

export function useMap(): MapCtx {
  return getMapContext();
}
