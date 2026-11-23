"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BookingDetailsPanel from "@/components/booking/BookingDetailsPanel";
import BookingNotFound from "@/components/booking/BookingNotFound";
import BookingStatusTimeline from "@/components/booking/BookingStatusTimeline";
import { useBookingsReady } from "@/components/booking/useBookingsReady";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";

interface PublicBookingDetailProps {
  bookingId: string;
}

/** Public, read-only tracking view for a booking id from the URL. */
export default function PublicBookingDetail({
  bookingId,
}: PublicBookingDetailProps) {
  const { bookings } = useBookings();
  const { user } = useAuth();
  const ready = useBookingsReady();
  const booking = bookings.find((item) => item.id === bookingId);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingSpinner
          className="min-h-[50vh]"
          label="Loading booking details..."
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <BookingNotFound
          backHref="/booking"
          backLabel="Back to bookings"
          description="This booking is not available in this browser. Use the reference lookup to find another request."
        />
      </div>
    );
  }

  const canOpenCustomerDetail =
    user?.role === "customer" && user.id === booking.customerId;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/booking"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All bookings
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-heading">
            Booking details
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Reference <span className="font-semibold text-heading">{booking.reference}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/booking" variant="outline" size="sm">
            Back to bookings
          </ButtonLink>
          <ButtonLink href="/services" variant="outline" size="sm">
            Browse services
          </ButtonLink>
          {canOpenCustomerDetail ? (
            <ButtonLink
              href={`/customer/bookings/${booking.id}`}
              size="sm"
            >
              Open in my bookings
            </ButtonLink>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingDetailsPanel booking={booking} />
        </div>
        <div className="space-y-6">
          <BookingStatusTimeline
            status={booking.status}
            createdAt={booking.createdAt}
          />
          <aside className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-base font-bold text-heading">Need help?</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Quote your booking reference when contacting our team so we can
              find your request straight away.
            </p>
            <ButtonLink
              href="/contact"
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Contact support
            </ButtonLink>
          </aside>
        </div>
      </div>
    </div>
  );
}
