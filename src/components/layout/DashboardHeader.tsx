"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, LogOut, Menu } from "lucide-react";

import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";
import { roleLabel } from "@/utils/roleHelpers";

interface DashboardHeaderProps {
  role: UserRole;
  onMenuClick: () => void;
}

export default function DashboardHeader({
  role,
  onMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleSignOut() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-heading transition-colors hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/"
            aria-label="View site"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-heading sm:h-auto sm:w-auto sm:gap-1.5 sm:px-2"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="hidden text-sm font-medium sm:inline">View site</span>
          </Link>

          <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden min-w-0 leading-tight md:block">
                <p className="max-w-40 truncate text-sm font-semibold text-heading">
                  {user.name}
                </p>
                <p className="flex text-xs text-muted justify-end">{roleLabel(role)}</p>
              </div>
              <Avatar name={user.name} src={user.avatar} size="sm" />
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full  px-3 text-sm font-semibold text-body transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
