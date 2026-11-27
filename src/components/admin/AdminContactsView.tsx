"use client";

import { Archive, Check, Mail, RotateCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminContacts } from "@/hooks/usePortalData";
import Badge from "@/components/common/Badge";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import { labelClasses } from "@/components/common/Input";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import Select from "@/components/common/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { formatDateTime } from "@/utils/formatDate";
import type { ContactMessage, ContactStatus } from "@/types/contact";

type StatusFilter = "all" | ContactStatus;

const statusLabels: Record<ContactStatus, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

const statusVariants: Record<ContactStatus, "gold" | "primary" | "neutral"> = {
  new: "gold",
  read: "primary",
  archived: "neutral",
};

function describeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not update this message. Please try again.";
}

/** Admin-only inbox for enquiries submitted through the public contact form. */
export default function AdminContactsView() {
  const { contacts, loading, error, refresh, setStatus } = useAdminContacts();
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);
  const query = useDebounce(search, 250).trim().toLowerCase();

  const filtered = useMemo(
    () =>
      contacts.filter((message) => {
        const matchesQuery = [
          message.name,
          message.email,
          message.phone ?? "",
          message.topic,
          message.message,
          message.reference,
        ].some((value) => value.toLowerCase().includes(query));
        const matchesStatus = status === "all" || message.status === status;
        return matchesQuery && matchesStatus;
      }),
    [contacts, query, status],
  );

  const { page, pageItems, totalPages, setPage } = usePagination(filtered, 8);

  const counts = useMemo(
    () => ({
      new: contacts.filter((message) => message.status === "new").length,
      read: contacts.filter((message) => message.status === "read").length,
      archived: contacts.filter((message) => message.status === "archived")
        .length,
    }),
    [contacts],
  );

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  async function handleStatus(message: ContactMessage, next: ContactStatus) {
    try {
      await setStatus(message.id, next);
      setActionError(null);
    } catch (error) {
      setActionError(describeError(error));
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refresh();
      setActionError(null);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Contact inbox"
        description="Read and organise enquiries submitted from the public contact page."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{counts.new} new</Badge>
            <Badge variant="primary">{counts.read} read</Badge>
            <Badge variant="neutral">{counts.archived} archived</Badge>
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
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
        <div className="grid gap-3 border-b border-line p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_10rem]">
          <div>
            <label htmlFor="admin-contact-search" className={labelClasses}>
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="admin-contact-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages, people or references"
                aria-label="Search contact messages"
                className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <Select
            label="Status"
            value={status}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="h-11"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="text-sm text-muted">
            Showing {filtered.length} of {contacts.length} messages
          </p>
          {search || status !== "all" ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading contact messages…" />
        ) : filtered.length > 0 ? (
          <div className="table-scroll">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-semibold">From</th>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Message</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((message) => (
                  <tr
                    key={message.id}
                    className="border-b border-line align-top last:border-0 hover:bg-background"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-heading">
                        {message.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">{message.email}</p>
                      {message.phone ? (
                        <p className="mt-0.5 text-xs text-muted">
                          {message.phone}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-xs font-medium text-primary">
                        {message.topic}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted">
                      {message.reference}
                    </td>
                    <td className="max-w-sm px-5 py-4">
                      <p className="line-clamp-3 leading-relaxed text-body">
                        {message.message}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted">
                      {formatDateTime(message.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariants[message.status]}>
                        {statusLabels[message.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void handleStatus(message, "read")}
                          disabled={message.status === "read"}
                          aria-label={`Mark ${message.name}'s message as read`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Mark read
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleStatus(message, "archived")}
                          disabled={message.status === "archived"}
                          aria-label={`Archive ${message.name}'s message`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={Mail}
              title="No messages found"
              description="No contact messages match the current search and filters."
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
    </div>
  );
}
