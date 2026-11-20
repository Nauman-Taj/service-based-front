import { SearchX } from "lucide-react";

import Button, { ButtonLink } from "@/components/common/Button";
import ServiceCard from "@/components/services/ServiceCard";
import type { Service } from "@/types/service";

interface ServiceGridProps {
  services: Service[];
  view?: "grid" | "list";
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ServiceGrid({
  services,
  view = "grid",
  onClearFilters,
  emptyTitle = "No services match your filters",
  emptyDescription = "Try a different search term, widen the price range, or clear the filters to see every available service.",
}: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-heading">
          {emptyTitle}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {emptyDescription}
        </p>
        {onClearFilters ? (
          <Button onClick={onClearFilters} className="mt-6">
            Clear all filters
          </Button>
        ) : (
          <ButtonLink href="/services" className="mt-6">
            Browse all services
          </ButtonLink>
        )}
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
