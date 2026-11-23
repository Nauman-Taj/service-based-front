"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import BookingCard from "@/components/customer/BookingCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";

export default function RecentBookings() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const customerBookings = user
    ? bookings.filter((booking) => booking.customerId === user.id)
    : [];
  const recent = customerBookings.slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-heading">Recent bookings</h3>
        <Link
          href="/customer/bookings"
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
              perspective="customer"
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="When you book a service, it will show up here with its live status."
          action={
            <ButtonLink href="/services" size="sm">
              Browse services
            </ButtonLink>
          }
        />
      )}
    </section>
  );
}
