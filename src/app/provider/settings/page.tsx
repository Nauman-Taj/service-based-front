import type { Metadata } from "next";

import ProviderSettingsForm from "@/components/provider/ProviderSettingsForm";

export const metadata: Metadata = {
  title: "Provider Settings",
  description: "Manage notification, privacy and locale preferences on Quicker.",
};

export default function ProviderSettingsPage() {
  return <ProviderSettingsForm />;
}
