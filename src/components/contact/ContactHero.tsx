import { ChevronRight, Clock, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

import { SITE } from "@/lib/constants";

export default function ContactHero() {
  return (
    <section className="border-b border-line bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-muted">
            <li>
              <Link
                href="/"
                className="rounded transition-colors hover:text-heading"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <span aria-current="page" className="font-medium text-heading">
                Contact
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
              Contact Quicker
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-heading sm:text-4xl lg:text-5xl">
              We&apos;re here to help,{" "}
              <span className="text-primary">without the runaround.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Questions about a booking, a service, or joining Quicker as a
              provider? Send us a message and our local Multan team will get
              back to you.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-background p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-heading">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Typical response
            </p>
            <p className="mt-2 text-xl font-bold text-heading">
              Within one business day
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Phone support available {SITE.hours}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
