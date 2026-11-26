import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  ChevronRight,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import SiteShell from "@/components/layout/SiteShell";
import ServiceGrid from "@/components/services/ServiceGrid";
import {
  getCategories,
  getCategoryBySlug,
  getServices,
} from "@/lib/public-api";
import { formatCurrency } from "@/utils/formatCurrency";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/category/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.name,
    description: `Compare vetted ${category.name.toLowerCase()} professionals in Multan. ${category.description}`,
  };
}

export default async function ServiceCategoryPage({
  params,
}: PageProps<"/services/category/[category]">) {
  const { category: slug } = await params;
  const [category, categories, services] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getServices(),
  ]);

  if (!category) {
    notFound();
  }

  const Icon = category.icon;
  const categoryServices = services.filter(
    (service) => service.categorySlug === category.slug,
  );
  const otherCategories = categories.filter(
    (item) => item.slug !== category.slug,
  );

  const serviceCounts = new Map<string, number>();
  for (const service of services) {
    serviceCounts.set(
      service.categorySlug,
      (serviceCounts.get(service.categorySlug) ?? 0) + 1,
    );
  }

  const averageRating =
    categoryServices.length > 0
      ? categoryServices.reduce((sum, service) => sum + service.rating, 0) /
        categoryServices.length
      : null;

  const startingPrice =
    categoryServices.length > 0
      ? Math.min(...categoryServices.map((service) => service.price))
      : null;

  return (
    <SiteShell>
      <section className="border-b border-line bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <li>
                <Link
                  href="/"
                  className="rounded transition-colors hover:text-heading"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <Link
                  href="/services"
                  className="rounded transition-colors hover:text-heading"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <span aria-current="page" className="font-medium text-heading">
                  {category.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Service category
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                {category.description} Compare vetted professionals in Multan
                and book with upfront PKR pricing.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="#category-services">View services</ButtonLink>
                <ButtonLink href="/services" variant="outline">
                  Browse all services
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                At a glance
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <dt className="text-muted">Services listed</dt>
                  <dd className="font-semibold text-heading">
                    {categoryServices.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <dt className="text-muted">Average rating</dt>
                  <dd className="font-semibold text-heading">
                    {averageRating !== null
                      ? averageRating.toFixed(1)
                      : "Coming soon"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <dt className="text-muted">Starting from</dt>
                  <dd className="font-semibold text-heading">
                    {startingPrice !== null
                      ? formatCurrency(startingPrice)
                      : "Coming soon"}
                  </dd>
                </div>
                <div className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-muted">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Every provider is background-checked and reviewed by real
                  customers.
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section
        id="category-services"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-heading sm:text-2xl">
                  Services in {category.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {categoryServices.length === 0
                    ? "New services are added regularly."
                    : `${categoryServices.length} ${
                        categoryServices.length === 1 ? "service" : "services"
                      } available in Multan.`}
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 rounded text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                View all services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6">
              <ServiceGrid
                services={categoryServices}
                emptyTitle={`No services in ${category.name} yet`}
                emptyDescription="We are still onboarding vetted professionals in this category for Multan. Browse the full catalogue while we grow it."
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-heading">
                Explore other categories
              </h2>
              <ul className="mt-3 space-y-0.5">
                {otherCategories.map((item) => {
                  const OtherIcon = item.icon;
                  const count = serviceCounts.get(item.slug) ?? 0;

                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/services/category/${item.slug}`}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-background"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <OtherIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="flex-1 font-medium text-body transition-colors group-hover:text-primary">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted">
                          {count > 0 ? count : "Soon"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Book with confidence
              </p>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted">
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Background-checked professionals
                </li>
                <li className="flex items-start gap-2">
                  <Banknote
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Upfront PKR pricing, no surprises
                </li>
                <li className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Local support across Multan
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
