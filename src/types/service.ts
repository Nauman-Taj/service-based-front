export type PriceUnit = "hour" | "fixed" | "room" | "project";

export interface Service {
  id: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  providerId: string;
  providerName: string;
  price: number;
  priceUnit: PriceUnit;
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
  tags: string[];
}
