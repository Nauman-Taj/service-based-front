"use client";

import { ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import AdminStats from "@/components/admin/AdminStats";
import RecentActivity from "@/components/admin/RecentActivity";
import { useAuth } from "@/hooks/useAuth";

export default function AdminOverview() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <DashboardIntro
        title={`Welcome back, ${firstName}`}
        description="Platform health at a glance — bookings, people and revenue."
        action={
          <ButtonLink href="/admin/providers" size="sm" variant="outline">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Review providers
          </ButtonLink>
        }
      />
      <AdminStats />
      <RecentActivity />
    </div>
  );
}
