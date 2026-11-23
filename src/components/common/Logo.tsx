"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  light?: boolean;
  className?: string;
}

export default function Logo({ light = false, className }: LogoProps) {
  function handleClick() {
    if (typeof window === "undefined") {
      return;
    }

    // Behave like the Home navbar link: when the visitor is already on the
    // homepage, take them back to the top instead of doing nothing.
    if (`${window.location.pathname}${window.location.search}` === "/") {
      window.scrollTo(0, 0);
    }
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
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
