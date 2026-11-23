"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

export const fieldClasses =
  "h-11 w-full rounded-xl border border-line bg-card px-3 text-sm text-heading placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
export const labelClasses =
  "text-xs font-semibold uppercase tracking-wide text-muted";
export const errorClasses = "mt-1.5 text-xs text-red-600";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Renders a show/hide toggle for password fields. */
  revealable?: boolean;
}

/**
 * Labeled text input with inline error, shared by the auth forms.
 * Password visibility toggling is built in via `revealable`.
 */
export default function Input({
  label,
  error,
  revealable = false,
  className,
  id,
  type = "text",
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);
  const inputType = revealable ? (revealed ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            fieldClasses,
            revealable && "pr-11",
            error && "border-red-300",
            className,
          )}
          {...props}
        />
        {revealable ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted transition-colors hover:text-heading"
          >
            {revealed ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={errorClasses} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
