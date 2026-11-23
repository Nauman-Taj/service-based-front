import type { Metadata } from "next";

import CustomerBookingsView from "@/components/booking/CustomerBookingsView";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "Review and manage all of your Quicker service bookings.",
};

export default function CustomerBookingsPage() {
  return <CustomerBookingsView />;
}
