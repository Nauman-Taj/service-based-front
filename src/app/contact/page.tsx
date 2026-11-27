import type { Metadata } from "next";
import { Suspense } from "react";

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

export default function ContactPage() {
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
              <Suspense fallback={<ContactFormSkeleton />}>
                <ContactFormWithTopics />
              </Suspense>
            </div>
          </div>

          <ContactDetails />
        </div>
      </section>
    </SiteShell>
  );
}

/** Streams the API-backed form so the rest of the page stays instantly navigable. */
async function ContactFormWithTopics() {
  const topics = await getContactTopics();
  return <ContactForm topics={topics} />;
}

function ContactFormSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-8"
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1].map((field) => (
            <div key={field} className="space-y-2">
              <div className="h-3 w-20 rounded bg-line/70" />
              <div className="h-11 w-full rounded-xl bg-line/40" />
            </div>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1].map((field) => (
            <div key={field} className="space-y-2">
              <div className="h-3 w-24 rounded bg-line/70" />
              <div className="h-11 w-full rounded-xl bg-line/40" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-line/70" />
          <div className="h-32 w-full rounded-xl bg-line/40" />
        </div>
        <div className="h-11 w-full rounded-xl bg-line/70" />
      </div>
    </div>
  );
}
