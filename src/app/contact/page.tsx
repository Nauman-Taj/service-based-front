import type { Metadata } from "next";

import ContactDetails from "@/components/contact/ContactDetails";
import ContactHero from "@/components/contact/ContactHero";
import SectionHeading from "@/components/common/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";
import SiteShell from "@/components/layout/SiteShell";
import { getContactTopics } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Quicker team in Multan for booking help, service questions, feedback or provider enquiries.",
};

export default async function ContactPage() {
  const topics = await getContactTopics();

  return (
    <SiteShell>
      <ContactHero />

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Send a message"
              title="Tell us what you need"
              description="Fill in the form and we'll point you in the right direction — whether you need a service recommendation, booking help or answers about working with Quicker."
            />
            <div className="mt-8">
              <ContactForm topics={topics} />
            </div>
          </div>

          <ContactDetails />
        </div>
      </section>
    </SiteShell>
  );
}
