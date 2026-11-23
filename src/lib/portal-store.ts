/**
 * Safe localStorage helpers for the frontend-only dashboard modules.
 *
 * Every write dispatches a same-tab `quicker:store-change` event so all hooks
 * using the same key stay in sync. Native `storage` events handle other tabs.
 */

export const PORTAL_KEYS = {
  bookings: "quicker:bookings",
  bookingStatuses: "quicker:booking-statuses",
  favorites: "quicker:favorites",
  profiles: "quicker:profiles",
  settings: "quicker:account-settings",
  reviews: "quicker:dashboard-reviews",
  providerServices: "quicker:provider-services",
  providerServiceDeletions: "quicker:deleted-provider-services",
  availability: "quicker:availability",
  blockedDates: "quicker:blocked-dates",
  adminStatuses: "quicker:admin-entity-statuses",
} as const;

export type PortalKey = (typeof PORTAL_KEYS)[keyof typeof PORTAL_KEYS];

export const STORE_CHANGE_EVENT = "quicker:store-change";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readStore<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  if (!isBrowser()) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent<string>(STORE_CHANGE_EVENT, { detail: key }),
    );
  } catch {
    // Storage may be unavailable; the current view still works in memory.
  }
}

export function subscribeToStore(
  key: string,
  listener: () => void,
): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) {
      listener();
    }
  }

  function onCustom(event: Event) {
    if ((event as CustomEvent<string>).detail === key) {
      listener();
    }
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(STORE_CHANGE_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORE_CHANGE_EVENT, onCustom);
  };
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function makeReference(): string {
  return `QK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
