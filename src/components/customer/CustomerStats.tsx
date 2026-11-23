"use client";

import { CalendarCheck, CheckCircle2, Clock, Wallet } from "lucide-react";

import StatCard from "@/components/common/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { formatCurrency } from "@/utils/formatCurrency";
import { isUpcomingStatus } from "@/utils/statusHelpers";

export default function CustomerStats() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const customerBookings = user
    ? bookings.filter((booking) => booking.customerId === user.id)
    : [];

  const upcoming = customerBookings.filter((booking) =>
    isUpcomingStatus(booking.status),
  ).length;
  const completed = customerBookings.filter(
    (booking) => booking.status === "completed",
  );
  const spent = completed.reduce((total, booking) => total + booking.price, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total bookings"
        value={String(customerBookings.length)}
        icon={CalendarCheck}
      />
      <StatCard
        label="Upcoming"
        value={String(upcoming)}
        icon={Clock}
        hint="Pending, confirmed or in progress"
      />
      <StatCard
        label="Completed"
        value={String(completed.length)}
        icon={CheckCircle2}
      />
      <StatCard
        label="Total spent"
        value={formatCurrency(spent)}
        icon={Wallet}
        hint="Completed bookings"
      />
    </div>
  );
}
