"use client";

import { useState, type FormEvent } from "react";
import {
  CalendarCheck2,
  CalendarX2,
  CheckCircle2,
  Clock3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import { fieldClasses } from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useAvailability } from "@/hooks/usePortalData";
import type {
  AvailabilityRule,
  BlockedDateRecord,
} from "@/types/dashboard";
import { formatDate } from "@/utils/formatDate";

const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

interface WeeklyScheduleProps {
  initialRules: AvailabilityRule[];
  saved: boolean;
  onSave: (rules: AvailabilityRule[]) => void;
  onDirty: () => void;
}

function WeeklySchedule({
  initialRules,
  saved,
  onSave,
  onDirty,
}: WeeklyScheduleProps) {
  const [rules, setRules] = useState<AvailabilityRule[]>(() =>
    DAY_ORDER.map(
      (day) =>
        initialRules.find((rule) => rule.day === day) ?? {
          day,
          enabled: false,
          slots: [],
        },
    ),
  );
  const [slotDay, setSlotDay] = useState<number | null>(null);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("12:00");
  const [slotError, setSlotError] = useState("");

  function changeRules(next: AvailabilityRule[]) {
    setRules(next);
    onDirty();
  }

  function toggleDay(day: number) {
    changeRules(
      rules.map((rule) =>
        rule.day === day ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  }

  function removeSlot(day: number, slot: string) {
    changeRules(
      rules.map((rule) =>
        rule.day === day
          ? { ...rule, slots: rule.slots.filter((item) => item !== slot) }
          : rule,
      ),
    );
  }

  function openSlot(day: number) {
    setSlotDay(day);
    setStart("09:00");
    setEnd("12:00");
    setSlotError("");
  }

  function addSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (slotDay === null) {
      return;
    }
    if (!start || !end || start >= end) {
      setSlotError("Choose an end time later than the start time.");
      return;
    }
    const label = `${start} – ${end}`;
    changeRules(
      rules.map((rule) =>
        rule.day === slotDay && !rule.slots.includes(label)
          ? { ...rule, slots: [...rule.slots, label] }
          : rule,
      ),
    );
    setSlotDay(null);
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-heading">Weekly schedule</h3>
          <p className="mt-1 text-sm text-muted">
            Choose the days and time slots customers can book.
          </p>
        </div>
        {saved ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Schedule saved
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {rules.map((rule) => (
          <div
            key={rule.day}
            className="rounded-xl border border-line bg-background p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-heading">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => toggleDay(rule.day)}
                  aria-label={`Available on ${DAY_LABELS[rule.day]}`}
                  className="h-4 w-4 accent-primary"
                />
                {DAY_LABELS[rule.day]}
              </label>
              <Badge variant={rule.enabled ? "primary" : "neutral"}>
                {rule.enabled ? "Available" : "Unavailable"}
              </Badge>
            </div>

            {rule.enabled ? (
              <div className="mt-3 space-y-2">
                {rule.slots.length === 0 ? (
                  <p className="text-sm text-muted">No time slots added yet.</p>
                ) : (
                  rule.slots.map((slot) => (
                    <div
                      key={slot}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line bg-card px-3 py-2 text-sm text-heading"
                    >
                      <span className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                        {slot}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSlot(rule.day, slot)}
                        aria-label={`Remove ${slot} on ${DAY_LABELS[rule.day]}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-heading"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSlot(rule.day)}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add time slot
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="text-xs text-muted">
          Changes are saved on this device after you confirm.
        </p>
        <Button onClick={() => onSave(rules)}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save weekly schedule
        </Button>
      </div>

      <Modal
        open={slotDay !== null}
        onClose={() => setSlotDay(null)}
        title="Add a time slot"
        description={
          slotDay === null
            ? undefined
            : `Choose a bookable window for ${DAY_LABELS[slotDay]}.`
        }
        className="max-w-md"
      >
        <form onSubmit={addSlot} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="slot-start" className="text-xs font-semibold uppercase tracking-wide text-muted">
                Start time
              </label>
              <input
                id="slot-start"
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className={`mt-2 ${fieldClasses}`}
              />
            </div>
            <div>
              <label htmlFor="slot-end" className="text-xs font-semibold uppercase tracking-wide text-muted">
                End time
              </label>
              <input
                id="slot-end"
                type="time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className={`mt-2 ${fieldClasses}`}
              />
            </div>
          </div>
          {slotError ? (
            <p className="text-sm text-red-600" role="alert">
              {slotError}
            </p>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSlotDay(null)}>
              Cancel
            </Button>
            <Button type="submit">Add slot</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

interface BlockedDatesProps {
  blocked: BlockedDateRecord[];
  onAdd: (date: string, reason: string) => void;
  onRemove: (id: string) => void;
}

function BlockedDates({ blocked, onAdd, onRemove }: BlockedDatesProps) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date) {
      setError("Choose a date to block.");
      return;
    }
    if (!reason.trim()) {
      setError("Add a short reason for customers.");
      return;
    }
    if (blocked.some((item) => item.date === date)) {
      setError("That date is already blocked.");
      return;
    }
    onAdd(date, reason.trim());
    setDate("");
    setReason("");
    setError("");
    setAdded(true);
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-heading">Blocked dates</h3>
          <p className="mt-1 text-sm text-muted">
            Mark holidays or days you are unavailable for bookings.
          </p>
        </div>
        {added ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Date blocked
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        onChange={() => {
          setAdded(false);
          setError("");
        }}
        className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] sm:items-end"
      >
        <div>
          <label htmlFor="blocked-date" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Date
          </label>
          <input
            id="blocked-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={`mt-2 ${fieldClasses}`}
          />
        </div>
        <div>
          <label htmlFor="blocked-reason" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Reason
          </label>
          <input
            id="blocked-reason"
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Annual leave"
            className={`mt-2 ${fieldClasses}`}
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Block date
        </Button>
        {error ? (
          <p className="text-sm text-red-600 sm:col-span-3" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      <div className="mt-6">
        {blocked.length === 0 ? (
          <EmptyState
            icon={CalendarCheck2}
            title="No blocked dates"
            description="Your weekly schedule is open on every enabled day."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {blocked.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-line bg-background p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarX2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-heading">
                      {formatDate(item.date)}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{item.reason}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Unblock ${formatDate(item.date)}`}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-heading"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function AvailabilityCalendar() {
  const { user } = useAuth();
  const { rules, saveRules, blocked, addBlockedDate, removeBlockedDate } =
    useAvailability(user?.providerId);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  return (
    <div className="space-y-8">
      <DashboardIntro
        title="Availability"
        description="Set your regular booking hours and block individual dates when you are away."
      />

      <WeeklySchedule
        key={JSON.stringify(rules)}
        initialRules={rules}
        saved={scheduleSaved}
        onSave={(next) => {
          saveRules(next);
          setScheduleSaved(true);
        }}
        onDirty={() => setScheduleSaved(false)}
      />
      <BlockedDates
        blocked={blocked}
        onAdd={addBlockedDate}
        onRemove={removeBlockedDate}
      />
    </div>
  );
}
