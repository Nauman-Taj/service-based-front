import type { Metadata } from "next";

import AdminServicesView from "@/components/admin/AdminServicesView";

export const metadata: Metadata = {
  title: "Manage Services",
  description: "Manage the Quicker service catalogue, pricing and status.",
};

export default function AdminServicesPage() {
  return <AdminServicesView />;
}
