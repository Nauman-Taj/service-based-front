"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CalendarCheck, Search } from "lucide-react";

import Button from "@/components/common/Button";
import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import Select from "@/components/common/Select";
import BookingFilters, {
  type BookingStatusFilter,
} from "@/components/booking/BookingFilters";
import BookingTable from "@/components/booking/BookingTable";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { Booking } from "@/types/booking";
import type { BookingPerspective } from "@/components/customer/BookingCard";

const PAGE_SIZE = 8;

interface BookingsManagerProps {
  bookings: Booking[];
  perspective: BookingPerspective;
  title: string;
  description: string;
  action?: ReactNode;
  /** Providers see new requests before their historical bookings. */
  sortMode?: "recent" | "pending-first";
  /** Admins can narrow the full list by customer and provider. */
  showPartyFilters?: boolean;
  emptyState?: ReactNode;
}

/** Searchable, filterable and paginated booking list for all three roles. */
export default function BookingsManager({
  bookings,
  perspective,
  title,
  description,
  action,
  sortMode = "recent",
  showPartyFilters = false,
  emptyState,
}: BookingsManagerProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [status, setStatus] = useState<BookingStatusFilter>("all");
  const [customer, setCustomer] = useState("all");
  const [provider, setProvider] = useState("all");

  const counts = useMemo(() => {
    const next = {
      all: bookings.length,
      pending: 0,
      confirmed: 0,
      "in-progress": 0,
      completed: 0,
      cancelled: 0,
    } satisfies Record<BookingStatusFilter, number>;
    for (const booking of bookings) {
      next[booking.status] += 1;
    }
    return next;
  }, [bookings]);

  const customerOptions = useMemo(
    () => Array.from(new Set(bookings.map((booking) => booking.customerName))).sort(),
    [bookings],
  );
  const providerOptions = useMemo(
    () => Array.from(new Set(bookings.map((booking) => booking.providerName))).sort(),
    [bookings],
  );

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const matching = bookings.filter((booking) => {
      if (status !== "all" && booking.status !== status) {
        return false;
      }
      if (showPartyFilters && customer !== "all" && booking.customerName !== customer) {
        return false;
      }
      if (showPartyFilters && provider !== "all" && booking.providerName !== provider) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [
        booking.reference,
        booking.serviceName,
        booking.customerName,
        booking.providerName,
      ].some((field) => field.toLowerCase().includes(query));
    });

    return [...matching].sort((a, b) => {
      if (sortMode === "pending-first") {
        const priorityA = a.status === "pending" ? 0 : 1;
        const priorityB = b.status === "pending" ? 0 : 1;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [bookings, customer, debouncedSearch, provider, showPartyFilters, sortMode, status]);

  const { page, pageItems, totalPages, setPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setCustomer("all");
    setProvider("all");
  }

  const firstItem = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastItem = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-6">
      <DashboardIntro title={title} description={description} action={action} />

      {bookings.length === 0 ? (
        emptyState ?? (
          <EmptyState
            icon={CalendarCheck}
            title="No bookings yet"
            description="When a booking is created it will appear here with its live status."
            action={
              <ButtonLink href="/services" size="sm">
                Browse services
              </ButtonLink>
            }
          />
        )
      ) : (
        <>
          <BookingFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            counts={counts}
          >
            {showPartyFilters ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:contents">
                <div className="w-full lg:w-52">
                  <Select
                    label="Customer"
                    value={customer}
                    onChange={(event) => setCustomer(event.target.value)}
                  >
                    <option value="all">All customers</option>
                    {customerOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="w-full lg:w-52">
                  <Select
                    label="Provider"
                    value={provider}
                    onChange={(event) => setProvider(event.target.value)}
                  >
                    <option value="all">All providers</option>
                    {providerOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ) : null}
          </BookingFilters>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching bookings"
              description="Try a different search term, status or filter combination."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <p className="text-sm text-muted">
                Showing <span className="font-semibold text-heading">{firstItem}</span>
                {" "}to <span className="font-semibold text-heading">{lastItem}</span>
                {" "}of <span className="font-semibold text-heading">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "booking" : "bookings"}
              </p>
              <BookingTable bookings={pageItems} perspective={perspective} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
