import type { Metadata } from "next";

import ProviderProfileForm from "@/components/provider/ProviderProfileForm";

export const metadata: Metadata = {
  title: "Provider Profile",
  description: "Manage your public provider profile on Quicker.",
};

export default function ProviderProfilePage() {
  return <ProviderProfileForm />;
}
