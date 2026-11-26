"use client";

/**
 * Auth state for the whole app.
 *
 * `AuthProvider` wraps the root layout; `useAuth()` exposes the current user
 * and auth actions. All server communication goes through the `AuthApi`
 * contract — now implemented by `lib/api-auth.ts` against the NestJS API.
 * Swapping providers only touches that implementation.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { authApi } from "@/lib/api-auth";
import { isTokenExpired } from "@/lib/jwt";
import { clearSession, readSession, writeSession } from "@/lib/storage";
import type {
  AuthSession,
  AuthTokens,
  LoginInput,
  RegisterInput,
  User,
} from "@/types/user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  /** Signs in and persists the session for this tab only. */
  login: (input: LoginInput) => Promise<User>;
  /** Registers, signs in and persists the session for this tab only. */
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  /** Valid access token for API calls, refreshing first when expired. */
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  /**
   * React StrictMode runs effects twice in development, and two components can
   * request an access token at the same time. Rotating the refresh token twice
   * would make the second request fail with 401, so share one in-flight refresh
   * per refresh token.
   */
  const refreshInFlight = useRef<{
    token: string;
    promise: Promise<AuthTokens>;
  } | null>(null);

  const refreshSession = useCallback(
    async (session: AuthSession): Promise<AuthSession> => {
      const token = session.tokens.refreshToken;
      let inFlight = refreshInFlight.current;
      if (!inFlight || inFlight.token !== token) {
        inFlight = {
          token,
          promise: authApi.refresh(token).finally(() => {
            if (refreshInFlight.current?.token === token) {
              refreshInFlight.current = null;
            }
          }),
        };
        refreshInFlight.current = inFlight;
      }

      const tokens = await inFlight.promise;
      const refreshed: AuthSession = { ...session, tokens };
      writeSession(refreshed);
      return refreshed;
    },
    [],
  );

  /** Restores (and if needed refreshes) the persisted session. */
  const hydrate = useCallback(async () => {
    const session = readSession();
    if (!session) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    if (!isTokenExpired(session.tokens.accessToken)) {
      setUser(session.user);
      setStatus("authenticated");
      return;
    }

    // Access token expired — refresh it exactly like the NestJS flow
    // (POST /auth/refresh).
    try {
      const refreshed = await refreshSession(session);
      setUser(refreshed.user);
      setStatus("authenticated");
    } catch {
      clearSession();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [refreshSession]);

  useEffect(() => {
    // Hydrating the tab-local session on mount is a sync with an external
    // system (Web Storage), which is exactly what effects are for; the rule
    // cannot see past the async helper's synchronous path.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void hydrate();

    // Do not listen for cross-tab storage events here. Each tab owns its
    // session, so signing in or out elsewhere must not replace this tab's user.
  }, [hydrate]);

  const login = useCallback(
    async (input: LoginInput): Promise<User> => {
      const response = await authApi.login(input);
      writeSession(response);
      setUser(response.user);
      setStatus("authenticated");
      return response.user;
    },
    [],
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<User> => {
      const response = await authApi.register(input);
      writeSession(response);
      setUser(response.user);
      setStatus("authenticated");
      return response.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    const session = readSession();
    try {
      if (session) {
        await authApi.logout(session.tokens.refreshToken);
      }
    } catch {
      // Best effort — the local session is cleared regardless.
    }
    clearSession();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const session = readSession();
    if (!session) {
      return null;
    }
    if (!isTokenExpired(session.tokens.accessToken)) {
      return session.tokens.accessToken;
    }
    try {
      const refreshed = await refreshSession(session);
      return refreshed.tokens.accessToken;
    } catch {
      clearSession();
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      getAccessToken,
    }),
    [user, status, login, register, logout, getAccessToken],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
