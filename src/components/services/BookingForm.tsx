"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";

import Button from "@/components/common/Button";
import type { Service } from "@/types/service";
import { formatCurrency } from "@/utils/formatCurrency";
import { priceUnitLabels } from "@/utils/priceUnit";

const TIME_SLOTS = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "18:00 – 20:00",
];

const STORAGE_KEY = "quicker:service-requests";

interface BookingFormProps {
  service: Service;
}

interface FormValues {
  name: string;
  phone: string;
  date: string;
  time: string;
  address: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  phone: "",
  date: "",
  time: "",
  address: "",
  notes: "",
};

const fieldClasses =
  "h-11 w-full rounded-xl border border-line bg-card px-3 text-sm text-heading placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-muted";
const errorClasses = "mt-1.5 text-xs text-red-600";

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  const phoneDigits = values.phone.replace(/[^0-9]/g, "");
  if (phoneDigits.length < 10) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.date) {
    errors.date = "Please choose a preferred date.";
  } else {
    const selected = new Date(`${values.date}T00:00:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (selected < today) {
      errors.date = "Please choose a date in the future.";
    }
  }

  if (!values.time) {
    errors.time = "Please choose a time slot.";
  }

  if (values.address.trim().length < 5) {
    errors.address = "Please enter the service address.";
  }

  return errors;
}

export default function BookingForm({ service }: BookingFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [reference, setReference] = useState<string | null>(null);

  function update(
    field: keyof FormValues,
  ): (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void {
    return (event) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) =>
        previous[field] ? { ...previous, [field]: undefined } : previous,
      );
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const code = `QK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const requests: unknown[] = stored ? JSON.parse(stored) : [];
      requests.push({
        reference: code,
        serviceId: service.id,
        serviceTitle: service.title,
        providerName: service.providerName,
        price: service.price,
        ...values,
        createdAt: new Date().toISOString(),
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // Local storage may be unavailable; the confirmation still renders.
    }

    setReference(code);
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setReference(null);
  }

  if (reference) {
    return (
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-heading">
          Request received
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          We will call <span className="font-semibold text-heading">{values.phone}</span>{" "}
          to confirm the details with {service.providerName}.
        </p>

        <dl className="mt-5 space-y-3 rounded-xl border border-line bg-background p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="font-semibold text-heading">{reference}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Service</dt>
            <dd className="text-right font-semibold text-heading">
              {service.title}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Preferred</dt>
            <dd className="font-semibold text-heading">
              {values.date} &middot; {values.time}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Address</dt>
            <dd className="text-right font-semibold text-heading">
              {values.address}
            </dd>
          </div>
        </dl>

        <Button variant="outline" className="mt-5 w-full" onClick={handleReset}>
          Make another request
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Starting from
          </p>
          <p className="mt-1 text-2xl font-bold text-heading">
            {formatCurrency(service.price)}
            <span className="ml-1 text-xs font-medium text-muted">
              {priceUnitLabels[service.priceUnit]}
            </span>
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs text-muted">
        {service.reviewCount} verified reviews &middot; {service.providerName}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="booking-name" className={labelClasses}>
            Your name
          </label>
          <input
            id="booking-name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Hira Malik"
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            className={`mt-2 ${fieldClasses}`}
          />
          {errors.name ? (
            <p className={errorClasses} role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="booking-phone" className={labelClasses}>
            Phone number
          </label>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            placeholder="0300 1234567"
            value={values.phone}
            onChange={update("phone")}
            aria-invalid={Boolean(errors.phone)}
            className={`mt-2 ${fieldClasses}`}
          />
          {errors.phone ? (
            <p className={errorClasses} role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-date" className={labelClasses}>
              Preferred date
            </label>
            <input
              id="booking-date"
              type="date"
              value={values.date}
              onChange={update("date")}
              aria-invalid={Boolean(errors.date)}
              className={`mt-2 ${fieldClasses}`}
            />
            {errors.date ? (
              <p className={errorClasses} role="alert">
                {errors.date}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="booking-time" className={labelClasses}>
              Time slot
            </label>
            <select
              id="booking-time"
              value={values.time}
              onChange={update("time")}
              aria-invalid={Boolean(errors.time)}
              className={`mt-2 ${fieldClasses} ${
                values.time ? "" : "text-muted"
              }`}
            >
              <option value="">Select a slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time ? (
              <p className={errorClasses} role="alert">
                {errors.time}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="booking-address" className={labelClasses}>
            Service address
          </label>
          <input
            id="booking-address"
            type="text"
            autoComplete="street-address"
            placeholder="Street, colony, Multan"
            value={values.address}
            onChange={update("address")}
            aria-invalid={Boolean(errors.address)}
            className={`mt-2 ${fieldClasses}`}
          />
          {errors.address ? (
            <p className={errorClasses} role="alert">
              {errors.address}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="booking-notes" className={labelClasses}>
            Notes (optional)
          </label>
          <textarea
            id="booking-notes"
            rows={3}
            placeholder="Anything the provider should know"
            value={values.notes}
            onChange={update("notes")}
            className="mt-2 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-heading placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button type="submit" className="w-full">
          Request this service
        </Button>
        <p className="text-center text-xs text-muted">
          No payment today — we confirm the details first.
        </p>
      </form>
    </div>
  );
}
