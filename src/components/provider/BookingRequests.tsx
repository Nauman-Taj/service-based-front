"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import BookingCard from "@/components/customer/BookingCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";

export default function BookingRequests() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const providerBookings = user?.providerId
    ? bookings.filter((booking) => booking.providerId === user.providerId)
    : [];

  // Pending requests first, then everything else by recency.
  const sorted = [...providerBookings].sort((a, b) => {
    if ((a.status === "pending") !== (b.status === "pending")) {
      return a.status === "pending" ? -1 : 1;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
  const recent = sorted.slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-heading">Booking requests</h3>
        <Link
          href="/provider/bookings"
          className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View all
        </Link>
      </div>

      {recent.length ? (
        <div className="mt-4 space-y-3">
          {recent.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              perspective="provider"
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No booking requests yet"
          description="Requests from customers will appear here as soon as they book one of your services."
        />
      )}
    </section>
  );
}
