import type { Metadata } from "next";

import AdminOverview from "@/components/admin/AdminOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Platform overview for Quicker administrators.",
};

// The route is guarded client-side, so this segment renders a session-loading
// state during instant-navigation validation and cannot be validated as instant.
export const instant = false;

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
