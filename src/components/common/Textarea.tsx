"use client";

import { useId, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { errorClasses, labelClasses } from "@/components/common/Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const errorId = `${textareaId}-error`;

  return (
    <div>
      <label htmlFor={textareaId} className={labelClasses}>
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm leading-relaxed text-heading placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          error && "border-red-300",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className={errorClasses} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
