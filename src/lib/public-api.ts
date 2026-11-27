import { cacheLife } from "next/cache";

import { ApiError, apiRequest } from "@/lib/api";
import { resolveCategoryIcon } from "@/lib/categoryIcons";
import type { Category } from "@/types/category";
import type { Provider } from "@/types/provider";
import type { Review } from "@/types/review";
import type { Service } from "@/types/service";

/**
 * Public catalogue data access.
 *
 * Every public page reads catalogue data through this module. Each function
 * maps directly to a NestJS endpoint, so pages and components never depend on
 * the transport. The returned frontend types are unchanged from the mock era.
 *
 * The raw API reads revalidate every minute so a change made by an
 * admin/provider appears on the public site without a rebuild.
 * Mapping to frontend types happens outside the cache because Category holds
 * a Lucide component, which is not serializable.
 */

interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
}

interface ApiContactTopics {
  topics: string[];
}

function toCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: resolveCategoryIcon(category.icon),
    serviceCount: category.serviceCount,
  };
}

function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

async function fetchCategories(): Promise<ApiCategory[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<ApiCategory[]>("/categories");
}

async function fetchCategory(slug: string): Promise<ApiCategory> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<ApiCategory>(`/categories/${encodeURIComponent(slug)}`);
}

async function fetchServices(): Promise<Service[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Service[]>("/services");
}

async function fetchService(id: string): Promise<Service> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Service>(`/services/${encodeURIComponent(id)}`);
}

async function fetchServicesByCategory(categorySlug: string): Promise<Service[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Service[]>(
    `/services?category=${encodeURIComponent(categorySlug)}`,
  );
}

async function fetchFeaturedServices(): Promise<Service[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Service[]>("/services?featured=true");
}

async function fetchProviders(): Promise<Provider[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Provider[]>("/providers");
}

async function fetchProvider(id: string): Promise<Provider> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Provider>(`/providers/${encodeURIComponent(id)}`);
}

async function fetchReviewsByService(serviceId: string): Promise<Review[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Review[]>(
    `/reviews?serviceId=${encodeURIComponent(serviceId)}`,
  );
}

async function fetchPublishedReviews(): Promise<Review[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<Review[]>("/reviews");
}

async function fetchContactTopics(): Promise<ApiContactTopics> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  return apiRequest<ApiContactTopics>("/contacts/topics");
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchCategories();
  return categories.map(toCategory);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  try {
    const category = await fetchCategory(slug);
    return toCategory(category);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function getServices(): Promise<Service[]> {
  return fetchServices();
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  try {
    return await fetchService(id);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function getServicesByCategory(
  categorySlug: string,
): Promise<Service[]> {
  return fetchServicesByCategory(categorySlug);
}

export async function getFeaturedServices(): Promise<Service[]> {
  return fetchFeaturedServices();
}

export async function getProviders(): Promise<Provider[]> {
  return fetchProviders();
}

export async function getProviderById(id: string): Promise<Provider | undefined> {
  try {
    return await fetchProvider(id);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function getReviewsByService(serviceId: string): Promise<Review[]> {
  return fetchReviewsByService(serviceId);
}

/** All published reviews for active providers, used by public home sections. */
export async function getPublishedReviews(): Promise<Review[]> {
  return fetchPublishedReviews();
}

/** Topic options for the public contact form, served by the API. */
export async function getContactTopics(): Promise<string[]> {
  const response = await fetchContactTopics();
  return response.topics;
}
