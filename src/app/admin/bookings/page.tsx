import type { Metadata } from "next";

import AdminBookingsView from "@/components/booking/AdminBookingsView";

export const metadata: Metadata = {
  title: "Manage Bookings",
  description: "Monitor and update every booking across the Quicker marketplace.",
};

export default function AdminBookingsPage() {
  return <AdminBookingsView />;
}
