import type { Metadata } from "next";

import AdminContactsView from "@/components/admin/AdminContactsView";

export const metadata: Metadata = {
  title: "Contact Inbox",
  description: "Read and organise messages submitted from the contact page.",
};

export default function AdminContactsPage() {
  return <AdminContactsView />;
}
