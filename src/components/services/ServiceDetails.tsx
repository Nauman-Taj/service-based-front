import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Check,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import { ButtonLink } from "@/components/common/Button";
import StarRating from "@/components/common/StarRating";
import BookingForm from "@/components/services/BookingForm";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceReviews from "@/components/services/ServiceReviews";
import type { Provider } from "@/types/provider";
import type { Review } from "@/types/review";
import type { Service } from "@/types/service";
import { formatCurrency } from "@/utils/formatCurrency";
import { priceUnitLabels } from "@/utils/priceUnit";

interface ServiceDetailsProps {
  service: Service;
  provider?: Provider;
  reviews: Review[];
  relatedServices: Service[];
}

function Breadcrumb({ service }: { service: Service }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
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
          <Link
            href="/services"
            className="rounded transition-colors hover:text-heading"
          >
            Services
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <Link
            href={`/services/category/${service.categorySlug}`}
            className="rounded transition-colors hover:text-heading"
          >
            {service.categoryName}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <span aria-current="page" className="font-medium text-heading">
            {service.title}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function Overview({ service }: { service: Service }) {
  return (
    <section aria-labelledby="overview">
      <h2
        id="overview"
        className="text-xl font-bold tracking-tight text-heading sm:text-2xl"
      >
        Overview
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
        {service.description}
      </p>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
        What&apos;s included
      </h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {service.includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-xl border border-line bg-card p-3.5 text-sm text-body"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProviderPanel({ provider }: { provider: Provider }) {
  return (
    <section
      aria-labelledby="provider"
      className="rounded-2xl border border-line bg-card p-6 sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar name={provider.name} src={provider.avatar} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Your provider
          </p>
          <h2
            id="provider"
            className="mt-1 flex items-center gap-1.5 text-xl font-bold text-heading"
          >
            <span className="truncate">{provider.businessName}</span>
            {provider.verified ? (
              <BadgeCheck
                className="h-5 w-5 shrink-0 text-primary"
                aria-label="Verified provider"
              />
            ) : null}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {provider.specialty} &middot; {provider.location}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-body">
            {provider.bio}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Star
                className="h-4 w-4 fill-primary text-primary"
                aria-hidden="true"
              />
              <span className="font-semibold text-heading">
                {provider.rating.toFixed(1)}
              </span>
              <span className="text-muted">
                ({provider.reviewCount} reviews)
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              {provider.completedJobs} jobs completed
            </span>
          </div>

          <Link
            href={`/services?provider=${provider.id}`}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            View all services from {provider.name}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ServiceDetails({
  service,
  provider,
  reviews,
  relatedServices,
}: ServiceDetailsProps) {
  return (
    <>
      <section className="border-b border-line bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Breadcrumb service={service} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/services/category/${service.categorySlug}`}
                  className="text-xs font-semibold uppercase tracking-wide text-primary"
                >
                  {service.categoryName}
                </Link>
                {service.featured ? (
                  <Badge variant="gold">Featured</Badge>
                ) : null}
                {provider?.verified ? (
                  <Badge variant="primary">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified provider
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <StarRating rating={service.rating} />
                  <span className="font-semibold text-heading">
                    {service.rating.toFixed(1)}
                  </span>
                  <span>({service.reviewCount} reviews)</span>
                </span>
                <span aria-hidden="true">&middot;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Multan
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                {service.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-background px-3 py-1 text-xs font-medium text-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="#request-booking">
                  Request this service
                </ButtonLink>
                <ButtonLink href="/services" variant="outline">
                  Browse all services
                </ButtonLink>
              </div>
            </div>

            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-slate-100 shadow-sm">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-background px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    Starting from
                  </p>
                  <p className="mt-1 text-xl font-bold text-heading">
                    {formatCurrency(service.price)}
                    <span className="ml-1 text-xs font-medium text-muted">
                      {priceUnitLabels[service.priceUnit]}
                    </span>
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Banknote className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-12">
            <Overview service={service} />

            {provider ? <ProviderPanel provider={provider} /> : null}

            <ServiceReviews service={service} reviews={reviews} />

            {relatedServices.length > 0 ? (
              <section aria-labelledby="similar-services">
                <h2
                  id="similar-services"
                  className="text-xl font-bold tracking-tight text-heading sm:text-2xl"
                >
                  Similar services
                </h2>
                <p className="mt-1 text-sm text-muted">
                  More {service.categoryName.toLowerCase()} options in Multan.
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {relatedServices.slice(0, 3).map((item) => (
                    <ServiceCard key={item.id} service={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div id="request-booking" className="scroll-mt-24 space-y-5">
              <BookingForm service={service} />

              <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-semibold text-heading">
                  <ShieldCheck
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  Book with confidence
                </p>
                <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted">
                  <li>Background-checked, insured professionals</li>
                  <li>Upfront PKR pricing — no hidden charges</li>
                  <li>Free rescheduling up to 24 hours before</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
