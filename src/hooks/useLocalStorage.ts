"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { subscribeToStore, writeStore } from "@/lib/portal-store";

/**
 * localStorage-backed state that stays in sync across hooks and browser tabs.
 * Server rendering uses `initialValue`; the stored value is read by the store
 * snapshot on the client.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (listener: () => void) => subscribeToStore(key, listener),
    [key],
  );

  const getSnapshot = useCallback(() => {
    const fallback = JSON.stringify(initialValue);
    if (typeof window === "undefined") {
      return fallback;
    }
    try {
      return window.localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }, [key, initialValue]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const value = useMemo<T>(() => {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [raw, initialValue]);

  const setStoredValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      let current = initialValue;
      try {
        current = JSON.parse(getSnapshot()) as T;
      } catch {
        // Fall back to the initial value when storage is unavailable.
      }
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(current)
          : next;
      writeStore(key, resolved);
    },
    [getSnapshot, key, initialValue],
  );

  return [value, setStoredValue] as const;
}
