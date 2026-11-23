"use client";

export interface ChartDatum {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: ChartDatum[];
  formatValue?: (value: number) => string;
  emptyMessage?: string;
}

/** Dependency-free CSS bar chart used by the admin reports page. */
export default function AnalyticsChart({
  title,
  description,
  data,
  formatValue = (value) => value.toLocaleString("en-PK"),
  emptyMessage = "No data available for this period.",
}: AnalyticsChartProps) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-bold text-heading">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}

      {data.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line bg-background px-4 py-8 text-center text-sm text-muted">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-6 flex h-56 items-end gap-3 overflow-x-auto pb-1 sm:gap-5">
          {data.map((item) => {
            const height =
              item.value > 0 ? `${Math.max(6, (item.value / max) * 100)}%` : "2px";
            return (
              <div
                key={item.label}
                className="flex h-full min-w-14 flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-center text-[11px] font-semibold text-heading">
                  {formatValue(item.value)}
                </span>
                <div className="flex h-full w-full max-w-16 items-end">
                  <div
                    className="w-full rounded-t-lg bg-primary transition-colors hover:bg-primary-hover"
                    style={{ height }}
                    title={`${item.label}: ${formatValue(item.value)}`}
                  />
                </div>
                <span className="text-center text-[11px] text-muted">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
