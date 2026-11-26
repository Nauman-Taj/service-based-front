"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BookingDetailsPanel from "@/components/booking/BookingDetailsPanel";
import BookingNotFound from "@/components/booking/BookingNotFound";
import { useBookings } from "@/hooks/useBookings";

const nextSteps = [
  "Our team will call you to confirm the details and final price.",
  "The provider accepts the request and confirms the time slot.",
  "You will get an update as the job progresses. No payment is due on this site.",
];

/** Confirmation screen driven by the `?reference=` query parameter. */
export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { bookings, loading } = useBookings();

  const booking = useMemo(() => {
    if (!reference) {
      return null;
    }
    const query = reference.trim().toUpperCase();
    return bookings.find((item) => item.reference.toUpperCase() === query) ?? null;
  }, [bookings, reference]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingSpinner
          className="min-h-[50vh]"
          label="Loading booking..."
        />
      </div>
    );
  }

  if (!reference) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <BookingNotFound
          backHref="/booking"
          backLabel="Track a booking"
          title="No reference supplied"
          description="This page needs a booking reference. Check the link you followed or look up your request on the booking page."
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <BookingNotFound
          backHref="/booking"
          backLabel="Track a booking"
          title="Booking not found"
          description={`We could not find a booking with reference ${reference}. The request may have been made in a different browser, or the reference may be mistyped.`}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-line bg-card px-6 py-10 text-center shadow-sm sm:px-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-heading">
          Request received
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Thanks, {booking.customerName}. Your request for {booking.serviceName}{" "}
          is saved. Keep the reference below handy while we arrange the details.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-bold text-heading">
          Reference: {booking.reference}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={`/booking/${booking.id}`}>
            View booking details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/services" variant="outline">
            Browse more services
          </ButtonLink>
        </div>
      </section>

      <BookingDetailsPanel booking={booking} />

      <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="text-base font-bold text-heading">What happens next</h2>
        </div>
        <ol className="mt-4 space-y-3">
          {nextSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-6 border-t border-line pt-5">
          <ButtonLink href="/booking" variant="outline" size="sm">
            Back to booking page
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
