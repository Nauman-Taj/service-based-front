import { cn } from "@/lib/utils";
import type { AdminEntityStatus } from "@/types/dashboard";

const statusClasses: Record<AdminEntityStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  pending: "bg-highlight/20 text-[#8a6203]",
  suspended: "bg-slate-100 text-muted",
};

const defaultLabels: Record<AdminEntityStatus, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
};

interface AdminStatusBadgeProps {
  status: AdminEntityStatus;
  label?: string;
  className?: string;
}

/** Shared status pill for customers, providers, services and categories. */
export default function AdminStatusBadge({
  status,
  label,
  className,
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        statusClasses[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active"
            ? "bg-emerald-600"
            : status === "pending"
              ? "bg-highlight"
              : "bg-slate-400",
        )}
      />
      {label ?? defaultLabels[status]}
    </span>
  );
}
