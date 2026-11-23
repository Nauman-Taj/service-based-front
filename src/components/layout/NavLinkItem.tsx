"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavLinkItemProps {
  href: string;
  label: string;
  pathname: string;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

/**
 * One link treatment shared by the desktop navbar and the mobile menu, so
 * active, hover and same-page click behaviour never diverge between the two.
 */
export default function NavLinkItem({
  href,
  label,
  pathname,
  variant,
  onNavigate,
}: NavLinkItemProps) {
  const active = isNavLinkActive(pathname, href);

  function handleClick() {
    onNavigate?.();

    if (typeof window === "undefined") {
      return;
    }

    // Next.js scrolls on a route change but not when the destination is the
    // current URL. Match the route-change behaviour here (instant, like the
    // browser's native scroll restoration) so every navbar click responds.
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl === href) {
      window.scrollTo(0, 0);
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors",
        variant === "desktop"
          ? "px-3 py-2"
          : "w-full justify-start px-4 py-2.5",
        active
          ? "bg-primary/10 text-primary"
          : "text-body hover:bg-slate-100 hover:text-heading",
      )}
    >
      {label}
    </Link>
  );
}
