import Link from "next/link";
import { Construction } from "lucide-react";

import { buttonStyles } from "@/components/common/Button";

interface PagePlaceholderProps {
  title: string;
  description: string;
  badge?: string;
}

export default function PagePlaceholder({
  title,
  description,
  badge = "In development",
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="mt-6 inline-flex rounded-full bg-highlight/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8a6203]">
        {badge}
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
        {description}
      </p>
      <Link href="/" className={buttonStyles("primary", "md", "mt-8")}>
        Back to homepage
      </Link>
    </section>
  );
}
