"use client";

import { cn } from "@/lib/utils";

export interface EarningsBar {
  label: string;
  value: number;
}

function compactValue(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return String(value);
}

interface EarningsChartProps {
  data: EarningsBar[];
  className?: string;
}

/** Lightweight CSS bar chart — no charting dependency required. */
export default function EarningsChart({ data, className }: EarningsChartProps) {
  if (data.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-background px-4 py-8 text-center text-sm text-muted">
        No completed earnings to chart yet.
      </p>
    );
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="img"
        aria-label="Monthly earnings bar chart in Pakistani rupees"
        className="relative flex h-64 items-end gap-2 border-b border-line px-2 sm:gap-4"
      >
        {[0.25, 0.5, 0.75].map((fraction) => (
          <div
            key={fraction}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line"
            style={{ bottom: `${fraction * 100}%` }}
          />
        ))}
        {data.map((item) => (
          <div
            key={item.label}
            className="relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-xs font-semibold text-heading">
              {compactValue(item.value)}
            </span>
            <div
              className="w-full max-w-14 rounded-t-lg bg-primary transition-colors hover:bg-primary-hover"
              style={{ height: `${Math.max(6, (item.value / max) * 88)}%` }}
              title={`${item.label}: PKR ${item.value.toLocaleString("en-PK")}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 px-2 pt-3 sm:gap-4">
        {data.map((item) => (
          <p
            key={item.label}
            className="flex-1 text-center text-xs font-medium text-muted"
          >
            {item.label}
          </p>
        ))}
      </div>
    </div>
  );
}
