"use client";

import { Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminReviewModeration } from "@/components/admin/admin-review-moderation";
import ReviewsTable, {
  type AdminReviewRow,
} from "@/components/admin/ReviewsTable";
import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import { labelClasses } from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import Select from "@/components/common/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { ReviewStatus } from "@/types/dashboard";

type StatusFilter = "all" | ReviewStatus;

/** Review moderation queue combining mock and locally submitted reviews. */
export default function AdminReviewsView() {
  const { rows, setStatus, deleteRow } = useAdminReviewModeration();
  const [search, setSearch] = useState("");
  const [service, setService] = useState("all");
  const [rating, setRating] = useState("all");
  const [status, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<AdminReviewRow | null>(
    null,
  );
  const query = useDebounce(search, 250).trim().toLowerCase();

  const serviceOptions = useMemo(
    () =>
      Array.from(
        new Map(rows.map((row) => [row.serviceId, row.serviceName])).entries(),
      ).sort((a, b) => a[1].localeCompare(b[1])),
    [rows],
  );

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const matchesQuery =
          [row.author, row.title, row.body, row.serviceName].some((value) =>
            value.toLowerCase().includes(query),
          );
        const matchesService = service === "all" || row.serviceId === service;
        const matchesRating =
          rating === "all" || Math.round(row.rating) === Number(rating);
        const matchesStatus = status === "all" || row.status === status;
        return matchesQuery && matchesService && matchesRating && matchesStatus;
      }),
    [rows, query, service, rating, status],
  );

  const { page, pageItems, totalPages, setPage } = usePagination(filtered, 8);

  const counts = useMemo(
    () => ({
      published: rows.filter((row) => row.status === "published").length,
      pending: rows.filter((row) => row.status === "pending").length,
      rejected: rows.filter((row) => row.status === "rejected").length,
    }),
    [rows],
  );

  function clearFilters() {
    setSearch("");
    setService("all");
    setRating("all");
    setStatusFilter("all");
  }

  function handleDelete() {
    if (pendingDelete) {
      deleteRow(pendingDelete);
      setPendingDelete(null);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Review moderation"
        description="Approve, reject or remove reviews across the marketplace."
        action={
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">{counts.published} published</Badge>
            <Badge variant="gold">{counts.pending} pending</Badge>
            <Badge variant="neutral">{counts.rejected} rejected</Badge>
          </div>
        }
      />

      <section className="rounded-2xl border border-line bg-card shadow-sm">
        <div className="grid gap-3 border-b border-line p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_12rem_8rem_10rem]">
          <div>
            <label htmlFor="admin-review-search" className={labelClasses}>
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="admin-review-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reviews or authors"
                aria-label="Search reviews"
                className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <Select
            label="Service"
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="h-11"
          >
            <option value="all">All services</option>
            {serviceOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
          <Select
            label="Rating"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="h-11"
          >
            <option value="all">All</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} stars
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={status}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-11"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="text-sm text-muted">
            Showing {filtered.length} of {rows.length} reviews
          </p>
          {(search || service !== "all" || rating !== "all" || status !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <ReviewsTable
            reviews={pageItems}
            onApprove={(row) => setStatus(row, "published")}
            onReject={(row) => setStatus(row, "rejected")}
            onDelete={setPendingDelete}
          />
        ) : (
          <div className="p-5">
            <EmptyState
              icon={Star}
              title="No reviews found"
              description="No reviews match the current search and filters."
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Reset filters
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this review?"
        description="The review will be removed from this browser's moderation queue."
        confirmLabel="Delete review"
        destructive
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
