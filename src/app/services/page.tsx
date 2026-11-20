import type { Metadata } from "next";
import { Suspense } from "react";

import SiteShell from "@/components/layout/SiteShell";
import ServicesBrowser from "@/components/services/ServicesBrowser";
import { parseServiceFilters } from "@/lib/serviceFilters";

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Search and compare vetted local services in Multan. Filter by category, price and provider, then book with upfront PKR pricing.",
};

function ServicesPageSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="border-b border-line bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
            <div>
              <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded-lg bg-slate-200" />
              <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
          <div className="hidden h-[34rem] animate-pulse rounded-2xl border border-line bg-card lg:block" />
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-64 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl border border-line bg-card"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ServicesContent({
  searchParams,
}: Pick<PageProps<"/services">, "searchParams">) {
  const params = await searchParams;
  const initialFilters = parseServiceFilters(params);

  return (
    <ServicesBrowser
      key={JSON.stringify(initialFilters)}
      initialFilters={initialFilters}
    />
  );
}

export default function ServicesPage({
  searchParams,
}: PageProps<"/services">) {
  return (
    <SiteShell>
      <Suspense fallback={<ServicesPageSkeleton />}>
        <ServicesContent searchParams={searchParams} />
      </Suspense>
    </SiteShell>
  );
}
