"use client";

import { Mail } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import Button from "@/components/common/Button";

const STORAGE_KEY = "quicker:newsletter";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterStatus = "idle" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setStatus("error");
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, value);
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Newsletter
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Seasonal tips and member-only offers
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                Join 1,800+ homeowners getting maintenance reminders and
                exclusive discounts. No spam, unsubscribe anytime.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="w-full">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-full bg-white/95 px-4 focus-within:ring-2 focus-within:ring-white/60">
                  <Mail
                    className="h-4 w-4 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status !== "idle") {
                        setStatus("idle");
                      }
                    }}
                    placeholder="you@example.com"
                    aria-invalid={status === "error"}
                    className="h-11 w-full min-w-0 bg-transparent text-sm text-heading placeholder:text-muted focus:outline-none focus-visible:outline-none"
                  />
                </div>
                <Button type="submit" variant="secondary" className="shrink-0">
                  Subscribe
                </Button>
              </div>
              <p
                aria-live="polite"
                className="mt-2 min-h-5 text-sm text-white/90"
              >
                {status === "success"
                  ? "You're on the list — check your inbox to confirm."
                  : null}
                {status === "error"
                  ? "Please enter a valid email address."
                  : null}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
