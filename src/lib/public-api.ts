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
 */

interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
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

export async function getCategories(): Promise<Category[]> {
  const categories = await apiRequest<ApiCategory[]>("/categories");
  return categories.map(toCategory);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  try {
    const category = await apiRequest<ApiCategory>(
      `/categories/${encodeURIComponent(slug)}`,
    );
    return toCategory(category);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function getServices(): Promise<Service[]> {
  return apiRequest<Service[]>("/services");
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  try {
    return await apiRequest<Service>(`/services/${encodeURIComponent(id)}`);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function getServicesByCategory(
  categorySlug: string,
): Promise<Service[]> {
  return apiRequest<Service[]>(
    `/services?category=${encodeURIComponent(categorySlug)}`,
  );
}

export async function getFeaturedServices(): Promise<Service[]> {
  return apiRequest<Service[]>("/services?featured=true");
}

export async function getProviders(): Promise<Provider[]> {
  return apiRequest<Provider[]>("/providers");
}

export async function getProviderById(id: string): Promise<Provider | undefined> {
  try {
    return await apiRequest<Provider>(`/providers/${encodeURIComponent(id)}`);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function getReviewsByService(serviceId: string): Promise<Review[]> {
  return apiRequest<Review[]>(
    `/reviews?serviceId=${encodeURIComponent(serviceId)}`,
  );
}
