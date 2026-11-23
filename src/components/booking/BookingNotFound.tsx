import { SearchX } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";

interface BookingNotFoundProps {
  backHref: string;
  backLabel: string;
  title?: string;
  description?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

/** Friendly fallback for an unknown or inaccessible booking id. */
export default function BookingNotFound({
  backHref,
  backLabel,
  title = "Booking not found",
  description =
    "We could not find this booking. It may have been removed, or the link may be incomplete.",
  secondaryHref = "/services",
  secondaryLabel = "Browse services",
}: BookingNotFoundProps) {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-line bg-card px-6 py-14 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-xl font-bold text-heading">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href={backHref}>{backLabel}</ButtonLink>
        <ButtonLink href={secondaryHref} variant="outline">
          {secondaryLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
