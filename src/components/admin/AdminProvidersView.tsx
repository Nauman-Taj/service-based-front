"use client";

import { BadgeCheck, Search, UserCog } from "lucide-react";
import { useState } from "react";

import ProvidersTable from "@/components/admin/ProvidersTable";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import StarRating from "@/components/common/StarRating";
import { useAdminProviders } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { Provider } from "@/types/provider";

function describeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not update this provider. Please try again.";
}

/** API-backed provider directory with a detail modal and status controls. */
export default function AdminProvidersView() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const query = useDebounce(search, 250).trim().toLowerCase();
  const {
    providers,
    loading,
    error,
    setProviderStatus,
    setProviderVerification,
    statuses,
    serviceCounts,
  } = useAdminProviders(query);

  const selected = providers.find((provider) => provider.id === selectedId) ?? null;
  const { page, pageItems, totalPages, setPage } = usePagination(
    providers,
    6,
  );

  async function toggleStatus(provider: Provider) {
    const current = statuses[provider.id] ?? "active";
    setActionError(null);
    try {
      await setProviderStatus(
        provider.id,
        current === "suspended" ? "active" : "suspended",
      );
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
  }

  async function toggleVerification(provider: Provider) {
    setActionError(null);
    try {
      await setProviderVerification(provider.id, !provider.verified);
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Service providers"
        description="Review provider details, performance and marketplace access."
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
              placeholder="Search providers or specialties"
              aria-label="Search providers"
              className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="text-sm text-muted">
            {providers.length} {providers.length === 1 ? "provider" : "providers"}
          </p>
        </div>

        {loading ? (
          <div className="p-5">
            <LoadingSpinner className="py-12" label="Loading providers…" />
          </div>
        ) : providers.length > 0 ? (
          <ProvidersTable
            providers={pageItems}
            statuses={statuses}
            serviceCounts={serviceCounts}
            onView={(provider) => setSelectedId(provider.id)}
            onToggleStatus={(provider) => {
              void toggleStatus(provider);
            }}
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
        onClose={() => setSelectedId(null)}
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

            {"email" in selected && selected.email ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Contact email
                </p>
                <p className="mt-1 text-sm text-heading">{selected.email}</p>
              </div>
            ) : null}

            <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void toggleVerification(selected);
                }}
              >
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {selected.verified ? "Unverify provider" : "Verify provider"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
