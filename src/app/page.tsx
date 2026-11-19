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

export const metadata: Metadata = {
  title: { absolute: "Quicker — Trusted Local Services, Booked in Minutes" },
  description:
    "Compare vetted local professionals for cleaning, plumbing, electrical, painting, gardening and more. Read verified reviews, see upfront prices and book online in minutes.",
};

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <CategoriesSection />
      <FeaturedServices />
      <HowItWorks />
      <FeaturedProviders />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
      <Newsletter />
    </SiteShell>
  );
}
