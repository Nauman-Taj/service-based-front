import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceDetails from "@/components/services/ServiceDetails";
import SiteShell from "@/components/layout/SiteShell";
import {
  getProviderById,
  getReviewsByService,
  getServiceById,
  getServices,
  getServicesByCategory,
} from "@/lib/public-api";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ serviceId: service.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[serviceId]">): Promise<Metadata> {
  const { serviceId } = await params;
  const service = await getServiceById(serviceId);

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
  const service = await getServiceById(serviceId);

  if (!service) {
    notFound();
  }

  const [provider, reviews, categoryServices] = await Promise.all([
    getProviderById(service.providerId),
    getReviewsByService(service.id),
    getServicesByCategory(service.categorySlug),
  ]);
  const relatedServices = categoryServices.filter(
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
