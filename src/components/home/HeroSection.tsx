"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, ShieldCheck, Star } from "lucide-react";

import SearchBar from "@/components/common/SearchBar";

const popularSearches = [
  { label: "Home cleaning", href: "/services?q=cleaning" },
  { label: "Plumbing", href: "/services?q=plumbing" },
  { label: "Electrical", href: "/services?q=electrical" },
  { label: "Painting", href: "/services?q=painting" },
];

const heroImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80";

export default function HeroSection() {
  const router = useRouter();

  function handleSearch(query: string) {
    router.push(query ? `/services?q=${encodeURIComponent(query)}` : "/services");
  }

  return (
    <section>
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Trusted by 2,000+ homeowners
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-heading sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            Trusted local services, booked in{" "}
            <span className="text-primary">minutes</span>.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Compare vetted professionals, read verified reviews and book the
            right expert for your home &mdash; with fair, upfront pricing.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar onSubmit={handleSearch} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="font-medium text-body">Popular:</span>
            {popularSearches.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-body transition-colors hover:border-primary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Average rating
              </dt>
              <dd className="mt-1 flex items-center gap-1 text-lg font-bold text-heading">
                <Star
                  className="h-4 w-4 fill-primary text-primary"
                  aria-hidden="true"
                />
                4.9/5
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Vetted providers
              </dt>
              <dd className="mt-1 text-lg font-bold text-heading">1,800+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Bookings completed
              </dt>
              <dd className="mt-1 text-lg font-bold text-heading">2,400+</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-card shadow-xl sm:aspect-square lg:aspect-[4/5]">
            <Image
              src={heroImage}
              alt="A bright, freshly serviced living room"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-lg sm:left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-heading">
                Verified professionals
              </p>
              <p className="text-xs text-muted">Background-checked &amp; insured</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
