"use client";

import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import UsersTable from "@/components/admin/UsersTable";
import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { customers } from "@/data/customers";
import { useBookings } from "@/hooks/useBookings";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminStatuses } from "@/hooks/usePortalData";
import { usePagination } from "@/hooks/usePagination";
import type { User } from "@/types/user";

/** Searchable customer directory with live booking counts and status control. */
export default function AdminCustomersView() {
  const { bookings } = useBookings();
  const { statuses, setStatus } = useAdminStatuses();
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 250).trim().toLowerCase();

  const bookingCounts = useMemo(() => {
    return bookings.reduce<Record<string, number>>((counts, booking) => {
      counts[booking.customerId] = (counts[booking.customerId] ?? 0) + 1;
      return counts;
    }, {});
  }, [bookings]);

  const filtered = useMemo(
    () =>
      customers.filter((customer) =>
        [customer.name, customer.email, customer.phone ?? ""].some((value) =>
          value.toLowerCase().includes(query),
        ),
      ),
    [query],
  );

  const { page, pageItems, totalPages, setPage } = usePagination(filtered, 8);

  function toggleStatus(customer: User) {
    const current = statuses[customer.id] ?? "active";
    setStatus(customer.id, current === "suspended" ? "active" : "suspended");
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Customers"
        description="Browse registered customers, their booking history and account status."
        action={
          <ButtonLink href="/admin/bookings" variant="outline" size="sm">
            View all bookings
          </ButtonLink>
        }
      />

      <section className="rounded-2xl border border-line bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
          <div className="relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone"
              aria-label="Search customers"
              className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "customer" : "customers"}
          </p>
        </div>

        {filtered.length > 0 ? (
          <UsersTable
            customers={pageItems}
            bookingCounts={bookingCounts}
            statuses={statuses}
            onToggleStatus={toggleStatus}
          />
        ) : (
          <div className="p-5">
            <EmptyState
              icon={Users}
              title="No customers found"
              description="Try a different name, email address or phone number."
              action={
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Clear search
                </button>
              }
            />
          </div>
        )}
      </section>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        className="pt-1"
      />
    </div>
  );
}
