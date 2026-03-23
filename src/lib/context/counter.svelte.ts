import { getContext, setContext } from 'svelte';

const COUNTER_KEY = Symbol('counter');

interface CounterState {
  count: number;
  increment: () => void;
}

export function createCounterState(initial: Partial<CounterState> = {}) {
  let count = $state<number>(initial.count ?? 0);

  function increment() {
    count++;
  }

  return {
    get count() {
      return count;
    },
    increment,
  };
}

export function setCounterContext(initial?: Partial<CounterState>) {
  setContext(COUNTER_KEY, createCounterState(initial));
}

export function getCounterContext() {
  return getContext<ReturnType<typeof createCounterState>>(COUNTER_KEY);
}
