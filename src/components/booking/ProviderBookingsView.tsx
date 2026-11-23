"use client";

import { Briefcase } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BookingsManager from "@/components/booking/BookingsManager";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";

/** Provider-scoped wrapper with a helpful state for unlinked accounts. */
export default function ProviderBookingsView() {
  const { user, status } = useAuth();
  const { bookings } = useBookings();

  if (status === "loading" || !user) {
    return (
      <LoadingSpinner className="min-h-[50vh]" label="Loading requests..." />
    );
  }

  if (!user.providerId) {
    return (
      <div className="space-y-6">
        <DashboardIntro
          title="Booking requests"
          description="Review new requests and keep every job on schedule."
        />
        <EmptyState
          icon={Briefcase}
          title="No provider profile linked"
          description="Your account is not linked to a provider profile yet. Add your business details first, then customer requests will appear here."
          action={
            <ButtonLink href="/provider/profile" size="sm">
              Complete your profile
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const requests = bookings.filter(
    (booking) => booking.providerId === user.providerId,
  );

  return (
    <BookingsManager
      bookings={requests}
      perspective="provider"
      title="Booking requests"
      description="Accept new work, start jobs and mark them complete as you go."
      sortMode="pending-first"
      action={
        <ButtonLink href="/provider/services" size="sm" variant="outline">
          My services
        </ButtonLink>
      }
    />
  );
}
