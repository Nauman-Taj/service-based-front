"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import BookingCard from "@/components/customer/BookingCard";
import { useBookings } from "@/hooks/useBookings";

export default function RecentActivity() {
  const { bookings } = useBookings();
  const recent = [...bookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-heading">Recent activity</h3>
        <Link
          href="/admin/bookings"
          className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View all bookings
        </Link>
      </div>

      {recent.length ? (
        <div className="mt-4 space-y-3">
          {recent.map((booking) => (
            <BookingCard key={booking.id} booking={booking} perspective="admin" />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            icon={CalendarCheck}
            title="No booking activity yet"
            description="New requests from customers will appear here as soon as they are created."
          />
        </div>
      )}
    </section>
  );
}
