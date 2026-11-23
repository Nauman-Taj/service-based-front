"use client";

import { Search, Wrench } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminServiceOverrides } from "@/components/admin/admin-service-overrides";
import ServicesTable from "@/components/admin/ServicesTable";
import Button, { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import Select from "@/components/common/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminStatuses } from "@/hooks/usePortalData";
import { usePagination } from "@/hooks/usePagination";
import type { AdminEntityStatus } from "@/types/dashboard";
import type { Service } from "@/types/service";

type StatusFilter = "all" | AdminEntityStatus;

/** Searchable and filterable admin service catalogue. */
export default function AdminServicesView() {
  const { services } = useAdminServiceOverrides();
  const { statuses, setStatus } = useAdminStatuses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const query = useDebounce(search, 250).trim().toLowerCase();

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          services.map((service) => [
            service.categorySlug,
            service.categoryName,
          ]),
        ).entries(),
      ).sort((a, b) => a[1].localeCompare(b[1])),
    [services],
  );

  const filtered = useMemo(
    () =>
      services.filter((service) => {
        const status = statuses[service.id] ?? "active";
        const matchesQuery =
          [service.title, service.providerName, service.categoryName].some(
            (value) => value.toLowerCase().includes(query),
          );
        const matchesCategory =
          category === "all" || service.categorySlug === category;
        const matchesStatus =
          statusFilter === "all" || status === statusFilter;
        return matchesQuery && matchesCategory && matchesStatus;
      }),
    [services, query, category, statusFilter, statuses],
  );

  const { page, pageItems, totalPages, setPage } = usePagination(filtered, 8);

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setStatusFilter("all");
  }

  function toggleStatus(service: Service) {
    const current = statuses[service.id] ?? "active";
    setStatus(service.id, current === "suspended" ? "active" : "suspended");
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Services"
        description="Manage the marketplace catalogue, pricing and featured placements."
        action={
          <ButtonLink href="/admin/categories" variant="outline" size="sm">
            Manage categories
          </ButtonLink>
        }
      />

      <section className="rounded-2xl border border-line bg-card shadow-sm">
        <div className="grid gap-3 border-b border-line p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services or providers"
              aria-label="Search services"
              className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11"
          >
            <option value="all">All categories</option>
            {categories.map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-11"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Paused</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="text-sm text-muted">
            Showing {filtered.length} of {services.length} services
          </p>
          {(search || category !== "all" || statusFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {filtered.length > 0 ? (
          <ServicesTable
            services={pageItems}
            statuses={statuses}
            onToggleStatus={toggleStatus}
          />
        ) : (
          <div className="p-5">
            <EmptyState
              icon={Wrench}
              title="No services found"
              description="No services match the current search and filters."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Reset filters
                </Button>
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
