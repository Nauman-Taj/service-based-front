"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  light?: boolean;
  className?: string;
  size?: "md" | "lg";
}

export default function Logo({
  light = false,
  className,
  size = "md",
}: LogoProps) {
  const large = size === "lg";
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
        width={large ? 48 : 36}
        height={large ? 48 : 36}
        priority
        className={large ? "h-12 w-12" : "h-9 w-9"}
      />
      <span
        className={cn(
          large ? "text-2xl font-bold tracking-tight" : "text-xl font-bold tracking-tight",
          light ? "text-white" : "text-heading",
        )}
      >
        Quicker
      </span>
    </Link>
  );
}
