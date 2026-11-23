"use client";

import { useState, type ReactNode } from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import type { UserRole } from "@/types/user";

interface DashboardLayoutProps {
  role: UserRole;
  children: ReactNode;
}

/**
 * Shared dashboard chrome: role-guarded sidebar + header + content area.
 * Used by the customer, provider and admin route layouts.
 */
export default function DashboardLayout({
  role,
  children,
}: DashboardLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AuthGuard roles={[role]}>
      <div className="min-h-screen bg-background">
        <DashboardSidebar
          role={role}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
        <div className="flex min-h-screen flex-col lg:pl-64">
          <DashboardHeader role={role} onMenuClick={() => setMenuOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
