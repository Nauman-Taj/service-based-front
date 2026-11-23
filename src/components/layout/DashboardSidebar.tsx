"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import Logo from "@/components/common/Logo";
import { dashboardNav } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/user";
import { roleHomePath } from "@/utils/roleHelpers";

interface DashboardSidebarProps {
  role: UserRole;
  /** Mobile drawer state (desktop sidebar is always visible). */
  open: boolean;
  onClose: () => void;
}

function isItemActive(pathname: string, href: string, role: UserRole): boolean {
  if (href === roleHomePath(role)) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardSidebar({
  role,
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = dashboardNav[role];

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-heading lg:hidden"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Dashboard">
        {items.map((item) => {
          const active = isItemActive(pathname, item.href, role);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-body hover:bg-slate-100 hover:text-heading",
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-primary" : "text-muted",
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-card lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-heading/45"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card shadow-xl">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
