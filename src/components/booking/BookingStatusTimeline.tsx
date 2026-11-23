import { Check, Clock } from "lucide-react";

import type { BookingStatus } from "@/types/booking";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

interface BookingStatusTimelineProps {
  status: BookingStatus;
  createdAt: string;
}

type StepState = "done" | "current" | "upcoming";

interface TimelineStep {
  key: string;
  label: string;
  description: string;
  state: StepState;
}

const stepLabels: Record<Exclude<BookingStatus, "cancelled">, string> = {
  pending: "Request received",
  confirmed: "Provider confirmed",
  "in-progress": "Service in progress",
  completed: "Job completed",
};

const stepDescriptions: Record<Exclude<BookingStatus, "cancelled">, string> = {
  pending: "Waiting for the provider to accept your request.",
  confirmed: "Your provider accepted the request.",
  "in-progress": "The service is being carried out.",
  completed: "The job has been marked as complete.",
};

const activeOrder: Array<Exclude<BookingStatus, "cancelled">> = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
];

/** Vertical progress tracker shared by every booking detail view. */
export default function BookingStatusTimeline({
  status,
  createdAt,
}: BookingStatusTimelineProps) {
  const createdLabel = `Created ${formatDate(createdAt.slice(0, 10))}`;
  const steps: TimelineStep[] =
    status === "cancelled"
      ? [
          {
            key: "pending",
            label: stepLabels.pending,
            description: createdLabel,
            state: "done",
          },
          {
            key: "cancelled",
            label: "Booking cancelled",
            description: "This request was cancelled and will not be carried out.",
            state: "current",
          },
        ]
      : activeOrder.map((key, index) => {
          const currentIndex = activeOrder.indexOf(
            status as Exclude<BookingStatus, "cancelled">,
          );
          const state: StepState =
            index < currentIndex
              ? "done"
              : index === currentIndex
                ? "current"
                : "upcoming";

          return {
            key,
            label: stepLabels[key],
            description:
              key === "pending" ? createdLabel : stepDescriptions[key],
            state,
          };
        });

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-bold text-heading">Booking progress</h3>
      <ol className="mt-5">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-line"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  step.state === "done" && "border-primary bg-primary text-white",
                  step.state === "current" &&
                    "border-2 border-primary bg-card text-primary",
                  step.state === "upcoming" &&
                    "border-line bg-card text-muted",
                )}
              >
                {step.state === "done" ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : step.state === "current" ? (
                  <Clock className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-line" />
                )}
              </span>
              <div className="pt-0.5">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    step.state === "upcoming" ? "text-muted" : "text-heading",
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
