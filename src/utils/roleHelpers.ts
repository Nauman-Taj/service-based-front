import type { User, UserRole } from "@/types/user";

/** Landing route for each role after sign-in. */
export function roleHomePath(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/customer";
    case "provider":
      return "/provider";
    case "admin":
      return "/admin";
  }
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "customer":
      return "Customer";
    case "provider":
      return "Service Provider";
    case "admin":
      return "Admin";
  }
}

/** UI-level role check. Real authorization is enforced by the backend. */
export function hasRole(user: User | null, roles: UserRole[]): boolean {
  return Boolean(user && roles.includes(user.role));
}

/**
 * Only allow same-origin relative redirect targets (e.g. the `?redirect=`
 * param on /login). Blocks protocol-relative and absolute URLs.
 */
export function safeRedirectPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}
