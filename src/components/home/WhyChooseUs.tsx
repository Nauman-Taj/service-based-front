import {
  Clock,
  CreditCard,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import SectionHeading from "@/components/common/SectionHeading";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Vetted, insured professionals",
    description:
      "Every provider passes identity, insurance and background checks before joining.",
  },
  {
    icon: Clock,
    title: "On-time guarantee",
    description:
      "Booking windows you can rely on, with live updates if anything changes.",
  },
  {
    icon: CreditCard,
    title: "Secure, upfront pricing",
    description:
      "See the full price before you book. Payment is held safely until the job is done.",
  },
  {
    icon: Headphones,
    title: "Human support, 7 days",
    description:
      "Real people available to help with bookings, changes and everything in between.",
  },
];

const stats = [
  { value: "2,400+", label: "Bookings completed" },
  { value: "1,800+", label: "Vetted providers" },
  { value: "4.9/5", label: "Average rating" },
  { value: "98%", label: "Would book again" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Why choose Quicker"
            title="A marketplace built around trust"
            description="We take the guesswork out of hiring help, so you can book with confidence and get on with your day."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-heading">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-heading p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">
            By the numbers
          </p>
          <h3 className="mt-2 text-2xl font-bold">
            Results you can measure
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
            Consistent quality, verified reviews and a platform that stands
            behind every booking.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-primary pl-4">
                <dt className="text-xs uppercase tracking-wide text-slate-300">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-3xl font-bold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
