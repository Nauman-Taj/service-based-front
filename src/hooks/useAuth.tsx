"use client";

/**
 * Auth state for the whole app.
 *
 * `AuthProvider` wraps the root layout; `useAuth()` exposes the current user
 * and auth actions. All server communication goes through the `AuthApi`
 * contract — today that is the hardcoded mock (`lib/mock-auth.ts`), later a
 * fetch-based client for the NestJS JWT API. Switching backends means
 * changing the import below, nothing else.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authApi, isTokenExpired } from "@/lib/mock-auth";
import { clearSession, readSession, writeSession } from "@/lib/storage";
import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  User,
} from "@/types/user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  /** Signs in and persists the session. Returns the user for role redirects. */
  login: (input: LoginInput, remember?: boolean) => Promise<User>;
  /** Registers, signs in and persists the session. */
  register: (input: RegisterInput, remember?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  /** Valid access token for API calls, refreshing first when expired. */
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

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

    // Access token expired — try the refresh token, exactly like the future
    // NestJS flow (POST /auth/refresh).
    try {
      const tokens = await authApi.refresh(session.tokens.refreshToken);
      const refreshed: AuthSession = { ...session, tokens };
      writeSession(refreshed);
      setUser(refreshed.user);
      setStatus("authenticated");
    } catch {
      clearSession();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

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
    async (input: LoginInput, remember = true): Promise<User> => {
      const response = await authApi.login(input);
      writeSession({ ...response, remember });
      setUser(response.user);
      setStatus("authenticated");
      return response.user;
    },
    [],
  );

  const register = useCallback(
    async (input: RegisterInput, remember = true): Promise<User> => {
      const response = await authApi.register(input);
      writeSession({ ...response, remember });
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
      const tokens = await authApi.refresh(session.tokens.refreshToken);
      writeSession({ ...session, tokens });
      return tokens.accessToken;
    } catch {
      clearSession();
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

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
