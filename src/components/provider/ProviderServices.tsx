"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  PauseCircle,
  Pencil,
  PlayCircle,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ButtonLink } from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import Select from "@/components/common/Select";
import { useManagedProviderServices } from "@/components/provider/provider-service-data";
import { services as mockServices } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";
import type { ProviderServiceRecord } from "@/types/dashboard";
import { formatCurrency } from "@/utils/formatCurrency";
import { priceUnitLabels } from "@/utils/priceUnit";
import { labelClasses } from "../common/Input";

type StatusFilter = "all" | "active" | "paused";

export default function ProviderServices() {
  const { user } = useAuth();
  const { services, saveService, deleteService } = useManagedProviderServices(
    user?.providerId,
  );
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] =
    useState<ProviderServiceRecord | null>(null);

  const mockRatings = useMemo(
    () => new Map(mockServices.map((service) => [service.id, service])),
    [],
  );

  const filtered = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    return services.filter((service) => {
      if (statusFilter !== "all" && service.status !== statusFilter) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [service.title, service.categoryName, ...service.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [services, debouncedQuery, statusFilter]);

  const { pageItems, page, totalPages, setPage } = usePagination(filtered, 6);

  function toggleStatus(service: ProviderServiceRecord) {
    saveService({
      ...service,
      status: service.status === "active" ? "paused" : "active",
    });
  }

  return (
    <div className="space-y-8">
      <DashboardIntro
        title="My services"
        description="Add, edit and manage the services customers can book from your listing."
        action={
          <ButtonLink href="/provider/services/add" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add service
          </ButtonLink>
        }
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="provider-service-search" className={labelClasses}>
            Search your services
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 translate-y-1 text-muted"
            aria-hidden="true"
          />
          <input
            id="provider-service-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, category or tag"
            className="h-11 w-full rounded-xl border border-line bg-background pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="sm:w-52">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </Select>
        </div>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No services yet"
          description="Create your first service to appear in search results and start taking bookings."
          action={
            <ButtonLink href="/provider/services/add">
              Add your first service
            </ButtonLink>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching services"
          description="Try a different search term or switch the status filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((service) => {
              const mock = mockRatings.get(service.id);
              const isActive = service.status === "active";
              return (
                <article
                  key={service.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 22rem, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <Badge
                        variant={isActive ? "success" : "neutral"}
                        className="bg-card/95"
                      >
                        {isActive ? "Active" : "Paused"}
                      </Badge>
                      {service.featured ? (
                        <Badge variant="gold" className="bg-card/95">
                          <Star className="h-3 w-3" aria-hidden="true" />
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {service.categoryName}
                    </p>
                    <h3 className="mt-1.5 text-base font-bold leading-snug text-heading">
                      {service.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                      <p className="text-lg font-bold text-heading">
                        {formatCurrency(service.price)}
                        <span className="ml-1 text-xs font-medium text-muted">
                          {priceUnitLabels[service.priceUnit]}
                        </span>
                      </p>
                      {mock ? (
                        <p className="flex items-center gap-1 text-xs text-muted">
                          <Star
                            className="h-3.5 w-3.5 fill-highlight text-highlight"
                            aria-hidden="true"
                          />
                          {mock.rating.toFixed(1)} ({mock.reviewCount})
                        </p>
                      ) : (
                        <p className="text-xs text-muted">No reviews yet</p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                      <ButtonLink
                        href={`/provider/services/${service.id}`}
                        variant="outline"
                        size="sm"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(service)}
                      >
                        {isActive ? (
                          <PauseCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {isActive ? "Pause" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPendingDelete(service)}
                        className={cn("text-red-600 hover:text-red-700")}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            className="mt-8"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete service"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.title} from your provider portal? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete service"
        destructive
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteService(pendingDelete.id);
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
