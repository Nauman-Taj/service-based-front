import Image from "next/image";

import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

export default function Avatar({
  name,
  src,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="56px"
          className="object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
