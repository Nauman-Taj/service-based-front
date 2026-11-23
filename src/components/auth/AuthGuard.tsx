"use client";

/**
 * Client-side route protection for the dashboard areas.
 *
 * - While the session is hydrating: full-page spinner.
 * - Signed out: redirect to /login with a `redirect` back to the target.
 * - Signed in with the wrong role: an access-denied panel (no redirect loop).
 *
 * This mirrors the UX of real server-side guards. When the NestJS backend
 * lands, the same check runs server-side (JWT cookie + proxy/middleware) and
 * this component remains as the client-side fallback.
 */

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";
import { roleHomePath, roleLabel } from "@/utils/roleHelpers";

interface AuthGuardProps {
  roles: UserRole[];
  children: ReactNode;
}

export default function AuthGuard({ roles, children }: AuthGuardProps) {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <LoadingSpinner
        className="min-h-screen"
        label="Checking your session…"
      />
    );
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <section className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-heading">
          Access denied
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          You are signed in as{" "}
          <span className="font-semibold text-heading">{user?.name}</span> (
          {user ? roleLabel(user.role) : "unknown"}). This area is only
          available to {roles.map(roleLabel).join(" / ")}.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {user ? (
            <ButtonLink href={roleHomePath(user.role)}>
              Go to my dashboard
            </ButtonLink>
          ) : null}
          <ButtonLink href="/" variant="outline">
            Back to homepage
          </ButtonLink>
          <button
            type="button"
            onClick={() => void logout()}
            className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-heading hover:underline"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
