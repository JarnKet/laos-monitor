import { getContext, setContext } from 'svelte';

const DASHBOARD_KEY = Symbol('dashboard');

export interface GridImpl {
  onStartEdit(): void;
  onCancelEdit(): void;
  onSaveLayout(): void;
  onAddWidget(type: string): Promise<void>;
  onRemoveWidget(type: string): void;
}

export interface DashboardCtx {
  get editMode(): boolean;
  get drawerOpen(): boolean;
  register(impl: GridImpl): void;
  startEdit(): void;
  cancelEdit(): void;
  saveLayout(): void;
  openDrawer(): void;
  closeDrawer(): void;
}

export function createDashboardContext(): DashboardCtx {
  let editMode = $state(false);
  let drawerOpen = $state(false);
  let gridImpl: GridImpl | null = null;

  return {
    get editMode() {
      return editMode;
    },
    get drawerOpen() {
      return drawerOpen;
    },
    register(impl: GridImpl) {
      gridImpl = impl;
    },
    startEdit() {
      gridImpl?.onStartEdit();
      editMode = true;
    },
    cancelEdit() {
      gridImpl?.onCancelEdit();
      editMode = false;
    },
    saveLayout() {
      gridImpl?.onSaveLayout();
      editMode = false;
    },
    openDrawer() {
      drawerOpen = true;
    },
    closeDrawer() {
      drawerOpen = false;
    },
  };
}

export function setDashboardContext(ctx: DashboardCtx) {
  setContext(DASHBOARD_KEY, ctx);
}

export function getDashboardContext(): DashboardCtx {
  return getContext<DashboardCtx>(DASHBOARD_KEY);
}
