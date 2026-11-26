import type { Metadata } from "next";

import BookingLanding from "@/components/booking/BookingLanding";
import SiteShell from "@/components/layout/SiteShell";
import { getServices } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Book a Service",
  description:
    "Choose a trusted local service, send a booking request in minutes and track every step from one place.",
};

export default async function BookingPage() {
  const services = await getServices();

  return (
    <SiteShell>
      <BookingLanding services={services} />
    </SiteShell>
  );
}
