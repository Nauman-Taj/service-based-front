import type { Metadata } from "next";

import DashboardIntro from "@/components/common/DashboardIntro";
import CustomerReviews from "@/components/customer/CustomerReviews";

export const metadata: Metadata = {
  title: "My Reviews",
  description: "Read and manage the reviews you have shared on Quicker.",
};

export default function CustomerReviewsPage() {
  return (
    <div className="space-y-6">
      <DashboardIntro
        title="My Reviews"
        description="Share feedback on completed work and keep your reviews up to date."
      />
      <CustomerReviews />
    </div>
  );
}
