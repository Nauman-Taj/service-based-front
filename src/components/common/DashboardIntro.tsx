import type { ReactNode } from "react";

interface DashboardIntroProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/** Greeting/title row shared by the three dashboard overview pages. */
export default function DashboardIntro({
  title,
  description,
  action,
}: DashboardIntroProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-heading">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
