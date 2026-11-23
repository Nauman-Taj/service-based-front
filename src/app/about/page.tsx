import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutVetting from "@/components/about/AboutVetting";
import CallToAction from "@/components/home/CallToAction";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Quicker connects homeowners in Multan with vetted local service professionals, how we check every provider and the standards behind every booking.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutVetting />
      <CallToAction />
    </SiteShell>
  );
}
