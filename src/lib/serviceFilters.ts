import type { Category } from "@/types/category";
import type { Provider } from "@/types/provider";
import type { Service } from "@/types/service";

export const PRICE_RANGES = [
  { value: "under-10000", label: "Under Rs 10,000" },
  { value: "10000-20000", label: "Rs 10,000 – 20,000" },
  { value: "over-20000", label: "Over Rs 20,000" },
] as const;

export type PriceRange = "" | (typeof PRICE_RANGES)[number]["value"];

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
export type ServiceView = "grid" | "list";

export interface ServiceFilterValues {
  query: string;
  category: string;
  price: PriceRange;
  providerId: string;
  sort: SortValue;
  view: ServiceView;
}

type SearchParamValue = string | string[] | undefined;

export interface ServiceFilterCatalog {
  categories: Pick<Category, "slug">[];
  providers: Pick<Provider, "id">[];
  services: Pick<Service, "categorySlug" | "providerId">[];
}

function first(value: SearchParamValue): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isPriceRange(value: string): value is PriceRange {
  return PRICE_RANGES.some((range) => range.value === value);
}

function isSortValue(value: string): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseServiceFilters(
  params: Record<string, SearchParamValue>,
  catalog: ServiceFilterCatalog,
): ServiceFilterValues {
  const query = first(params.q).trim();
  const category = first(params.category);
  const price = first(params.price);
  const providerId = first(params.provider);
  const sort = first(params.sort);
  const view = first(params.view);

  const validCategory =
    catalog.categories.some((item) => item.slug === category) &&
    catalog.services.some((service) => service.categorySlug === category)
      ? category
      : "";

  const validProvider =
    catalog.providers.some((provider) => provider.id === providerId) &&
    catalog.services.some((service) => service.providerId === providerId)
      ? providerId
      : "";

  return {
    query,
    category: validCategory,
    price: isPriceRange(price) ? price : "",
    providerId: validProvider,
    sort: isSortValue(sort) ? sort : "recommended",
    view: view === "list" ? "list" : "grid",
  };
}
