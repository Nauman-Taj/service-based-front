"use client";

import { Pencil, Trash2 } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { Category } from "@/types/category";
import type { AdminEntityStatus } from "@/types/dashboard";

interface CategoriesTableProps {
  categories: Category[];
  statuses: Record<string, AdminEntityStatus>;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

/** Category management table with live service counts and status controls. */
export default function CategoriesTable({
  categories,
  statuses,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Category</th>
            <th className="px-5 py-3 font-semibold">Slug</th>
            <th className="px-5 py-3 font-semibold">Description</th>
            <th className="px-5 py-3 font-semibold">Services</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const status = statuses[category.id] ?? "active";
            const Icon = category.icon;
            return (
              <tr
                key={category.id}
                className="border-b border-line last:border-0 hover:bg-background"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-heading">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted">
                  {category.slug}
                </td>
                <td className="max-w-xs px-5 py-4 text-muted">
                  <span className="line-clamp-2">{category.description}</span>
                </td>
                <td className="px-5 py-4 font-semibold text-heading">
                  {category.serviceCount}
                </td>
                <td className="px-5 py-4">
                  <AdminStatusBadge
                    status={status}
                    label={status === "suspended" ? "Disabled" : undefined}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(category)}
                      className="inline-flex h-9 items-center rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
                    >
                      {status === "suspended" ? "Enable" : "Disable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      aria-label={`Delete ${category.name}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
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
