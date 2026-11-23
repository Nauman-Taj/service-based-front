/**
 * Small, safe wrappers around Web Storage.
 *
 * All auth persistence goes through this module so that moving the session
 * to httpOnly cookies (when the NestJS backend lands) only touches this file
 * and `hooks/useAuth.ts`.
 *
 * The active session is intentionally kept in `sessionStorage`, which is
 * isolated per browser tab. `localStorage` only stores the remembered default
 * for fresh tabs, so signing in or out in one tab cannot replace or clear the
 * session already running in another tab.
 */

import type { AuthSession } from "@/types/user";

export const STORAGE_KEYS = {
  /** Active per-tab session. */
  session: "quicker:auth-session",
  /** Remembered session copied into new tabs on first load. */
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

/**
 * Returns the session for this tab only. A fresh tab adopts the remembered
 * session once, then keeps its own copy in sessionStorage.
 */
export function readSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const tabSession = readJson<AuthSession>(
    STORAGE_KEYS.session,
    window.sessionStorage,
  );
  if (tabSession) {
    return tabSession;
  }

  const remembered = readJson<AuthSession>(
    STORAGE_KEYS.rememberedSession,
    window.localStorage,
  );
  if (remembered) {
    writeJson(STORAGE_KEYS.session, remembered, window.sessionStorage);
    return remembered;
  }

  return null;
}

export function writeSession(session: AuthSession): void {
  if (!isBrowser()) {
    return;
  }

  // Always set the current tab's session. Other tabs keep their own copy.
  writeJson(STORAGE_KEYS.session, session, window.sessionStorage);

  if (session.remember) {
    writeJson(STORAGE_KEYS.rememberedSession, session, window.localStorage);
  } else {
    removeKey(STORAGE_KEYS.rememberedSession, window.localStorage);
  }
}

/** Signs out this tab and clears the remembered default for future tabs. */
export function clearSession(): void {
  if (!isBrowser()) {
    return;
  }
  removeKey(STORAGE_KEYS.session, window.sessionStorage);
  removeKey(STORAGE_KEYS.rememberedSession, window.localStorage);
}
