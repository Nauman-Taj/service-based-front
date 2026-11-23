"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { buttonStyles } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import type { AdminEntityStatus } from "@/types/dashboard";
import type { Service } from "@/types/service";
import { formatCurrency } from "@/utils/formatCurrency";
import { priceUnitLabels } from "@/utils/priceUnit";

interface ServicesTableProps {
  services: Service[];
  statuses: Record<string, AdminEntityStatus>;
  onToggleStatus: (service: Service) => void;
}

/** Admin service catalogue with edit links and pause/activate controls. */
export default function ServicesTable({
  services,
  statuses,
  onToggleStatus,
}: ServicesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Service</th>
            <th className="px-5 py-3 font-semibold">Provider</th>
            <th className="px-5 py-3 font-semibold">Category</th>
            <th className="px-5 py-3 font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">Rating</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => {
            const status = statuses[service.id] ?? "active";
            return (
              <tr
                key={service.id}
                className="border-b border-line last:border-0 hover:bg-background"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={service.image}
                      alt=""
                      width={64}
                      height={48}
                      className="h-12 w-16 shrink-0 rounded-lg border border-line object-cover"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="font-semibold text-heading transition-colors hover:text-primary"
                      >
                        {service.title}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                        {service.description}
                      </p>
                      {service.featured ? (
                        <span className="mt-1 inline-block text-xs font-semibold text-[#8a6203]">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted">{service.providerName}</td>
                <td className="px-5 py-4 text-muted">{service.categoryName}</td>
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-semibold text-heading">
                    {formatCurrency(service.price)}
                  </p>
                  <p className="text-xs text-muted">
                    {priceUnitLabels[service.priceUnit]}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-heading">
                    <Star
                      className="h-3.5 w-3.5 fill-highlight text-highlight"
                      aria-hidden="true"
                    />
                    {service.rating.toFixed(1)}
                  </span>
                  <p className="text-xs text-muted">
                    {service.reviewCount} reviews
                  </p>
                </td>
                <td className="px-5 py-4">
                  <AdminStatusBadge
                    status={status}
                    label={status === "suspended" ? "Paused" : undefined}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className={buttonStyles("outline", "sm")}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(service)}
                      className={cn(buttonStyles("ghost", "sm"))}
                    >
                      {status === "suspended" ? "Activate" : "Pause"}
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
