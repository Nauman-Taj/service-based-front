/**
 * Auth and user types.
 *
 * These shapes intentionally mirror what a NestJS JWT backend will return:
 * - `POST /auth/login` and `POST /auth/register` -> `AuthResponse`
 * - `POST /auth/refresh` -> `AuthTokens`
 * - `GET /auth/me` -> `User`
 *
 * The real API client lives in `lib/api-auth.ts`; `lib/mock-auth.ts` remains an
 * offline reference. These types and every consumer stay the same.
 */

export type UserRole = "customer" | "provider" | "admin";

/** Roles a visitor can pick when registering. Admins are created internally. */
export type RegisterableRole = Exclude<UserRole, "admin">;

/** Public user profile — never contains credentials. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  /** Links a provider user to their public provider profile (`data/providers.ts`). */
  providerId?: string;
  createdAt: string;
}

/** JWT pair as returned by a NestJS auth module. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds (e.g. 900 = 15 minutes). */
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/** Tab-local session (sessionStorage for now; httpOnly cookies later). */
export type AuthSession = AuthResponse;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: RegisterableRole;
}

/**
 * The auth endpoint contract. `lib/api-auth.ts` implements it with `fetch`
 * calls to the NestJS API (Bearer access token); `lib/mock-auth.ts` keeps a
 * hardcoded implementation for offline reference.
 */
export interface AuthApi {
  /** POST /auth/login */
  login(input: LoginInput): Promise<AuthResponse>;
  /** POST /auth/register */
  register(input: RegisterInput): Promise<AuthResponse>;
  /** POST /auth/refresh */
  refresh(refreshToken: string): Promise<AuthTokens>;
  /** POST /auth/logout */
  logout(refreshToken: string): Promise<void>;
  /** GET /auth/me */
  me(accessToken: string): Promise<User>;
}

/** Mirrors a NestJS HttpException body (`{ statusCode, message }`). */
export class AuthError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}
