import type { Metadata } from "next";

import AdminProvidersView from "@/components/admin/AdminProvidersView";

export const metadata: Metadata = {
  title: "Manage Providers",
  description: "Review provider details, performance and marketplace access.",
};

export default function AdminProvidersPage() {
  return <AdminProvidersView />;
}
