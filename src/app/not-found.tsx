import Link from "next/link";
import { SearchX } from "lucide-react";

import { buttonStyles } from "@/components/common/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonStyles("primary", "md")}>
            Back to homepage
          </Link>
          <Link href="/services" className={buttonStyles("outline", "md")}>
            Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
