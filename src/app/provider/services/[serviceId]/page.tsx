import type { Metadata } from "next";

import ServiceForm from "@/components/forms/ServiceForm";

export const metadata: Metadata = {
  title: "Edit Service",
  description: "Update the details of a service on your Quicker provider listing.",
};

export default async function ProviderEditServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <ServiceForm serviceId={serviceId} />;
}
