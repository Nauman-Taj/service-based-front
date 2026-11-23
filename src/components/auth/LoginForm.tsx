"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateRequired } from "@/lib/validations";
import { AuthError } from "@/types/user";
import { roleHomePath, safeRedirectForRole } from "@/utils/roleHelpers";

interface FormValues {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function LoginForm() {
  const { login, status, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requestedRedirect = searchParams.get("redirect");

  // Already signed in? Go straight to a dashboard this role can access.
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(
        safeRedirectForRole(requestedRedirect, user.role) ??
          roleHomePath(user.role),
      );
    }
  }, [status, user, router, requestedRedirect]);

  function update(field: keyof FormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
    setBanner(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      email: validateEmail(values.email),
      password: validateRequired(values.password, "Please enter your password."),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setSubmitting(true);
    setBanner(null);
    try {
      const signedIn = await login(
        { email: values.email.trim(), password: values.password },
        true,
      );
      router.replace(
        safeRedirectForRole(requestedRedirect, signedIn.role) ??
          roleHomePath(signedIn.role),
      );
    } catch (error) {
      setBanner(
        error instanceof AuthError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      // Always release the button. If navigation is delayed, the user should
      // see the normal Sign in state instead of a permanent spinner.
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-heading">
        Welcome back
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Sign in to manage your bookings, services and account.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {banner ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {banner}
          </p>
        ) : null}

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          revealable
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={(event) => update("password", event.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-not-allowed items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked
              disabled
              aria-disabled="true"
              className="h-4 w-4 rounded border-line accent-[#0d9488] opacity-70"
            />
            Remember me
          </label>
          <span aria-disabled="true" className="text-sm font-medium text-muted">
            Forgot password?
          </span>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
