import type { Metadata } from "next";

import ProviderEarnings from "@/components/provider/ProviderEarnings";

export const metadata: Metadata = {
  title: "Provider Earnings",
  description: "Review completed bookings and earnings from your provider dashboard.",
};

export default function ProviderEarningsPage() {
  return <ProviderEarnings />;
}
