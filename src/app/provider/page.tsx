import type { Metadata } from "next";

import ProviderOverview from "@/components/provider/ProviderOverview";

export const metadata: Metadata = {
  title: "Provider Dashboard",
  description:
    "Manage booking requests, services, availability and earnings on Quicker.",
};

export default function ProviderDashboardPage() {
  return <ProviderOverview />;
}
