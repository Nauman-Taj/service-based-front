/**
 * Real `AuthApi` implementation backed by the NestJS API.
 *
 * The rest of the frontend talks to this through `hooks/useAuth.tsx`, so the
 * public `AuthApi` contract and every form stay unchanged.
 */

import { ApiError, apiRequest } from "@/lib/api";
import {
  AuthError,
  type AuthApi,
  type AuthResponse,
  type AuthTokens,
  type LoginInput,
  type RegisterInput,
  type User,
} from "@/types/user";

async function authRequest<T>(
  path: string,
  options?: Parameters<typeof apiRequest>[1],
): Promise<T> {
  try {
    return await apiRequest<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new AuthError(error.status, error.message);
    }
    throw error;
  }
}

export const authApi: AuthApi = {
  login(input: LoginInput): Promise<AuthResponse> {
    return authRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
    });
  },

  register(input: RegisterInput): Promise<AuthResponse> {
    return authRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: input,
    });
  },

  refresh(refreshToken: string): Promise<AuthTokens> {
    return authRequest<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
  },

  async logout(refreshToken: string): Promise<void> {
    await authRequest<{ success: boolean }>("/auth/logout", {
      method: "POST",
      body: { refreshToken },
    });
  },

  me(accessToken: string): Promise<User> {
    return authRequest<User>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
