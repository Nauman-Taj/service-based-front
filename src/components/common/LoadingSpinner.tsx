import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** Extra layout classes for the wrapper, e.g. a minimum height inside a page. */
  className?: string;
  /** Screen-reader text announced while the page is loading. */
  label?: string;
}

/**
 * The single page-loading state used across the public website.
 * Every route that is not ready yet should render this spinner so navigation
 * always looks and behaves the same, whether the visitor lands on a page
 * directly or moves between navbar links.
 */
export default function LoadingSpinner({
  className,
  label = "Loading\u2026",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-1 items-center justify-center py-24",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
