"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Banknote,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Button from "@/components/common/Button";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceGrid from "@/components/services/ServiceGrid";
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  type PriceRange,
  type ServiceFilterValues,
  type ServiceView,
  type SortValue,
} from "@/lib/serviceFilters";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Provider } from "@/types/provider";
import type { Service } from "@/types/service";

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 py-1 pl-3 pr-1 text-xs font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  );
}

interface ServicesBrowserProps {
  initialFilters: ServiceFilterValues;
  services: Service[];
  categories: Array<Pick<Category, "slug" | "name">>;
  providers: Array<Pick<Provider, "id" | "businessName">>;
}

export default function ServicesBrowser({
  initialFilters,
  services,
  categories,
  providers,
}: ServicesBrowserProps) {
  const [query, setQuery] = useState(initialFilters.query);
  const [category, setCategory] = useState(initialFilters.category);
  const [price, setPrice] = useState<PriceRange>(initialFilters.price);
  const [providerId, setProviderId] = useState(initialFilters.providerId);
  const [sort, setSort] = useState<SortValue>(initialFilters.sort);
  const [view, setView] = useState<ServiceView>(initialFilters.view);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    if (category) params.set("category", category);
    if (price) params.set("price", price);
    if (providerId) params.set("provider", providerId);
    if (sort !== "recommended") params.set("sort", sort);
    if (view !== "grid") params.set("view", view);

    const next = params.toString();
    const nextUrl = next
      ? `${window.location.pathname}?${next}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl === currentUrl) return;

    const timeout = window.setTimeout(() => {
      window.history.replaceState(null, "", nextUrl);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query, category, price, providerId, sort, view]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredServices = services.filter((service) => {
    if (category && service.categorySlug !== category) return false;
    if (providerId && service.providerId !== providerId) return false;

    if (price === "under-10000" && service.price >= 10000) return false;
    if (
      price === "10000-20000" &&
      (service.price < 10000 || service.price > 20000)
    ) {
      return false;
    }
    if (price === "over-20000" && service.price <= 20000) return false;

    if (normalizedQuery) {
      const haystack = [
        service.title,
        service.description,
        service.categoryName,
        service.providerName,
        ...service.tags,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) return false;
    }

    return true;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      default:
        return (
          Number(b.featured) - Number(a.featured) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount
        );
    }
  });

  const filterCategories = categories
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      count: services.filter(
        (service) => service.categorySlug === item.slug,
      ).length,
    }))
    .filter((item) => item.count > 0);

  const filterProviders = providers
    .filter((provider) =>
      services.some((service) => service.providerId === provider.id),
    )
    .map((provider) => ({ id: provider.id, name: provider.businessName }));

  const selectedCategory = categories.find((item) => item.slug === category);
  const selectedProvider = providers.find(
    (provider) => provider.id === providerId,
  );
  const selectedPrice = PRICE_RANGES.find((range) => range.value === price);

  const activeFilterCount =
    (normalizedQuery ? 1 : 0) +
    (category ? 1 : 0) +
    (price ? 1 : 0) +
    (providerId ? 1 : 0);

  function clearFilters() {
    setQuery("");
    setCategory("");
    setPrice("");
    setProviderId("");
  }

  const filtersProps = {
    categories: filterCategories,
    totalCount: services.length,
    selectedCategory: category,
    onCategoryChange: setCategory,
    selectedPrice: price,
    onPriceChange: setPrice,
    providers: filterProviders,
    selectedProvider: providerId,
    onProviderChange: setProviderId,
    onClear: clearFilters,
  };

  return (
    <>
      <section className="border-b border-line bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-muted">
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
                <span aria-current="page" className="font-medium text-heading">
                  Services
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Service catalogue
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                Browse local services
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                Compare vetted professionals across Multan, filter by category
                and budget, and book with upfront PKR pricing.
              </p>
            </div>

            <div>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <label htmlFor="services-search" className="sr-only">
                  Search services
                </label>
                <input
                  id="services-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by service, provider or keyword"
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-line bg-card pl-12 pr-12 text-sm text-heading shadow-sm transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-heading"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  Verified providers
                </li>
                <li className="flex items-center gap-1.5">
                  <Banknote
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  Upfront PKR pricing
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  Serving Multan
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm lg:sticky lg:top-24">
              <ServiceFilters {...filtersProps} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  aria-controls="mobile-service-filters"
                  className="lg:hidden"
                >
                  <SlidersHorizontal
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>

                <p className="text-sm text-muted" aria-live="polite">
                  <span className="font-semibold text-heading">
                    {sortedServices.length}
                  </span>{" "}
                  {sortedServices.length === 1 ? "service" : "services"}
                  {normalizedQuery ? (
                    <>
                      {" "}
                      matching{" "}
                      <span className="font-medium text-heading">
                        &ldquo;{query.trim()}&rdquo;
                      </span>
                    </>
                  ) : null}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <label htmlFor="services-sort" className="sr-only">
                    Sort services
                  </label>
                  <select
                    id="services-sort"
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as SortValue)
                    }
                    className="h-10 appearance-none rounded-full border border-line bg-card pl-4 pr-9 text-sm font-medium text-body shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                </div>

                <div
                  role="group"
                  aria-label="View layout"
                  className="flex items-center rounded-full border border-line bg-card p-1 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-pressed={view === "grid"}
                    aria-label="Grid view"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      view === "grid"
                        ? "bg-primary text-white"
                        : "text-muted hover:text-heading",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-pressed={view === "list"}
                    aria-label="List view"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      view === "list"
                        ? "bg-primary text-white"
                        : "text-muted hover:text-heading",
                    )}
                  >
                    <List className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {filtersOpen ? (
              <div
                id="mobile-service-filters"
                className="mt-4 rounded-2xl border border-line bg-card p-5 shadow-sm lg:hidden"
              >
                <ServiceFilters {...filtersProps} />
              </div>
            ) : null}

            {activeFilterCount > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {query.trim() ? (
                  <FilterChip
                    label={`“${query.trim()}”`}
                    onRemove={() => setQuery("")}
                  />
                ) : null}
                {selectedCategory ? (
                  <FilterChip
                    label={selectedCategory.name}
                    onRemove={() => setCategory("")}
                  />
                ) : null}
                {selectedPrice ? (
                  <FilterChip
                    label={selectedPrice.label}
                    onRemove={() => setPrice("")}
                  />
                ) : null}
                {selectedProvider ? (
                  <FilterChip
                    label={selectedProvider.businessName}
                    onRemove={() => setProviderId("")}
                  />
                ) : null}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            <div id="service-results" className="mt-6">
              <ServiceGrid
                services={sortedServices}
                view={view}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
