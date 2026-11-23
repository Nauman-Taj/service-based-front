import type { Metadata } from "next";

import ProviderServices from "@/components/provider/ProviderServices";

export const metadata: Metadata = {
  title: "My Services",
  description: "Add, edit, pause and delete the services on your provider listing.",
};

export default function ProviderServicesPage() {
  return <ProviderServices />;
}
