import type { Provider } from "@/types/provider";
import type { Review } from "@/types/review";
import type { Service } from "@/types/service";

/**
 * Public trust numbers derived from live catalogue data. Marketing copy must
 * never hardcode counts that the API can provide.
 */
export interface PublicStats {
  averageRating: number | null;
  vettedProviders: number;
  publishedReviews: number;
  listedServices: number;
}

interface PublicStatsInput {
  providers: Provider[];
  reviews: Review[];
  services: Service[];
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function derivePublicStats({
  providers,
  reviews,
  services,
}: PublicStatsInput): PublicStats {
  const rating =
    average(reviews.map((review) => review.rating)) ??
    average(services.map((service) => service.rating));

  return {
    averageRating: rating === null ? null : Math.round(rating * 10) / 10,
    vettedProviders: providers.filter((provider) => provider.verified).length,
    publishedReviews: reviews.length,
    listedServices: services.length,
  };
}
