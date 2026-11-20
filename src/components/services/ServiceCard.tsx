import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { priceUnitLabels } from "@/utils/priceUnit";

interface ServiceCardProps {
  service: Service;
  variant?: "grid" | "list";
}

function ServiceRating({ service }: { service: Service }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Star
        className="h-4 w-4 fill-primary text-primary"
        aria-hidden="true"
      />
      <span className="font-semibold text-heading">
        {service.rating.toFixed(1)}
      </span>
      <span className="text-muted">({service.reviewCount} reviews)</span>
    </div>
  );
}

function ServicePrice({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <p className={cn("text-lg font-bold text-heading", className)}>
      {formatCurrency(service.price)}
      <span className="ml-1 text-xs font-medium text-muted">
        {priceUnitLabels[service.priceUnit]}
      </span>
    </p>
  );
}

export default function ServiceCard({
  service,
  variant = "grid",
}: ServiceCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={`/services/${service.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md sm:flex-row"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:w-56 lg:w-64">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 16rem, (min-width: 640px) 14rem, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                {service.categoryName}
              </span>
              {service.featured ? (
                <span className="rounded-full bg-highlight px-2 py-0.5 text-[11px] font-bold text-heading">
                  Featured
                </span>
              ) : null}
            </div>

            <h3 className="mt-1.5 text-lg font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
              {service.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{service.providerName}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {service.description}
            </p>

            <div className="mt-3">
              <ServiceRating service={service} />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-line pt-4 sm:w-44 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <ServicePrice service={service} />
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              View details
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-heading shadow-sm">
          {service.categoryName}
        </span>
        {service.featured ? (
          <span className="absolute right-3 top-3 rounded-full bg-highlight px-2.5 py-1 text-xs font-bold text-heading shadow-sm">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
          {service.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{service.providerName}</p>

        <div className="mt-3">
          <ServiceRating service={service} />
        </div>

        <div className="mt-auto border-t border-line pt-4">
          <ServicePrice service={service} />
        </div>
      </div>
    </Link>
  );
}
