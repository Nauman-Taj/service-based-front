import type { Metadata } from "next";
import { Suspense } from "react";

import DashboardBookingDetail from "@/components/booking/DashboardBookingDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export const metadata: Metadata = {
  title: "Booking Details",
  description: "Review the details and progress of your service booking.",
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
      perspective="customer"
      backHref="/customer/bookings"
    />
  );
}

export default function CustomerBookingDetailPage({
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
