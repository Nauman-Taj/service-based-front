/**
 * Mock auth "backend" — hardcoded for now, shaped like the real thing.
 *
 * This module implements the `AuthApi` contract (see `types/user.ts`) exactly
 * as a NestJS auth module would expose it:
 *
 *   POST /auth/login           -> { user, tokens }
 *   POST /auth/register        -> { user, tokens }
 *   POST /auth/refresh         -> tokens
 *   POST /auth/logout          -> void
 *   GET  /auth/me              -> user
 *
 * Tokens are real JWT-shaped strings (header.payload.signature) carrying the
 * same claims a NestJS `JwtStrategy` would validate: `sub`, `email`, `role`,
 * `name`, `iat`, `exp`. The signature is a placeholder because signing and
 * verification belong to the server — the client only decodes claims to check
 * expiry, never to make security decisions.
 *
 * MIGRATION STATUS: `lib/api-auth.ts` now implements this contract against the
 * NestJS API and `hooks/useAuth.tsx` imports it. This file remains an offline
 * reference/hardcoded demo source; runtime auth does not use it.
 */

import {
  AuthError,
  type AuthApi,
  type AuthResponse,
  type AuthTokens,
  type LoginInput,
  type RegisterInput,
  type User,
  type UserRole,
} from "@/types/user";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

/* ------------------------------------------------------------------ */
/* Hardcoded demo accounts                                             */
/* ------------------------------------------------------------------ */

interface StoredUser extends User {
  password: string;
}

export interface DemoAccount {
  role: UserRole;
  label: string;
  email: string;
  password: string;
}

/** Shown on the login page so the hardcoded demo is easy to test. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "customer",
    label: "Customer",
    email: "ali@gmail.com",
    password: "customer1122",
  },
  {
    role: "provider",
    label: "Provider",
    email: "ayesha@quicker.com",
    password: "provider1122",
  },
  {
    role: "admin",
    label: "Admin",
    email: "admin@quicker.com",
    password: "nauman360",
  },
];

const DEMO_USERS: StoredUser[] = [
  {
    id: "user-cust-1",
    name: "Muhammad Ali",
    email: "ali@gmail.com",
    role: "customer",
    phone: "0300 1234567",
    createdAt: "2026-08-14T09:00:00.000Z",
    password: "customer1122",
  },
  {
    id: "user-prov-1",
    name: "Ayesha Khan",
    email: "ayesha@quicker.com",
    role: "provider",
    phone: "0301 2345678",
    // avatar: "/images/providers/ayesha-khan.jpg",
    providerId: "prov-1",
    createdAt: "2026-06-02T09:00:00.000Z",
    password: "provider1122",
  },
  {
    id: "user-admin-1",
    name: "Nauman Taj",
    email: "admin@quicker.com",
    role: "admin",
    phone: "0302 3456789",
    createdAt: "2026-05-01T09:00:00.000Z",
    password: "nauman360",
  },
];

/* ------------------------------------------------------------------ */
/* Token helpers (JWT-shaped, client-side decode only)                 */
/* ------------------------------------------------------------------ */

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes, like a typical NestJS setup
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

interface TokenClaims {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
  typ: "access" | "refresh";
  iat: number;
  exp: number;
}

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function issueToken(user: StoredUser, typ: "access" | "refresh"): string {
  const now = Math.floor(Date.now() / 1000);
  const ttl =
    typ === "access" ? ACCESS_TOKEN_TTL_SECONDS : REFRESH_TOKEN_TTL_SECONDS;
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const claims: TokenClaims = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    typ,
    iat: now,
    exp: now + ttl,
  };
  const payload = base64UrlEncode(JSON.stringify(claims));
  // Placeholder signature: real HS256 signing happens in the NestJS backend.
  return `${header}.${payload}.mock-signature`;
}

/** Decodes claims without verifying the signature (verification is server-side). */
export function decodeTokenClaims(token: string): TokenClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const claims = JSON.parse(base64UrlDecode(parts[1])) as TokenClaims;
    return typeof claims.sub === "string" && typeof claims.exp === "number"
      ? claims
      : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const claims = decodeTokenClaims(token);
  return !claims || claims.exp * 1000 <= Date.now();
}

