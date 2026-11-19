import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Service } from "@/types/service";
import { formatCurrency } from "@/utils/formatCurrency";

const priceUnitLabels: Record<Service["priceUnit"], string> = {
  hour: "/ hour",
  fixed: "fixed price",
  room: "/ room",
  project: "/ project",
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
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

        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <Star
            className="h-4 w-4 fill-primary text-primary"
            aria-hidden="true"
          />
          <span className="font-semibold text-heading">
            {service.rating.toFixed(1)}
          </span>
          <span className="text-muted">({service.reviewCount} reviews)</span>
        </div>

        <div className="mt-auto border-t border-line pt-4">
          <p className="text-lg font-bold text-heading">
            {formatCurrency(service.price)}
            <span className="ml-1 text-xs font-medium text-muted">
              {priceUnitLabels[service.priceUnit]}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
