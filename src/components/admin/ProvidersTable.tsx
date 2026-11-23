"use client";

import { BadgeCheck, Eye } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import StarRating from "@/components/common/StarRating";
import type { AdminEntityStatus } from "@/types/dashboard";
import type { Provider } from "@/types/provider";

interface ProvidersTableProps {
  providers: Provider[];
  statuses: Record<string, AdminEntityStatus>;
  serviceCounts: Record<string, number>;
  onView: (provider: Provider) => void;
  onToggleStatus: (provider: Provider) => void;
}

/** Provider directory with verification, performance and status controls. */
export default function ProvidersTable({
  providers,
  statuses,
  serviceCounts,
  onView,
  onToggleStatus,
}: ProvidersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Provider</th>
            <th className="px-5 py-3 font-semibold">Specialty</th>
            <th className="px-5 py-3 font-semibold">Location</th>
            <th className="px-5 py-3 font-semibold">Rating</th>
            <th className="px-5 py-3 font-semibold">Jobs</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => {
            const status = statuses[provider.id] ?? "active";
            return (
              <tr
                key={provider.id}
                className="border-b border-line last:border-0 hover:bg-background"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={provider.name}
                      src={provider.avatar}
                      size="sm"
                    />
                    <div>
                      <p className="flex items-center gap-1.5 font-semibold text-heading">
                        {provider.businessName}
                        {provider.verified ? (
                          <BadgeCheck
                            className="h-4 w-4 text-primary"
                            aria-label="Verified provider"
                          />
                        ) : null}
                      </p>
                      <p className="text-xs text-muted">{provider.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted">{provider.specialty}</td>
                <td className="px-5 py-4 text-muted">{provider.location}</td>
                <td className="px-5 py-4">
                  <StarRating rating={provider.rating} starClassName="h-3.5 w-3.5" />
                  <span className="mt-1 block text-xs text-muted">
                    {provider.rating.toFixed(1)} ({provider.reviewCount})
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-heading">
                    {provider.completedJobs}
                  </p>
                  <p className="text-xs text-muted">
                    {serviceCounts[provider.id] ?? 0} services
                  </p>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1.5">
                    <AdminStatusBadge status={status} />
                    {provider.verified ? (
                      <Badge variant="success" className="block w-fit">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="neutral" className="block w-fit">
                        Unverified
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(provider)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(provider)}
                      className="inline-flex h-9 items-center rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
                    >
                      {status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
