"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Search,
  ShieldCheck,
} from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import StarRating from "@/components/common/StarRating";
import { bookings as mockBookings } from "@/data/bookings";
import { useBookings } from "@/hooks/useBookings";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/service";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { priceUnitLabels } from "@/utils/priceUnit";
import { bookingStatusMeta } from "@/utils/statusHelpers";

const steps = [
  {
    icon: Search,
    title: "Choose your service",
    description: "Compare trusted local professionals, prices and reviews.",
  },
  {
    icon: CalendarDays,
    title: "Pick a time and place",
    description: "Share your preferred slot and the service address.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm and relax",
    description: "The provider accepts, then you track every step here.",
  },
];

interface BookingLandingProps {
  services: Service[];
}

/** Public booking hub: explain the flow, pick a service and track requests. */
export default function BookingLanding({ services }: BookingLandingProps) {
  const { bookings } = useBookings();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [referenceInput, setReferenceInput] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [referenceQuery, setReferenceQuery] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The local booking store is only readable after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          services.map((service) =>
            [service.categorySlug, service.categoryName] as const,
          ),
        ),
      ),
    [services],
  );

  const visibleServices = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return services.filter((service) => {
      if (category !== "all" && service.categorySlug !== category) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [
        service.title,
        service.categoryName,
        service.providerName,
        ...service.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [category, debouncedSearch, services]);

  const matchedBooking = useMemo(() => {
    if (!referenceQuery) {
      return null;
    }
    const query = referenceQuery.toUpperCase();
    return bookings.find((booking) => booking.reference.toUpperCase() === query) ?? null;
  }, [bookings, referenceQuery]);

  const localBookings = useMemo(() => {
    const demoIds = new Set(mockBookings.map((booking) => booking.id));
    return bookings.filter((booking) => !demoIds.has(booking.id)).slice(0, 3);
  }, [bookings]);

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = referenceInput.trim();
    if (!value) {
      setReferenceError("Enter a booking reference to search.");
      setReferenceQuery(null);
      return;
    }
    setReferenceError("");
    setReferenceQuery(value);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Simple, transparent booking
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-heading sm:text-5xl">
          Book trusted local help in minutes
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Pick a service, tell us when and where you need it, and follow your
          request from the first enquiry to the final job. No payment is taken
          on this site.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="#services" size="lg">
            Choose a service
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="#track" size="lg" variant="outline">
            Track a booking
          </ButtonLink>
        </div>
      </section>

      <section aria-label="How booking works" className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="rounded-2xl border border-line bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-line">0{index + 1}</span>
              </div>
              <h2 className="mt-4 text-base font-bold text-heading">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          );
        })}
      </section>

      <section id="services" className="mt-16 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-heading">
              Choose a service to book
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Select a service to open its details form and send your request.
            </p>
          </div>
          <p className="text-sm text-muted">{visibleServices.length} services</p>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm sm:p-5">
          <div className="max-w-md">
            <Input
              label="Search services"
              type="search"
              placeholder="Service, category or provider"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                category === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-card text-muted hover:border-primary hover:text-primary",
              )}
            >
              All services
            </button>
            {categories.map(([slug, name]) => (
              <button
                key={slug}
                type="button"
                aria-pressed={category === slug}
                onClick={() => setCategory(slug)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  category === slug
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-card text-muted hover:border-primary hover:text-primary",
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {visibleServices.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service) => (
              <article
                key={service.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm"
              >
                <Image
                  src={service.image}
                  alt=""
                  width={420}
                  height={240}
                  className="h-44 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {service.categoryName}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-heading">
                    {service.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StarRating rating={service.rating} starClassName="h-3.5 w-3.5" />
                    <span className="text-xs text-muted">
                      {service.rating.toFixed(1)} ({service.reviewCount})
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
                    <div>
                      <p className="text-lg font-bold text-heading">
                        {formatCurrency(service.price)}
                      </p>
                      <p className="text-xs text-muted">
                        {priceUnitLabels[service.priceUnit]}
                      </p>
                    </div>
                    <ButtonLink href={`/services/${service.id}`} size="sm">
                      Book now
                    </ButtonLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={Search}
              title="No services found"
              description="Try a different search term or choose another category."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Reset filters
                </button>
              }
            />
          </div>
        )}
      </section>

      <section id="track" className="mt-16 scroll-mt-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-heading">
            Track a booking
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Enter the reference from your confirmation page to see the latest
            status and full details of a request made in this browser.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
            <form onSubmit={handleLookup} noValidate>
              <Input
                label="Booking reference"
                placeholder="e.g. QK-8F2K1A"
                value={referenceInput}
                onChange={(event) => {
                  setReferenceInput(event.target.value);
                  setReferenceError("");
                }}
                error={referenceError}
              />
              <button
                type="submit"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Find booking
              </button>
            </form>

            {referenceQuery ? (
              matchedBooking ? (
                <div className="mt-5 rounded-xl border border-primary/30 bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-heading">
                      {matchedBooking.serviceName}
                    </p>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        bookingStatusMeta(matchedBooking.status).className,
                      )}
                    >
                      {bookingStatusMeta(matchedBooking.status).label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {matchedBooking.reference} &middot;{" "}
                    {formatDate(matchedBooking.date)}
                  </p>
                  <ButtonLink
                    href={`/booking/${matchedBooking.id}`}
                    size="sm"
                    variant="outline"
                    className="mt-4"
                  >
                    View full details
                  </ButtonLink>
                </div>
              ) : (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border border-line bg-background p-4 text-sm leading-relaxed text-muted"
                >
                  We could not find a booking with reference{" "}
                  <span className="font-semibold text-heading">{referenceQuery}</span>
                  . Check the reference and try again.
                </p>
              )
            ) : null}
          </div>

          <div>
            <h3 className="text-base font-bold text-heading">
              Recent requests on this browser
            </h3>
            <div className="mt-4 space-y-3">
              {!mounted ? (
                <p className="rounded-xl border border-dashed border-line bg-card px-4 py-6 text-sm text-muted">
                  Checking this browser for recent requests...
                </p>
              ) : localBookings.length ? (
                localBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-heading">
                        {booking.serviceName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {booking.reference} &middot; {formatDate(booking.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          bookingStatusMeta(booking.status).className,
                        )}
                      >
                        {bookingStatusMeta(booking.status).label}
                      </span>
                      <ButtonLink
                        href={`/booking/${booking.id}`}
                        size="sm"
                        variant="outline"
                      >
                        View
                      </ButtonLink>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={ClipboardList}
                  title="No requests on this browser"
                  description="Requests you make from this browser will appear here. Start by choosing a service above."
                  action={
                    <ButtonLink href="/services" size="sm">
                      Browse services
                    </ButtonLink>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
