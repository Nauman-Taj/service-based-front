import type { Metadata } from "next";

import AdminSettingsForm from "@/components/admin/AdminSettingsForm";

export const metadata: Metadata = {
  title: "Platform Settings",
  description: "Manage local administrator preferences and session settings.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsForm />;
}