function issueTokens(user: StoredUser): AuthTokens {
  return {
    accessToken: issueToken(user, "access"),
    refreshToken: issueToken(user, "refresh"),
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  };
}

/* ------------------------------------------------------------------ */
/* User store (demo accounts + locally registered accounts)            */
/* ------------------------------------------------------------------ */

function getStoredUsers(): StoredUser[] {
  return readJson<StoredUser[]>(STORAGE_KEYS.users, window.localStorage) ?? [];
}

function saveStoredUsers(users: StoredUser[]): void {
  writeJson(STORAGE_KEYS.users, users, window.localStorage);
}

/** Demo accounts merged with local registrations/password overrides. */
function getAllUsers(): StoredUser[] {
  const stored = getStoredUsers();
  const overrides = new Map(stored.map((user) => [user.email, user]));
  const merged = DEMO_USERS.map((user) => overrides.get(user.email) ?? user);
  const extra = stored.filter(
    (user) => !DEMO_USERS.some((demo) => demo.email === user.email),
  );
  return [...merged, ...extra];
}

function findByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return getAllUsers().find((user) => user.email.toLowerCase() === normalized);
}

function findById(id: string): StoredUser | undefined {
  return getAllUsers().find((user) => user.id === id);
}

function upsertUser(user: StoredUser): void {
  const stored = getStoredUsers();
  const index = stored.findIndex((candidate) => candidate.email === user.email);
  if (index >= 0) {
    stored[index] = user;
  } else {
    stored.push(user);
  }
  saveStoredUsers(stored);
}

/** Strips credentials — the API only ever returns the public profile. */
function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    providerId: user.providerId,
    createdAt: user.createdAt,
  };
}

/* ------------------------------------------------------------------ */
/* Misc helpers                                                        */
/* ------------------------------------------------------------------ */

/** Simulated network latency so loading states behave like a real API. */
function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertPasswordStrength(password: string): void {
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new AuthError(
      400,
      "Password must be at least 8 characters and include a letter and a number.",
    );
  }
}

/* ------------------------------------------------------------------ */
/* The API implementation                                              */
/* ------------------------------------------------------------------ */

export const authApi: AuthApi = {
  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    await delay();
    const user = findByEmail(email);
    if (!user || user.password !== password) {
      throw new AuthError(401, "Incorrect email or password.");
    }
    return { user: toPublicUser(user), tokens: issueTokens(user) };
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    await delay();
    const email = normalizeEmail(input.email);
    if (findByEmail(email)) {
      throw new AuthError(409, "An account with this email already exists.");
    }
    assertPasswordStrength(input.password);

    const user: StoredUser = {
      id: randomId(input.role === "provider" ? "user-prov" : "user-cust"),
      name: input.name.trim(),
      email,
      role: input.role,
      phone: input.phone?.trim() || undefined,
      createdAt: new Date().toISOString(),
      password: input.password,
    };
    upsertUser(user);
    return { user: toPublicUser(user), tokens: issueTokens(user) };
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    await delay(250);
    const claims = decodeTokenClaims(refreshToken);
    if (!claims || claims.typ !== "refresh" || isTokenExpired(refreshToken)) {
      throw new AuthError(401, "Session expired. Please sign in again.");
    }
    const user = findById(claims.sub);
    if (!user) {
      throw new AuthError(401, "Session expired. Please sign in again.");
    }
    return issueTokens(user);
  },

  async logout(refreshToken: string): Promise<void> {
    await delay(150);
    // The real backend revokes the refresh token here. The mock simply
    // acknowledges; the client clears its stored session either way.
    void refreshToken;
  },

  async me(accessToken: string): Promise<User> {
    await delay(200);
    const claims = decodeTokenClaims(accessToken);
    if (!claims || claims.typ !== "access" || isTokenExpired(accessToken)) {
      throw new AuthError(401, "Session expired. Please sign in again.");
    }
    const user = findById(claims.sub);
    if (!user) {
      throw new AuthError(401, "Session expired. Please sign in again.");
    }
    return toPublicUser(user);
  },
};
