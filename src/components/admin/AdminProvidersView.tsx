"use client";

import { BadgeCheck, Search, UserCog } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminServiceOverrides } from "@/components/admin/admin-service-overrides";
import ProvidersTable from "@/components/admin/ProvidersTable";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import StarRating from "@/components/common/StarRating";
import { providers } from "@/data/providers";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminStatuses } from "@/hooks/usePortalData";
import { usePagination } from "@/hooks/usePagination";
import type { Provider } from "@/types/provider";

/** Provider directory with a working detail modal and status controls. */
export default function AdminProvidersView() {
  const { statuses, setStatus } = useAdminStatuses();
  const { services } = useAdminServiceOverrides();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Provider | null>(null);
  const query = useDebounce(search, 250).trim().toLowerCase();

  const serviceCounts = useMemo(
    () =>
      services.reduce<Record<string, number>>((counts, service) => {
        counts[service.providerId] = (counts[service.providerId] ?? 0) + 1;
        return counts;
      }, {}),
    [services],
  );

  const filtered = useMemo(
    () =>
      providers.filter((provider) =>
        [provider.name, provider.businessName, provider.specialty, provider.location].some(
          (value) => value.toLowerCase().includes(query),
        ),
      ),
    [query],
  );

  const { page, pageItems, totalPages, setPage } = usePagination(filtered, 6);

  function toggleStatus(provider: Provider) {
    const current = statuses[provider.id] ?? "active";
    setStatus(provider.id, current === "suspended" ? "active" : "suspended");
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Service providers"
        description="Review provider details, performance and marketplace access."
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
              placeholder="Search providers or specialties"
              aria-label="Search providers"
              className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "provider" : "providers"}
          </p>
        </div>

        {filtered.length > 0 ? (
          <ProvidersTable
            providers={pageItems}
            statuses={statuses}
            serviceCounts={serviceCounts}
            onView={setSelected}
            onToggleStatus={toggleStatus}
          />
        ) : (
          <div className="p-5">
            <EmptyState
              icon={UserCog}
              title="No providers found"
              description="Try a different name, business, specialty or location."
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

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.businessName ?? "Provider details"}
        description={selected ? `${selected.name} · ${selected.specialty}` : undefined}
        className="max-w-xl"
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Avatar
                name={selected.name}
                src={selected.avatar}
                size="lg"
              />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-bold text-heading">
                  {selected.name}
                  {selected.verified ? (
                    <Badge variant="success">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="neutral">Unverified</Badge>
                  )}
                </p>
                <p className="mt-1 text-sm text-muted">{selected.location}</p>
                <StarRating rating={selected.rating} className="mt-2" />
                <p className="mt-1 text-xs text-muted">
                  {selected.rating.toFixed(1)} from {selected.reviewCount} reviews
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-background p-3">
                <p className="text-xs text-muted">Completed jobs</p>
                <p className="mt-1 font-bold text-heading">
                  {selected.completedJobs}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-background p-3">
                <p className="text-xs text-muted">Active services</p>
                <p className="mt-1 font-bold text-heading">
                  {serviceCounts[selected.id] ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-background p-3">
                <p className="text-xs text-muted">Specialty</p>
                <p className="mt-1 text-sm font-semibold text-heading">
                  {selected.specialty}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                About this provider
              </p>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {selected.bio}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
