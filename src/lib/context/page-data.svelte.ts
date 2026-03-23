import { getContext, setContext } from 'svelte';

const PAGE_DATA_KEY = Symbol('page-data');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setPageDataContext(data: Record<string, any>) {
  setContext(PAGE_DATA_KEY, data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPageDataContext(): Record<string, any> {
  return getContext(PAGE_DATA_KEY);
}
