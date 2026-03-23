import { getContext, setContext } from 'svelte';

const LOCATION_KEY = Symbol('location');

export function createLocationState() {
  let coords = $state<{ longitude: number; latitude: number } | null>(null);
  let loading = $state(false);
  let tracking = $state(false);
  let error = $state<string | null>(null);
  let shouldFlyTo = $state(false);
  let watchId: number | undefined;

  function locate() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      error = 'Geolocation not supported';
      return;
    }
    loading = true;
    error = null;
    shouldFlyTo = true;

    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
    }

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        coords = { longitude: pos.coords.longitude, latitude: pos.coords.latitude };
        loading = false;
        tracking = true;
      },
      (err) => {
        error = err.message;
        loading = false;
        tracking = false;
        shouldFlyTo = false;
      },
      { enableHighAccuracy: true },
    );
  }

  function stop() {
    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
      watchId = undefined;
    }
    loading = false;
    tracking = false;
  }

  function clearFlyTo() {
    shouldFlyTo = false;
  }

  return {
    get coords() {
      return coords;
    },
    get loading() {
      return loading;
    },
    get tracking() {
      return tracking;
    },
    get error() {
      return error;
    },
    get shouldFlyTo() {
      return shouldFlyTo;
    },
    locate,
    stop,
    clearFlyTo,
  };
}

export type LocationState = ReturnType<typeof createLocationState>;

export function setLocationContext(state: LocationState) {
  setContext(LOCATION_KEY, state);
}

export function getLocationContext(): LocationState {
  return getContext<LocationState>(LOCATION_KEY);
}
