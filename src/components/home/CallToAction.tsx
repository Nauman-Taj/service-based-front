import { Briefcase, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";

export default function CallToAction() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="rounded-3xl bg-primary p-8 text-white sm:p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            Need a hand around the house?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            Browse hundreds of services, compare trusted professionals and book
            the help you need today.
          </p>
          <ButtonLink href="/services" variant="white" className="mt-6">
            Browse services
          </ButtonLink>
        </div>

        <div className="rounded-3xl bg-heading p-8 text-white sm:p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            Turn your skills into income
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            Join a growing network of vetted providers. Set your own schedule,
            keep more of what you earn and grow your business.
          </p>
          <ButtonLink href="/register" className="mt-6">
            Become a provider
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
