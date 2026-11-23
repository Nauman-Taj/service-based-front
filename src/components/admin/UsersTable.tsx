"use client";

import { CalendarDays } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Avatar from "@/components/common/Avatar";
import { ButtonLink } from "@/components/common/Button";
import type { AdminEntityStatus } from "@/types/dashboard";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/formatDate";

interface UsersTableProps {
  customers: User[];
  bookingCounts: Record<string, number>;
  statuses: Record<string, AdminEntityStatus>;
  onToggleStatus: (customer: User) => void;
}

/** Read-only customer directory with working status controls. */
export default function UsersTable({
  customers,
  bookingCounts,
  statuses,
  onToggleStatus,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Contact</th>
            <th className="px-5 py-3 font-semibold">Joined</th>
            <th className="px-5 py-3 font-semibold">Bookings</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const status = statuses[customer.id] ?? "active";
            const suspended = status === "suspended";
            return (
              <tr
                key={customer.id}
                className="border-b border-line last:border-0 hover:bg-background"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} src={customer.avatar} size="sm" />
                    <div>
                      <p className="font-semibold text-heading">{customer.name}</p>
                      <p className="text-xs text-muted">{customer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-heading">{customer.email}</p>
                  <p className="text-xs text-muted">
                    {customer.phone ?? "No phone on file"}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted">
                  {formatDate(customer.createdAt.slice(0, 10))}
                </td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-heading">
                    {bookingCounts[customer.id] ?? 0}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <AdminStatusBadge status={status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <ButtonLink
                      href="/admin/bookings"
                      variant="outline"
                      size="sm"
                    >
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      Bookings
                    </ButtonLink>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(customer)}
                      className="inline-flex h-9 items-center rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
                    >
                      {suspended ? "Activate" : "Suspend"}
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
