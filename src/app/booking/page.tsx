import type { Metadata } from "next";

import BookingLanding from "@/components/booking/BookingLanding";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Book a Service",
  description:
    "Choose a trusted local service, send a booking request in minutes and track every step from one place.",
};

export default function BookingPage() {
  return (
    <SiteShell>
      <BookingLanding />
    </SiteShell>
  );
}
