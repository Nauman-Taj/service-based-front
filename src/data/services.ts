import type { Service } from "@/types/service";

const image = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=80`;

export const services: Service[] = [
  {
    id: "svc-1",
    title: "Deep Home Cleaning",
    description:
      "A top-to-bottom clean covering kitchens, bathrooms, bedrooms and living spaces, including skirting boards and inside cabinets.",
    categorySlug: "home-cleaning",
    categoryName: "Home Cleaning",
    providerId: "prov-1",
    providerName: "Ayesha Home Cleaning",
    price: 16800,
    priceUnit: "fixed",
    rating: 4.9,
    reviewCount: 214,
    image: image("photo-1581578731548-c64695cc6952"),
    featured: true,
    tags: ["Eco-friendly", "Same-week availability"],
  },
  {
    id: "svc-2",
    title: "Emergency Plumbing Repair",
    description:
      "Fast response for burst pipes, blocked drains and leaky fixtures, with transparent hourly pricing and no call-out fee.",
    categorySlug: "plumbing",
    categoryName: "Plumbing",
    providerId: "prov-2",
    providerName: "Bilal Plumbing Services",
    price: 11900,
    priceUnit: "hour",
    rating: 4.8,
    reviewCount: 186,
    image: image("photo-1607472586893-edb57bdc0e39"),
    featured: true,
    tags: ["24/7 call-outs", "Licensed"],
  },
  {
    id: "svc-3",
    title: "Home Electrical Inspection",
    description:
      "A full safety check of your wiring, outlets and breaker panel, with a written report and fixed-price repairs for any issues found.",
    categorySlug: "electrical",
    categoryName: "Electrical",
    providerId: "prov-3",
    providerName: "Usman Electric Works",
    price: 13300,
    priceUnit: "fixed",
    rating: 5.0,
    reviewCount: 98,
    image: image("photo-1621905251918-48416bd8575a"),
    featured: true,
    tags: ["Certified", "Report included"],
  },
  {
    id: "svc-4",
    title: "Interior Wall Painting",
    description:
      "Preparation, priming and two coats of premium paint for a smooth, durable finish. Furniture covered and rooms left spotless.",
    categorySlug: "painting",
    categoryName: "Painting",
    providerId: "prov-6",
    providerName: "Zain Painting Services",
    price: 44800,
    priceUnit: "room",
    rating: 4.9,
    reviewCount: 121,
    image: image("photo-1562259949-e8e7689d7828"),
    featured: true,
    tags: ["Premium paint", "Tidy finish"],
  },
  {
    id: "svc-5",
    title: "Lawn Mowing & Garden Care",
    description:
      "Regular mowing, edging, weeding and seasonal pruning to keep your outdoor space healthy and welcoming all year.",
    categorySlug: "gardening",
    categoryName: "Gardening & Landscaping",
    providerId: "prov-5",
    providerName: "Fatima Garden Care",
    price: 8400,
    priceUnit: "fixed",
    rating: 4.8,
    reviewCount: 132,
    image: image("photo-1416879595882-3373a0480b5b"),
    featured: true,
    tags: ["Weekly plans", "Green waste removal"],
  },
  {
    id: "svc-6",
    title: "Custom Shelving Installation",
    description:
      "Designed, built and installed shelving that fits your space exactly — from floating shelves to full wall units.",
    categorySlug: "carpentry",
    categoryName: "Carpentry",
    providerId: "prov-4",
    providerName: "Hamza Carpentry Works",
    price: 10500,
    priceUnit: "hour",
    rating: 4.9,
    reviewCount: 156,
    image: image("photo-1504148455328-c376907d081c"),
    featured: true,
    tags: ["Made to measure", "5-year workmanship"],
  },
];

export const featuredServices = services.filter((service) => service.featured);

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
