import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  light?: boolean;
  className?: string;
}

export default function Logo({ light = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Quicker home"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Image
        src={light ? "/logos/quicker-mark-light.png" : "/logos/quicker-mark.png"}
        alt=""
        width={36}
        height={36}
        priority
        className="h-9 w-9"
      />
      <span
        className={cn(
          "text-xl font-bold tracking-tight",
          light ? "text-white" : "text-heading",
        )}
      >
        Quicker
      </span>
    </Link>
  );
}
