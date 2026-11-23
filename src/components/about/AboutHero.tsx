import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronRight, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import { aboutStats } from "@/data/about";

const collage = [
  {
    src: "/images/services/deep-home-cleaning.jpg",
    alt: "A home cleaning professional at work",
    sizes: "(min-width: 1024px) 20vw, 40vw",
  },
  {
    src: "/images/services/emergency-plumbing-repair.jpg",
    alt: "A plumber repairing pipework under a sink",
    sizes: "(min-width: 1024px) 20vw, 40vw",
  },
  {
    src: "/images/services/interior-wall-painting.jpg",
    alt: "A painter finishing an interior wall",
    sizes: "(min-width: 1024px) 20vw, 40vw",
  },
  {
    src: "/images/services/lawn-mowing-garden-care.jpg",
    alt: "A gardener maintaining a lawn",
    sizes: "(min-width: 1024px) 20vw, 40vw",
  },
];

export default function AboutHero() {
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
                About
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              About Quicker
            </span>

            <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-heading sm:text-4xl lg:text-5xl">
              Local help, without the{" "}
              <span className="text-primary">guesswork</span>.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Quicker is Multan&apos;s marketplace for trusted home services. We
              connect homeowners with vetted local professionals &mdash; with
              clear pricing, verified reviews and support that actually answers.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/services">Browse services</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Talk to our team
              </ButtonLink>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
              {aboutStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-xl font-bold text-heading sm:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-slate-100">
                  <Image
                    src={collage[0].src}
                    alt={collage[0].alt}
                    fill
                    priority
                    sizes={collage[0].sizes}
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-slate-100">
                  <Image
                    src={collage[1].src}
                    alt={collage[1].alt}
                    fill
                    priority
                    sizes={collage[1].sizes}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-slate-100">
                  <Image
                    src={collage[2].src}
                    alt={collage[2].alt}
                    fill
                    sizes={collage[2].sizes}
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-slate-100">
                  <Image
                    src={collage[3].src}
                    alt={collage[3].alt}
                    fill
                    sizes={collage[3].sizes}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -left-2 bottom-6 flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-lg sm:left-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">
                  Background-checked
                </p>
                <p className="text-xs text-muted">Vetted &amp; insured providers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
