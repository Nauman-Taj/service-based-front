/**
 * Small, safe wrappers around Web Storage.
 *
 * All auth persistence goes through this module so that moving the session
 * to httpOnly cookies (when the NestJS backend lands) only touches this file
 * and `hooks/useAuth.ts`.
 */

import type { AuthSession } from "@/types/user";

export const STORAGE_KEYS = {
  /** Active session (localStorage when "Remember me", sessionStorage otherwise). */
  session: "quicker:auth-session",
  /** Registered accounts + password overrides for demo accounts. */
  users: "quicker:auth-users",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readJson<T>(key: string, area: Storage | null): T | null {
  if (!isBrowser() || !area) {
    return null;
  }
  try {
    const raw = area.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown, area: Storage | null): void {
  if (!isBrowser() || !area) {
    return;
  }
  try {
    area.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode / quota); the app still works
    // for the current page view.
  }
}

export function removeKey(key: string, area: Storage | null): void {
  if (!isBrowser() || !area) {
    return;
  }
  try {
    area.removeItem(key);
  } catch {
    // Ignore — see writeJson.
  }
}

/** Session storage wins so a non-remembered tab session takes precedence. */
export function readSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }
  return (
    readJson<AuthSession>(STORAGE_KEYS.session, window.sessionStorage) ??
    readJson<AuthSession>(STORAGE_KEYS.session, window.localStorage)
  );
}

export function writeSession(session: AuthSession): void {
  if (!isBrowser()) {
    return;
  }
  const area = session.remember ? window.localStorage : window.sessionStorage;
  const other = session.remember ? window.sessionStorage : window.localStorage;
  writeJson(STORAGE_KEYS.session, session, area);
  removeKey(STORAGE_KEYS.session, other);
}

export function clearSession(): void {
  if (!isBrowser()) {
    return;
  }
  removeKey(STORAGE_KEYS.session, window.localStorage);
  removeKey(STORAGE_KEYS.session, window.sessionStorage);
}
