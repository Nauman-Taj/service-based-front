import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
  starClassName?: string;
}

export default function StarRating({
  rating,
  className,
  starClassName,
}: StarRatingProps) {
  return (
    <span
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            index < Math.round(rating)
              ? "fill-primary text-primary"
              : "text-line",
            starClassName,
          )}
        />
      ))}
    </span>
  );
}
