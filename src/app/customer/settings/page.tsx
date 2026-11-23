import type { Metadata } from "next";

import DashboardIntro from "@/components/common/DashboardIntro";
import CustomerSettingsForm from "@/components/customer/CustomerSettingsForm";

export const metadata: Metadata = {
  title: "Account Settings",
  description:
    "Manage notifications, privacy preferences and your Quicker session.",
};

export default function CustomerSettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Account Settings"
        description="Choose how Quicker contacts you and manages your local preferences."
      />
      <CustomerSettingsForm />
    </div>
  );
}
