import type { Metadata } from "next";
import { Suspense } from "react";

import DashboardBookingDetail from "@/components/booking/DashboardBookingDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export const metadata: Metadata = {
  title: "Booking Details",
  description: "Review a service request and update its progress.",
};

async function RouteContent({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  return (
    <DashboardBookingDetail
      bookingId={bookingId}
      perspective="provider"
      backHref="/provider/bookings"
    />
  );
}

export default function ProviderBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-[50vh]" />}>
      <RouteContent params={params} />
    </Suspense>
  );
}
