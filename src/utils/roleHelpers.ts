import type { User, UserRole } from "@/types/user";

const ROLE_HOME_PATHS: Record<UserRole, string> = {
  customer: "/customer",
  provider: "/provider",
  admin: "/admin",
};

/** Landing route for each role after sign-in. */
export function roleHomePath(role: UserRole): string {
  return ROLE_HOME_PATHS[role];
}

/**
 * Returns the role that owns a dashboard area, or `null` for public routes.
 * Matching is segment-aware, so `/admin-related` is not an admin route.
 */
function roleForPath(path: string): UserRole | null {
  const pathname = path.split(/[?#]/, 1)[0] ?? path;
  const match = (Object.entries(ROLE_HOME_PATHS) as Array<[UserRole, string]>).find(
    ([, home]) => pathname === home || pathname.startsWith(`${home}/`),
  );
  return match?.[0] ?? null;
}

/**
 * A `?redirect=` target is only safe for this user when it is public or belongs
 * to the user's own role area. This prevents a stale admin redirect from
 * sending a newly signed-in provider to the admin access-denied panel.
 */
export function canAccessRedirectPath(role: UserRole, path: string): boolean {
  const targetRole = roleForPath(path);
  return targetRole === null || targetRole === role;
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

/** Same-origin redirect target that the signed-in user is allowed to open. */
export function safeRedirectForRole(
  value: string | null,
  role: UserRole,
): string | null {
  const path = safeRedirectPath(value);
  return path && canAccessRedirectPath(role, path) ? path : null;
}
