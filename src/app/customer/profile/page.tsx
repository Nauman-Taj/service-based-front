import type { Metadata } from "next";

import DashboardIntro from "@/components/common/DashboardIntro";
import CustomerProfileForm from "@/components/customer/CustomerProfileForm";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Update your contact details and review your Quicker account summary.",
};

export default function CustomerProfilePage() {
  return (
    <div className="space-y-6">
      <DashboardIntro
        title="My Profile"
        description="Manage the details providers see when you book a service."
      />
      <CustomerProfileForm />
    </div>
  );
}
