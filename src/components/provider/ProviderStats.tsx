"use client";

import { CalendarCheck, CheckCircle2, Inbox, Wallet } from "lucide-react";

import StatCard from "@/components/common/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { formatCurrency } from "@/utils/formatCurrency";

export default function ProviderStats() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const providerBookings =
    user?.providerId
      ? bookings.filter((booking) => booking.providerId === user.providerId)
      : [];

  const pending = providerBookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const upcoming = providerBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "in-progress",
  ).length;
  const completed = providerBookings.filter(
    (booking) => booking.status === "completed",
  );
  const earnings = completed.reduce(
    (total, booking) => total + booking.price,
    0,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="New requests"
        value={String(pending)}
        icon={Inbox}
        hint="Awaiting your response"
      />
      <StatCard
        label="Upcoming jobs"
        value={String(upcoming)}
        icon={CalendarCheck}
      />
      <StatCard
        label="Completed"
        value={String(completed.length)}
        icon={CheckCircle2}
      />
      <StatCard
        label="Earnings"
        value={formatCurrency(earnings)}
        icon={Wallet}
        hint="Completed jobs"
      />
    </div>
  );
}
