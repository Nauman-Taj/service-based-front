"use client";

import { CalendarCheck, UserCog, Users, Wallet } from "lucide-react";

import StatCard from "@/components/common/StatCard";
import { customers } from "@/data/customers";
import { providers } from "@/data/providers";
import { useBookings } from "@/hooks/useBookings";
import { formatCurrency } from "@/utils/formatCurrency";

export default function AdminStats() {
  const { bookings } = useBookings();
  const revenue = bookings
    .filter((booking) => booking.status === "completed")
    .reduce((total, booking) => total + booking.price, 0);
  const active = bookings.filter(
    (booking) =>
      booking.status === "pending" ||
      booking.status === "confirmed" ||
      booking.status === "in-progress",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Bookings"
        value={String(bookings.length)}
        icon={CalendarCheck}
        hint={`${active} currently active`}
      />
      <StatCard label="Customers" value={String(customers.length)} icon={Users} />
      <StatCard
        label="Providers"
        value={String(providers.length)}
        icon={UserCog}
      />
      <StatCard
        label="Revenue"
        value={formatCurrency(revenue)}
        icon={Wallet}
        hint="Completed bookings"
      />
    </div>
  );
}
