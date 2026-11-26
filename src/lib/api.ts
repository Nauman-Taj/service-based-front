/**
 * Shared HTTP client for the NestJS API.
 *
 * `NEXT_PUBLIC_API_URL` is used by both Server Components and browser code.
 * Locally it defaults to the backend on port 4000. In production set it to the
 * deployed API origin (for example the Railway/Render/Vercel backend URL).
 */

const DEFAULT_API_URL = "http://localhost:4000";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL
).replace(/\/+$/, "");

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (Array.isArray(message)) {
        return message.join(" ");
      }
      if (typeof message === "string" && message) {
        return message;
      }
    }
  } catch {
    // Non-JSON error body; fall back to the status text.
  }
  return response.statusText || `Request failed with status ${response.status}.`;
}

/**
 * Performs a JSON request against the API.
 *
 * `credentials: "include"` keeps the backend's HttpOnly refresh cookie working
 * for login/refresh/logout calls. Auth-specific errors are translated to
 * `AuthError` in `lib/api-auth.ts`.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers, signal } = options;

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method,
      credentials: "include",
      signal,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      0,
      "Cannot reach the server. Check your connection and NEXT_PUBLIC_API_URL.",
    );
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
