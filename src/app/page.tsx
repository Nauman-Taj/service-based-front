import type { Metadata } from "next";

import CallToAction from "@/components/home/CallToAction";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProviders from "@/components/home/FeaturedProviders";
import FeaturedServices from "@/components/home/FeaturedServices";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import SiteShell from "@/components/layout/SiteShell";
import {
  getCategories,
  getPublishedReviews,
  getProviders,
  getServices,
} from "@/lib/public-api";
import { derivePublicStats } from "@/lib/public-stats";

export const metadata: Metadata = {
  title: { absolute: "Quicker — Trusted Local Services, Booked in Minutes" },
  description:
    "Compare vetted local professionals for cleaning, plumbing, electrical, painting, gardening and more. Read verified reviews, see upfront prices and book online in minutes.",
};

export default async function HomePage() {
  const [categories, services, providers, reviews] = await Promise.all([
    getCategories(),
    getServices(),
    getProviders(),
    getPublishedReviews(),
  ]);
  const stats = derivePublicStats({ providers, reviews, services });

  return (
    <SiteShell>
      <HeroSection stats={stats} />
      <CategoriesSection categories={categories} />
      <FeaturedServices
        services={services.filter((service) => service.featured)}
      />
      <HowItWorks />
      <FeaturedProviders providers={providers} />
      <WhyChooseUs />
      <Testimonials reviews={reviews} services={services} stats={stats} />
      <CallToAction />
      <Newsletter />
    </SiteShell>
  );
}
