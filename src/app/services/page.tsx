import type { Metadata } from "next";
import { Suspense } from "react";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import SiteShell from "@/components/layout/SiteShell";
import ServicesBrowser from "@/components/services/ServicesBrowser";
import {
  getCategories,
  getProviders,
  getServices,
} from "@/lib/public-api";
import { parseServiceFilters } from "@/lib/serviceFilters";

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Search and compare vetted local services in Multan. Filter by category, price and provider, then book with upfront PKR pricing.",
};

async function ServicesContent({
  searchParams,
}: Pick<PageProps<"/services">, "searchParams">) {
  const params = await searchParams;
  const [categories, providers, services] = await Promise.all([
    getCategories(),
    getProviders(),
    getServices(),
  ]);
  const initialFilters = parseServiceFilters(params, {
    categories,
    providers,
    services,
  });

  return (
    <SiteShell>
      <ServicesBrowser
        key={JSON.stringify(initialFilters)}
        initialFilters={initialFilters}
        services={services}
        categories={categories.map(({ slug, name }) => ({ slug, name }))}
        providers={providers.map(({ id, businessName }) => ({
          id,
          businessName,
        }))}
      />
    </SiteShell>
  );
}

export default function ServicesPage({
  searchParams,
}: PageProps<"/services">) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ServicesContent searchParams={searchParams} />
    </Suspense>
  );
}
