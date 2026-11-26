"use client";

import { Check, CheckCircle2, Play, XCircle } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BookingDetailsPanel from "@/components/booking/BookingDetailsPanel";
import BookingNotFound from "@/components/booking/BookingNotFound";
import BookingStatusActions, {
  type BookingStatusAction,
} from "@/components/booking/BookingStatusActions";
import BookingStatusTimeline from "@/components/booking/BookingStatusTimeline";
import type { BookingPerspective } from "@/components/customer/BookingCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import type { Booking } from "@/types/booking";

interface DashboardBookingDetailProps {
  bookingId: string;
  perspective: BookingPerspective;
  backHref: string;
}

function cancelAction(label: string): BookingStatusAction {
  return {
    label,
    status: "cancelled",
    icon: XCircle,
    variant: "outline",
    confirmTitle: `${label}?`,
    confirmDescription:
      "This will mark the booking as cancelled. The other party will see the updated status straight away.",
    confirmLabel: label,
    destructive: true,
  };
}

function actionsFor(
  booking: Booking,
  perspective: BookingPerspective,
): BookingStatusAction[] {
  if (booking.status === "completed" || booking.status === "cancelled") {
    return [];
  }

  if (perspective === "customer") {
    return booking.status === "pending" || booking.status === "confirmed"
      ? [cancelAction("Cancel booking")]
      : [];
  }

  if (perspective === "provider") {
    if (booking.status === "pending") {
      return [
        {
          label: "Accept request",
          status: "confirmed",
          icon: CheckCircle2,
        },
        cancelAction("Decline request"),
      ];
    }
    if (booking.status === "confirmed") {
      return [
        { label: "Start service", status: "in-progress", icon: Play },
        cancelAction("Cancel booking"),
      ];
    }
    return [
      { label: "Mark complete", status: "completed", icon: Check },
      cancelAction("Cancel booking"),
    ];
  }

  if (booking.status === "pending") {
    return [
      { label: "Confirm booking", status: "confirmed", icon: CheckCircle2 },
      cancelAction("Cancel booking"),
    ];
  }
  if (booking.status === "confirmed") {
    return [
      { label: "Mark in progress", status: "in-progress", icon: Play },
      cancelAction("Cancel booking"),
    ];
  }
  return [
    { label: "Mark complete", status: "completed", icon: Check },
    cancelAction("Cancel booking"),
  ];
}

/** Role-aware detail view with live status controls for all dashboards. */
export default function DashboardBookingDetail({
  bookingId,
  perspective,
  backHref,
}: DashboardBookingDetailProps) {
  const { user } = useAuth();
  const { bookings, loading } = useBookings();
  const booking = bookings.find((item) => item.id === bookingId);

  if (!user || loading) {
    return (
      <LoadingSpinner
        className="min-h-[50vh]"
        label="Loading booking details..."
      />
    );
  }

  const intro = (
    <DashboardIntro
      title="Booking details"
      description={
        booking
          ? `Reference ${booking.reference} · ${booking.serviceName}`
          : "Review the details and progress of this booking."
      }
      action={
        <ButtonLink href={backHref} variant="outline" size="sm">
          Back to bookings
        </ButtonLink>
      }
    />
  );

  if (!booking) {
    return (
      <div className="space-y-6">
        {intro}
        <BookingNotFound
          backHref={backHref}
          backLabel="Back to bookings"
          description="This booking is not available. It may have been removed or the link may be incomplete."
          secondaryHref="/services"
        />
      </div>
    );
  }

  const restricted =
    (perspective === "customer" && user.id !== booking.customerId) ||
    (perspective === "provider" && user.providerId !== booking.providerId);

  if (restricted) {
    return (
      <div className="space-y-6">
        {intro}
        <BookingNotFound
          backHref={backHref}
          backLabel="Back to bookings"
          title="Booking unavailable"
          description="This booking belongs to another account or is no longer available."
          secondaryHref="/services"
        />
      </div>
    );
  }

  const actions = actionsFor(booking, perspective);

  return (
    <div className="space-y-6">
      {intro}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BookingDetailsPanel
            booking={booking}
            actions={
              actions.length ? (
                <BookingStatusActions booking={booking} actions={actions} />
              ) : (
                <p className="text-sm text-muted">
                  No further actions are available for this booking.
                </p>
              )
            }
          />
        </div>
        <BookingStatusTimeline
          status={booking.status}
          createdAt={booking.createdAt}
        />
      </div>
    </div>
  );
}
