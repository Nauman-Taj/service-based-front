import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}

/** Compact metric card shared by all three dashboards. */
export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-heading">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
