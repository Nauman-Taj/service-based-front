"use client";

import { Search, Users } from "lucide-react";
import { useState } from "react";

import UsersTable from "@/components/admin/UsersTable";
import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import { useAdminCustomers } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { User } from "@/types/user";

function describeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not update this customer. Please try again.";
}

/** API-backed customer directory with live booking counts and status control. */
export default function AdminCustomersView() {
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const query = useDebounce(search, 250).trim().toLowerCase();
  const {
    customers,
    loading,
    error,
    setCustomerStatus,
    bookingCounts,
    statuses,
  } = useAdminCustomers(query);

  const { page, pageItems, totalPages, setPage } = usePagination(
    customers,
    8,
  );

  async function toggleStatus(customer: User) {
    const current = statuses[customer.id] ?? "active";
    setActionError(null);
    try {
      await setCustomerStatus(
        customer.id,
        current === "suspended" ? "active" : "suspended",
      );
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
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

      {error || actionError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError ?? error}
        </p>
      ) : null}

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
            {customers.length} {customers.length === 1 ? "customer" : "customers"}
          </p>
        </div>

        {loading ? (
          <div className="p-5">
            <LoadingSpinner
              className="py-12"
              label="Loading customers…"
            />
          </div>
        ) : customers.length > 0 ? (
          <UsersTable
            customers={pageItems}
            bookingCounts={bookingCounts}
            statuses={statuses}
            onToggleStatus={(customer) => {
              void toggleStatus(customer);
            }}
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
