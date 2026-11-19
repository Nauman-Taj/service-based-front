import {
  Hammer,
  Leaf,
  Paintbrush,
  Sparkles,
  Truck,
  WashingMachine,
  Wrench,
  Zap,
} from "lucide-react";

import type { Category } from "@/types/category";

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "home-cleaning",
    name: "Home Cleaning",
    description: "Deep cleans, regular upkeep and move-out sparkle.",
    icon: Sparkles,
    serviceCount: 1240,
  },
  {
    id: "cat-2",
    slug: "plumbing",
    name: "Plumbing",
    description: "Leaks, installs and emergency repairs done right.",
    icon: Wrench,
    serviceCount: 860,
  },
  {
    id: "cat-3",
    slug: "electrical",
    name: "Electrical",
    description: "Certified electricians for wiring, lighting and safety.",
    icon: Zap,
    serviceCount: 720,
  },
  {
    id: "cat-4",
    slug: "painting",
    name: "Painting",
    description: "Interior and exterior painting with a flawless finish.",
    icon: Paintbrush,
    serviceCount: 540,
  },
  {
    id: "cat-5",
    slug: "gardening",
    name: "Gardening & Landscaping",
    description: "Lawn care, pruning and outdoor transformations.",
    icon: Leaf,
    serviceCount: 430,
  },
  {
    id: "cat-6",
    slug: "carpentry",
    name: "Carpentry",
    description: "Custom furniture, shelving and repairs by skilled hands.",
    icon: Hammer,
    serviceCount: 380,
  },
  {
    id: "cat-7",
    slug: "moving",
    name: "Moving Services",
    description: "Careful packing, loading and door-to-door delivery.",
    icon: Truck,
    serviceCount: 310,
  },
  {
    id: "cat-8",
    slug: "appliance-repair",
    name: "Appliance Repair",
    description: "Fast fixes for fridges, washers, ovens and more.",
    icon: WashingMachine,
    serviceCount: 260,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
