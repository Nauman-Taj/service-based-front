import type { Metadata } from "next";

import DashboardIntro from "@/components/common/DashboardIntro";
import FavoritesGrid from "@/components/customer/FavoritesGrid";

export const metadata: Metadata = {
  title: "Saved Services",
  description: "Find and manage the services you have saved on Quicker.",
};

export default function CustomerFavoritesPage() {
  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Saved Services"
        description="Keep your favorite services close and add more from the marketplace."
      />
      <FavoritesGrid />
    </div>
  );
}
