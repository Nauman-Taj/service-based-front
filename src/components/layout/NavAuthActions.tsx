"use client";

/**
 * Navbar auth slot: "Sign in / Get started" for visitors, a user menu with
 * dashboard link and sign-out for authenticated users. Used by both the
 * desktop navbar and the mobile menu so behaviour stays identical.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import Avatar from "@/components/common/Avatar";
import { buttonStyles } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { roleHomePath, roleLabel } from "@/utils/roleHelpers";

interface NavAuthActionsProps {
  variant: "desktop" | "mobile";
  /** Mobile menu closes itself after navigation/sign-out. */
  onNavigate?: () => void;
}

export default function NavAuthActions({
  variant,
  onNavigate,
}: NavAuthActionsProps) {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Avoid a flash of the wrong actions while the session hydrates.
  if (status === "loading") {
    return null;
  }

  if (!user) {
    if (variant === "mobile") {
      return (
        <>
          <Link
            href="/login"
            onClick={onNavigate}
            className={buttonStyles("ghost", "md", "w-full")}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={onNavigate}
            className={buttonStyles("primary", "md", "w-full")}
          >
            Get started
          </Link>
        </>
      );
    }
    return (
      <>
        <Link href="/login" className={buttonStyles("ghost", "sm")}>
          Sign in
        </Link>
        <Link href="/register" className={buttonStyles("primary", "sm")}>
          Get started
        </Link>
      </>
    );
  }

  const dashboardPath = roleHomePath(user.role);

  async function handleSignOut() {
    setOpen(false);
    onNavigate?.();
    await logout();
    router.push("/");
  }

  if (variant === "mobile") {
    return (
      <>
        <div className="flex items-center gap-3 px-1 pb-2">
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">
              {user.name}
            </p>
            <p className="text-xs text-muted">{roleLabel(user.role)}</p>
          </div>
        </div>
        <Link
          href={dashboardPath}
          onClick={onNavigate}
          className={buttonStyles("primary", "md", "w-full")}
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          My dashboard
        </Link>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className={buttonStyles("ghost", "md", "w-full")}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-line bg-card py-1 pl-1 pr-3 transition-colors hover:border-primary/40"
      >
        <Avatar name={user.name} src={user.avatar} size="sm" />
        <span className="max-w-32 truncate text-sm font-semibold text-heading">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-card shadow-lg"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-heading">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <p className="mt-1 text-xs font-medium text-primary">
              {roleLabel(user.role)}
            </p>
          </div>
          <Link
            href={dashboardPath}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body transition-colors hover:bg-slate-50 hover:text-heading"
          >
            <LayoutDashboard className="h-4 w-4 text-muted" aria-hidden="true" />
            My dashboard
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-body transition-colors hover:bg-slate-50 hover:text-heading"
          >
            <LogOut className="h-4 w-4 text-muted" aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
