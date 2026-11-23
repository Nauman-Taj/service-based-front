"use client";

import { useId, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { errorClasses, labelClasses } from "@/components/common/Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export default function Select({
  label,
  error,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;

  return (
    <div>
      <label htmlFor={selectId} className={labelClasses}>
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 w-full rounded-xl border border-line bg-card px-3 text-sm text-heading transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          error && "border-red-300",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className={errorClasses} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
