import {
  CalendarCheck,
  Search,
  Star,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import SectionHeading from "@/components/common/SectionHeading";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Search,
    title: "Search & compare",
    description:
      "Tell us what you need and compare vetted pros by price, rating and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Book your slot",
    description:
      "Choose a time that suits you and confirm the details in a few taps.",
  },
  {
    icon: Wrench,
    title: "Get the job done",
    description:
      "Your professional arrives on schedule and completes the work to a high standard.",
  },
  {
    icon: Star,
    title: "Pay & review",
    description:
      "Pay securely through the platform and share a review to help your neighbours.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-line bg-card py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From search to sorted in four steps"
          description="A simple, transparent process designed around busy schedules."
          align="center"
        />

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative flex h-full flex-col rounded-2xl border border-line bg-background p-6"
              >
                <span className="absolute right-5 top-5 text-sm font-bold text-muted/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-heading">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
