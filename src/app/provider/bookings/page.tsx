import type { Metadata } from "next";

import ProviderBookingsView from "@/components/booking/ProviderBookingsView";

export const metadata: Metadata = {
  title: "Booking Requests",
  description: "Accept, manage and complete your incoming service requests.",
};

export default function ProviderBookingsPage() {
  return <ProviderBookingsView />;
}
