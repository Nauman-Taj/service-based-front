"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Loader2,
  User,
  UserPlus,
} from "lucide-react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/lib/validations";
import { AuthError, type RegisterableRole } from "@/types/user";
import { roleHomePath } from "@/utils/roleHelpers";
import { cn } from "@/lib/utils";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

type FormErrors = Partial<Record<keyof FormValues | "role", string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

const roleOptions: Array<{
  value: RegisterableRole;
  title: string;
  description: string;
  icon: typeof User;
}> = [
  {
    value: "customer",
    title: "Book services",
    description: "Find and book vetted local professionals.",
    icon: User,
  },
  {
    value: "provider",
    title: "Offer services",
    description: "List your skills and get booking requests.",
    icon: Briefcase,
  },
];

export default function RegisterForm() {
  const { register, status, user } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [role, setRole] = useState<RegisterableRole>("customer");
  const [errors, setErrors] = useState<FormErrors>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Go straight to the dashboard.
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(roleHomePath(user.role));
    }
  }, [status, user, router]);

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
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      password: validatePassword(values.password),
      confirm: validateConfirmPassword(values.password, values.confirm),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setSubmitting(true);
    setBanner(null);
    try {
      const created = await register({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
        role,
      });
      router.replace(roleHomePath(created.role));
    } catch (error) {
      setBanner(
        error instanceof AuthError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-heading">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Join Quicker to book services or grow your service business.
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

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
            I want to
          </legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {roleOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex h-full flex-col gap-1 rounded-xl border border-line bg-card p-3.5 transition-colors",
                    "peer-checked:border-primary peer-checked:bg-primary/5",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <option.icon
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    {role === option.value ? (
                      <CheckCircle2
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                  <span className="mt-1 text-sm font-semibold text-heading">
                    {option.title}
                  </span>
                  <span className="text-xs leading-relaxed text-muted">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Enter your full name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          error={errors.name}
        />

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
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="0300 1234567"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          error={errors.phone}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Password"
            revealable
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            error={errors.password}
          />
          <Input
            label="Confirm password"
            revealable
            autoComplete="new-password"
            placeholder="Repeat password"
            value={values.confirm}
            onChange={(event) => update("confirm", event.target.value)}
            error={errors.confirm}
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
