import type { Metadata } from "next";

import AdminReportsView from "@/components/admin/AdminReportsView";

export const metadata: Metadata = {
  title: "Reports",
  description: "Booking, revenue and catalogue performance across Quicker.",
};

export default function AdminReportsPage() {
  return <AdminReportsView />;
}
