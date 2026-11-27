"use client";

import { CalendarCheck, UserCog, Users, Wallet } from "lucide-react";

import StatCard from "@/components/common/StatCard";
import { useAdminOverview } from "@/hooks/useAdminData";
import { formatCurrency } from "@/utils/formatCurrency";

export default function AdminStats() {
  const {
    overview,
    loading,
    error,
  } = useAdminOverview();

  return (
    <div className="space-y-3">
      {loading ? (
        <p
          role="status"
          className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted"
        >
          Loading dashboard summary…
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bookings"
          value={overview ? String(overview.totalBookings) : "0"}
          icon={CalendarCheck}
          hint={overview ? `${overview.activeBookings} currently active` : undefined}
        />
        <StatCard
          label="Customers"
          value={overview ? String(overview.customers) : "0"}
          icon={Users}
        />
        <StatCard
          label="Providers"
          value={overview ? String(overview.providers) : "0"}
          icon={UserCog}
        />
        <StatCard
          label="Revenue"
          value={overview ? formatCurrency(overview.revenue) : "0"}
          icon={Wallet}
          hint="Completed bookings"
        />
      </div>
    </div>
  );
}
