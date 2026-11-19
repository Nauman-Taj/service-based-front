import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "gold" | "neutral" | "success";

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-highlight/20 text-[#8a6203]",
  neutral: "bg-slate-100 text-body",
  success: "bg-emerald-50 text-emerald-700",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

export default function Badge({
  variant = "primary",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
