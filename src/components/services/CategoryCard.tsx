import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={`/services/category/${category.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-background p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-semibold text-heading">
        {category.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
        {category.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-5 text-sm">
        <span className="font-medium text-body">
          {category.serviceCount.toLocaleString("en-US")} services
        </span>
        <ArrowRight
          className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
