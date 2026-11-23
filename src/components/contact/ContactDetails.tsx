import { ChevronDown, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { SITE } from "@/lib/constants";

const faqs = [
  {
    question: "How quickly will I hear back?",
    answer:
      "We reply to messages within one business day. For urgent booking changes, call us during support hours and we'll help straight away.",
  },
  {
    question: "I need to change or cancel a booking.",
    answer:
      "Include your booking reference in the message or call our team. We'll confirm what can be changed and any applicable charges before anything is updated.",
  },
  {
    question: "How do I join as a provider?",
    answer:
      "Choose \"Become a service provider\" above and tell us your trade and the areas you cover in Multan. We'll send you the vetting steps and next requirements.",
  },
  {
    question: "Does it cost anything to contact support?",
    answer:
      "No. Advice about a booking, a service or a provider enquiry is free for both customers and providers.",
  },
];

export default function ContactDetails() {
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-heading">Reach us directly</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Prefer not to use the form? Our team is easy to find.
        </p>

        <ul className="mt-5 space-y-4">
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Email
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-0.5 block break-all text-sm font-semibold text-heading transition-colors hover:text-primary"
              >
                {SITE.email}
              </a>
              <p className="mt-0.5 text-xs text-muted">
                Best for non-urgent enquiries
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Phone
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-0.5 block text-sm font-semibold text-heading transition-colors hover:text-primary"
              >
                {SITE.phone}
              </a>
              <p className="mt-0.5 text-xs text-muted">{SITE.hours}</p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Visit us
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-relaxed text-heading">
                {SITE.addressLine1}
                <br />
                {SITE.addressLine2}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Before you get in touch
        </p>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
          <li>Have your booking reference ready for faster help.</li>
          <li>Tell us the service and area if you need a recommendation.</li>
          <li>For safety issues, call us rather than sending a message.</li>
        </ul>
        <p className="mt-4 flex items-center gap-2 border-t border-primary/15 pt-4 text-xs text-muted">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          We never share your contact details with providers unless you ask us
          to.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-heading">
          Frequently asked questions
        </h2>
        <div className="mt-3 divide-y divide-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-semibold text-heading">
                {faq.question}
                <ChevronDown
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 pr-6 text-sm leading-relaxed text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </aside>
  );
}
