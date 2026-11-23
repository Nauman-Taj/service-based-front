"use client";

import Image from "next/image";
import { ExternalLink, Heart, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import Button, { ButtonLink } from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import StarRating from "@/components/common/StarRating";
import { getServiceById, services } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/usePortalData";
import { formatCurrency } from "@/utils/formatCurrency";
import { priceUnitLabels } from "@/utils/priceUnit";

/** Saved services grid with a searchable picker for adding more. */
export default function FavoritesGrid() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites(user?.id);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);

  const savedServices = favorites
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((favorite) => getServiceById(favorite.serviceId))
    .filter((service) => service !== undefined);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const pickerResults = services.filter((service) => {
    if (!normalizedQuery) {
      return true;
    }
    return `${service.title} ${service.categoryName} ${service.providerName}`
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-heading">
              Saved services
            </h3>
            <p className="mt-1 text-sm text-muted">
              {savedServices.length === 1
                ? "1 service saved for later."
                : `${savedServices.length} services saved for later.`}
            </p>
          </div>
        </div>

        {savedServices.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {savedServices.map((service) => (
              <article
                key={service.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1536px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-heading shadow-sm">
                    {service.categoryName}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h4 className="text-sm font-bold leading-snug text-heading">
                    {service.title}
                  </h4>
                  <p className="mt-1 truncate text-xs text-muted">
                    {service.providerName}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StarRating rating={service.rating} />
                    <span className="text-xs text-muted">
                      {service.rating.toFixed(1)} ({service.reviewCount})
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-bold text-heading">
                    {formatCurrency(service.price)}
                    <span className="ml-1 text-xs font-medium text-muted">
                      {priceUnitLabels[service.priceUnit]}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    <ButtonLink
                      href={`/services/${service.id}`}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      View service
                    </ButtonLink>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(service.id)}
                      aria-label={`Remove ${service.title} from favorites`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={Heart}
              title="No saved services yet"
              description="Save services you are interested in, then find them here when you are ready to book."
              action={
                <ButtonLink href="/services" size="sm">
                  Browse services
                </ButtonLink>
              }
            />
          </div>
        )}
      </section>

      <aside className="h-fit rounded-2xl border border-line bg-card p-5 shadow-sm xl:sticky xl:top-24">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-heading">Add a service</h3>
            <p className="text-xs text-muted">
              {services.length - savedServices.length} available to save
            </p>
          </div>
        </div>

        <label htmlFor="favorite-search" className="sr-only">
          Search services to save
        </label>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-line px-3">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="favorite-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            className="h-10 w-full min-w-0 bg-transparent text-sm text-heading placeholder:text-muted focus:outline-none"
          />
        </div>

        {pickerResults.length > 0 ? (
          <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
            {pickerResults.map((service) => {
              const saved = isFavorite(service.id);
              return (
                <li
                  key={service.id}
                  className="flex items-center gap-3 rounded-xl border border-line p-2.5"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-heading">
                      {service.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={saved ? "outline" : "primary"}
                    onClick={() => toggleFavorite(service.id)}
                    aria-label={
                      saved
                        ? `Remove ${service.title} from favorites`
                        : `Save ${service.title} to favorites`
                    }
                    className="px-3"
                  >
                    {saved ? (
                      <>
                        <Heart
                          className="h-3.5 w-3.5 fill-primary"
                          aria-hidden="true"
                        />
                        Saved
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Add
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            No services match that search.
          </p>
        )}
      </aside>
    </div>
  );
}
