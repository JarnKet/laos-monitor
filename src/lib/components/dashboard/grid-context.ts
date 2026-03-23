import { getContext, setContext } from 'svelte';

const GRID_KEY = Symbol('grid');

export interface GridCtx {
  get editMode(): boolean;
  removeWidget(id: string): void;
}

export function setGridContext(ctx: GridCtx) {
  setContext(GRID_KEY, ctx);
}

export function getGridContext(): GridCtx {
  return getContext<GridCtx>(GRID_KEY);
}
