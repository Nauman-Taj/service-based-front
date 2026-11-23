import type { Metadata } from "next";

import AdminReviewsView from "@/components/admin/AdminReviewsView";

export const metadata: Metadata = {
  title: "Reviews Moderation",
  description: "Approve, reject and remove marketplace reviews.",
};

export default function AdminReviewsPage() {
  return <AdminReviewsView />;
}
