import type { ReactNode } from "react";

import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import type { BookingStatus } from "@/types/booking";
import { cn } from "@/lib/utils";
import { bookingStatusMeta } from "@/utils/statusHelpers";

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
];

export type BookingStatusFilter = BookingStatus | "all";

interface BookingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: BookingStatusFilter;
  onStatusChange: (value: BookingStatusFilter) => void;
  counts: Record<BookingStatusFilter, number>;
  /** Optional role-specific filters, e.g. the admin customer/provider selects. */
  children?: ReactNode;
}

const tabs: BookingStatusFilter[] = ["all", ...BOOKING_STATUS_OPTIONS];

/** Shared search, status tabs and optional extra filters for booking lists. */
export default function BookingFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
  children,
}: BookingFiltersProps) {
  return (
    <section className="rounded-2xl border border-line bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <Input
            label="Search bookings"
            type="search"
            placeholder="Reference, service, customer or provider"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            label="Status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as BookingStatusFilter)
            }
          >
            <option value="all">All statuses</option>
            {BOOKING_STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {bookingStatusMeta(value).label}
              </option>
            ))}
          </Select>
        </div>
        {children}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        {tabs.map((value) => {
          const active = status === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusChange(value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-card text-muted hover:border-primary hover:text-primary",
              )}
            >
              {value === "all" ? "All bookings" : bookingStatusMeta(value).label}
              <span className={active ? "text-white/80" : "text-muted"}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
