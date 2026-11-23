import type { Metadata } from "next";

import CustomerOverview from "@/components/customer/CustomerOverview";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "Manage your bookings, favorites and account on Quicker.",
};

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}
