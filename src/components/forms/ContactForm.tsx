"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Lock, Send } from "lucide-react";

import Button from "@/components/common/Button";

const STORAGE_KEY = "quicker:contact-messages";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOPICS = [
  "General enquiry",
  "Help with a booking",
  "Become a service provider",
  "Feedback or complaint",
  "Partnership opportunity",
] as const;

interface FormValues {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
};

const fieldClasses =
  "mt-2 h-11 w-full rounded-xl border border-line bg-card px-3 text-sm text-heading placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const textareaClasses =
  "mt-2 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-heading placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-muted";
const errorClasses = "mt-1.5 text-xs text-red-600";

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (values.phone.trim() && phoneDigits.length < 10) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.topic) {
    errors.topic = "Please choose a topic.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please add a little more detail (at least 10 characters).";
  }

  return errors;
}

export default function ContactForm() {
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

    const code = `QK-C-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const messages: unknown[] = stored ? JSON.parse(stored) : [];
      messages.push({
        reference: code,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        topic: values.topic,
        message: values.message.trim(),
        createdAt: new Date().toISOString(),
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
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
      <div className="rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-heading">
          Message received
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Thanks, {values.name.trim()}. Our team will reply to{" "}
          <span className="font-semibold text-heading">
            {values.email.trim()}
          </span>{" "}
          within one business day.
        </p>

        <dl className="mt-6 space-y-3 rounded-xl border border-line bg-background p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="font-semibold text-heading">{reference}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Topic</dt>
            <dd className="text-right font-semibold text-heading">
              {values.topic}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Phone</dt>
            <dd className="font-semibold text-heading">
              {values.phone.trim() || "Not provided"}
            </dd>
          </div>
        </dl>

        <Button variant="outline" className="mt-6 w-full" onClick={handleReset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClasses}>
              Your name
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Saqib Shokat"
              value={values.name}
              onChange={update("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={fieldClasses}
            />
            {errors.name ? (
              <p id="contact-name-error" className={errorClasses} role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClasses}>
              Email address
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={update("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={fieldClasses}
            />
            {errors.email ? (
              <p id="contact-email-error" className={errorClasses} role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelClasses}>
              Phone number <span className="normal-case text-muted">(optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              placeholder="0300 1234567"
              value={values.phone}
              onChange={update("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
              className={fieldClasses}
            />
            {errors.phone ? (
              <p id="contact-phone-error" className={errorClasses} role="alert">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-topic" className={labelClasses}>
              What is this about?
            </label>
            <select
              id="contact-topic"
              value={values.topic}
              onChange={update("topic")}
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={errors.topic ? "contact-topic-error" : undefined}
              className={`${fieldClasses} ${values.topic ? "" : "text-muted"}`}
            >
              <option value="">Choose a topic</option>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            {errors.topic ? (
              <p id="contact-topic-error" className={errorClasses} role="alert">
                {errors.topic}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClasses}>
            Your message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Tell us how we can help..."
            value={values.message}
            onChange={update("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={textareaClasses}
          />
          {errors.message ? (
            <p id="contact-message-error" className={errorClasses} role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full">
          <Send className="h-4 w-4" aria-hidden="true" />
          Send message
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          We only use these details to respond to your enquiry.
        </p>
      </form>
    </div>
  );
}
