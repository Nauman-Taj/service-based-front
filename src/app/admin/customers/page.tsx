import type { Metadata } from "next";

import AdminCustomersView from "@/components/admin/AdminCustomersView";

export const metadata: Metadata = {
  title: "Manage Customers",
  description: "Browse customers, booking activity and account status.",
};

export default function AdminCustomersPage() {
  return <AdminCustomersView />;
}
