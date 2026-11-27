"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Loader2, Lock, Send } from "lucide-react";

import Button from "@/components/common/Button";
import { submitContactMessage } from "@/lib/contact-api";
import type {
  ContactMessage,
  ContactSubmissionInput,
} from "@/types/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\s()-]{10,20}$/;

interface FormValues {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface ContactFormProps {
  /** Topic options served by the public API. */
  topics: string[];
}

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

function describeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not send your message. Please try again.";
}

function validate(values: FormValues, topics: string[]): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  if (name.length < 2 || name.length > 100) {
    errors.name = "Please enter your name (2–100 characters).";
  }

  const email = values.email.trim();
  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    errors.email = "Please enter a valid email address.";
  }

  const phone = values.phone.trim();
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.topic) {
    errors.topic = "Please choose a topic.";
  } else if (!topics.includes(values.topic)) {
    errors.topic = "Please choose one of the listed topics.";
  }

  const message = values.message.trim();
  if (message.length < 10 || message.length > 2000) {
    errors.message = "Please add 10–2000 characters so we can help properly.";
  }

  return errors;
}

/** Public enquiry form backed by POST /contacts. */
export default function ContactForm({ topics }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ContactMessage | null>(null);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values, topics);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const input: ContactSubmissionInput = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      topic: values.topic,
      message: values.message.trim(),
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await submitContactMessage(input);
      setResult(created);
    } catch (error) {
      setSubmitError(describeError(error));
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
    setResult(null);
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-heading">
          Message received
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Thanks, {result.name}. Our team will reply to{" "}
          <span className="font-semibold text-heading">{result.email}</span>{" "}
          within one business day.
        </p>

        <dl className="mt-6 space-y-3 rounded-xl border border-line bg-background p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="font-semibold text-heading">{result.reference}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Topic</dt>
            <dd className="text-right font-semibold text-heading">
              {result.topic}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Phone</dt>
            <dd className="font-semibold text-heading">
              {result.phone || "Not provided"}
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
      <form onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClasses}>
              Your name
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              maxLength={100}
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
              maxLength={160}
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
              maxLength={20}
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
              {topics.map((topic) => (
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
            maxLength={2000}
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

        {submitError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </p>
        ) : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {submitting ? "Sending…" : "Send message"}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          We only use these details to respond to your enquiry.
        </p>
      </form>
    </div>
  );
}
