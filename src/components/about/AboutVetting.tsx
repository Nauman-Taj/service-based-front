import { Check, MessageCircleQuestion, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import SectionHeading from "@/components/common/SectionHeading";
import { providerExpectations, vettingSteps } from "@/data/about";

export default function AboutVetting() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Our standards"
            title="How every provider earns a place on Quicker"
            description="Approval is not a rubber stamp. We check credentials, insurance and track record before a provider can accept their first booking."
          />

          <ol className="mt-8 space-y-4">
            {vettingSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-heading">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="space-y-5 lg:pt-2">
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              What you can expect
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              {providerExpectations.map((expectation) => (
                <li key={expectation} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{expectation}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/services" className="mt-6 w-full">
              Browse services
            </ButtonLink>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-heading">
              <MessageCircleQuestion
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              Need a hand choosing?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Tell us what you need and our team will point you to the right
              professional for the job.
            </p>
            <ButtonLink href="/contact" variant="outline" className="mt-4 w-full">
              Contact us
            </ButtonLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
