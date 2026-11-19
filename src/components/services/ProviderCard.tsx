import Link from "next/link";
import { ArrowRight, BadgeCheck, Briefcase, Star } from "lucide-react";

import Avatar from "@/components/common/Avatar";
import type { Provider } from "@/types/provider";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar name={provider.name} src={provider.avatar} size="lg" />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1 text-base font-semibold text-heading">
            <span className="truncate">{provider.businessName}</span>
            {provider.verified ? (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-primary"
                aria-label="Verified provider"
              />
            ) : null}
          </h3>
          <p className="truncate text-sm text-muted">{provider.specialty}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {provider.name} &middot; {provider.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-sm">
        <span className="flex items-center gap-1 font-semibold text-heading">
          <Star
            className="h-4 w-4 fill-primary text-primary"
            aria-hidden="true"
          />
          {provider.rating.toFixed(1)}
        </span>
        <span className="text-muted">{provider.reviewCount} reviews</span>
        <span className="flex items-center gap-1 text-muted">
          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
          {provider.completedJobs} jobs
        </span>
      </div>

      <Link
        href={`/services?provider=${provider.id}`}
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
      >
        View services
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
