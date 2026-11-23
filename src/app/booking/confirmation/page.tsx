import type { Metadata } from "next";
import { Suspense } from "react";

import ConfirmationContent from "@/components/booking/ConfirmationContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Request Confirmed",
  description: "Your Quicker service request has been received.",
};

export default function BookingConfirmationPage() {
  return (
    <SiteShell>
      <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
        <ConfirmationContent />
      </Suspense>
    </SiteShell>
  );
}
