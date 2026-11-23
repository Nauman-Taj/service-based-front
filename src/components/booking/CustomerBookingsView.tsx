"use client";

import { ButtonLink } from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BookingsManager from "@/components/booking/BookingsManager";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";

/** Customer-scoped wrapper around the shared bookings manager. */
export default function CustomerBookingsView() {
  const { user, status } = useAuth();
  const { bookings } = useBookings();

  if (status === "loading" || !user) {
    return (
      <LoadingSpinner className="min-h-[50vh]" label="Loading your bookings..." />
    );
  }

  const mine = bookings.filter((booking) => booking.customerId === user.id);

  return (
    <BookingsManager
      bookings={mine}
      perspective="customer"
      title="My bookings"
      description="Review your service requests, track their progress and manage cancellations."
      action={
        <ButtonLink href="/services" size="sm">
          Book a service
        </ButtonLink>
      }
    />
  );
}
