import type { Metadata } from "next";
import { Suspense } from "react";

import PublicBookingDetail from "@/components/booking/PublicBookingDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Booking Details",
  description: "Track the status and full details of a Quicker booking request.",
};

async function RouteContent({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  return <PublicBookingDetail bookingId={bookingId} />;
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  return (
    <SiteShell>
      <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
        <RouteContent params={params} />
      </Suspense>
    </SiteShell>
  );
}
