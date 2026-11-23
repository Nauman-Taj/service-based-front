import type { Metadata } from "next";

import ServiceForm from "@/components/forms/ServiceForm";

export const metadata: Metadata = {
  title: "Add a Service",
  description: "Create a new service for your Quicker provider listing.",
};

export default function ProviderAddServicePage() {
  return <ServiceForm />;
}
