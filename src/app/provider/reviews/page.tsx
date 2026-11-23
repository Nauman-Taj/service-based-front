import type { Metadata } from "next";

import ProviderReviews from "@/components/provider/ProviderReviews";

export const metadata: Metadata = {
  title: "Provider Reviews",
  description: "Read customer feedback and moderate reviews on your provider listing.",
};

export default function ProviderReviewsPage() {
  return <ProviderReviews />;
}
