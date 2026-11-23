import type { Metadata } from "next";
import { Suspense } from "react";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import SiteShell from "@/components/layout/SiteShell";
import ServicesBrowser from "@/components/services/ServicesBrowser";
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
  const initialFilters = parseServiceFilters(params);

  return (
    <SiteShell>
      <ServicesBrowser
        key={JSON.stringify(initialFilters)}
        initialFilters={initialFilters}
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
