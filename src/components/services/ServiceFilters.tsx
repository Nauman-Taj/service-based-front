"use client";

import { useId, type ReactNode } from "react";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRICE_RANGES, type PriceRange } from "@/lib/serviceFilters";

interface FilterCategory {
  slug: string;
  name: string;
  count: number;
}

interface FilterProvider {
  id: string;
  name: string;
}

interface ServiceFiltersProps {
  categories: FilterCategory[];
  totalCount: number;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPrice: PriceRange;
  onPriceChange: (price: PriceRange) => void;
  providers: FilterProvider[];
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  onClear: () => void;
}

interface FilterGroupProps {
  legend: string;
  children: ReactNode;
}

function FilterGroup({ legend, children }: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
        {legend}
      </legend>
      <div className="mt-2 space-y-0.5">{children}</div>
    </fieldset>
  );
}

interface FilterOptionProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function FilterOption({ label, count, active, onClick }: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors",
        active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-body hover:bg-slate-100 hover:text-heading",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          active ? "border-primary bg-primary" : "border-slate-300 bg-card",
        )}
      >
        {active ? (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        ) : null}
      </span>
      <span className="flex-1">{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-xs",
            active ? "text-primary/80" : "text-muted",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export default function ServiceFilters({
  categories,
  totalCount,
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  providers,
  selectedProvider,
  onProviderChange,
  onClear,
}: ServiceFiltersProps) {
  const providerSelectId = useId();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-heading">
          <SlidersHorizontal
            className="h-4 w-4 text-primary"
            aria-hidden="true"
          />
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Clear all
        </button>
      </div>

      <FilterGroup legend="Category">
        <FilterOption
          label="All categories"
          count={totalCount}
          active={selectedCategory === ""}
          onClick={() => onCategoryChange("")}
        />
        {categories.map((category) => (
          <FilterOption
            key={category.slug}
            label={category.name}
            count={category.count}
            active={selectedCategory === category.slug}
            onClick={() => onCategoryChange(category.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Price range">
        <FilterOption
          label="Any price"
          active={selectedPrice === ""}
          onClick={() => onPriceChange("")}
        />
        {PRICE_RANGES.map((range) => (
          <FilterOption
            key={range.value}
            label={range.label}
            active={selectedPrice === range.value}
            onClick={() => onPriceChange(range.value)}
          />
        ))}
      </FilterGroup>

      <div>
        <label
          htmlFor={providerSelectId}
          className="text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Provider
        </label>
        <select
          id={providerSelectId}
          value={selectedProvider}
          onChange={(event) => onProviderChange(event.target.value)}
          className="mt-2.5 h-10 w-full rounded-xl border border-line bg-card px-3 text-sm text-heading transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All providers</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Verified providers only
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Every professional on Quicker is background-checked and reviewed by
          real customers.
        </p>
      </div>
    </div>
  );
}
