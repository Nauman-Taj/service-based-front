import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceDetails from "@/components/services/ServiceDetails";
import SiteShell from "@/components/layout/SiteShell";
import {
  getServicesByCategory,
  getServiceById,
  services,
} from "@/data/services";
import { getProviderById } from "@/data/providers";
import { getReviewsByService } from "@/data/reviews";

export function generateStaticParams() {
  return services.map((service) => ({ serviceId: service.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[serviceId]">): Promise<Metadata> {
  const { serviceId } = await params;
  const service = getServiceById(serviceId);

  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[serviceId]">) {
  const { serviceId } = await params;
  const service = getServiceById(serviceId);

  if (!service) {
    notFound();
  }

  const provider = getProviderById(service.providerId);
  const reviews = getReviewsByService(service.id);
  const relatedServices = getServicesByCategory(service.categorySlug).filter(
    (item) => item.id !== service.id,
  );

  return (
    <SiteShell>
      <ServiceDetails
        service={service}
        provider={provider}
        reviews={reviews}
        relatedServices={relatedServices}
      />
    </SiteShell>
  );
}
