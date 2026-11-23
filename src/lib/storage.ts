/**
 * Small, safe wrappers around Web Storage.
 *
 * All auth persistence goes through this module so that moving the session
 * to httpOnly cookies (when the NestJS backend lands) only touches this file
 * and `hooks/useAuth.ts`.
 *
 * The active session lives ONLY in `sessionStorage`: it survives refreshes in
 * the same tab, but is discarded when the tab or browser is closed. Nothing is
 * mirrored to `localStorage`, so opening a new tab always starts signed out.
 */

import type { AuthSession } from "@/types/user";

export const STORAGE_KEYS = {
  /** Active per-tab session. */
  session: "quicker:auth-session",
  /** Legacy key from the old "remember me" behaviour, removed on every read. */
  rememberedSession: "quicker:auth-remembered-session",
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

/** Drops the old localStorage session so it can never re-authenticate a new tab. */
function forgetRememberedSession(): void {
  removeKey(STORAGE_KEYS.rememberedSession, window.localStorage);
}

/** Returns the session for this tab only; a new tab always starts signed out. */
export function readSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  forgetRememberedSession();

  return readJson<AuthSession>(STORAGE_KEYS.session, window.sessionStorage);
}

export function writeSession(session: AuthSession): void {
  if (!isBrowser()) {
    return;
  }

  // Only the current tab keeps a session. Other tabs are unaffected.
  writeJson(STORAGE_KEYS.session, session, window.sessionStorage);
  forgetRememberedSession();
}

/** Signs out this tab and clears any legacy remembered session. */
export function clearSession(): void {
  if (!isBrowser()) {
    return;
  }
  removeKey(STORAGE_KEYS.session, window.sessionStorage);
  forgetRememberedSession();
}
