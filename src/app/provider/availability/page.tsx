import type { Metadata } from "next";

import AvailabilityCalendar from "@/components/provider/AvailabilityCalendar";

export const metadata: Metadata = {
  title: "Provider Availability",
  description: "Set weekly booking hours and block unavailable dates.",
};

export default function ProviderAvailabilityPage() {
  return <AvailabilityCalendar />;
}
