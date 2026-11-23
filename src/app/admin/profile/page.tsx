import type { Metadata } from "next";

import AdminProfileForm from "@/components/admin/AdminProfileForm";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage the administrator profile for Quicker.",
};

export default function AdminProfilePage() {
  return <AdminProfileForm />;
}
