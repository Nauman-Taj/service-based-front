"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { buttonStyles } from "@/components/common/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("Public page failed to render", error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-24">
      <div className="max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">
          Something went wrong
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
          We couldn&apos;t load this page
        </h1>
        <p className="mt-3 text-muted">
          The service catalogue may be temporarily unavailable. Please try again
          or browse all services.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            className={buttonStyles("primary", "md")}
          >
            Try again
          </button>
          <Link href="/services" className={buttonStyles("outline", "md")}>
            Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
