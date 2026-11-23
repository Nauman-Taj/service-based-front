"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonStyles } from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className={buttonStyles("outline", "sm", "h-9 w-9 px-0")}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-current={item === page ? "page" : undefined}
          className={cn(
            "h-9 w-9 rounded-full text-sm font-semibold transition-colors",
            item === page
              ? "bg-primary text-white"
              : "border border-line bg-card text-body hover:border-primary hover:text-primary",
          )}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className={buttonStyles("outline", "sm", "h-9 w-9 px-0")}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
