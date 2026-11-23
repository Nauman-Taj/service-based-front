import type { Metadata } from "next";

import AdminCategoriesView from "@/components/admin/AdminCategoriesView";

export const metadata: Metadata = {
  title: "Manage Categories",
  description: "Organise Quicker service categories and category listings.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesView />;
}
