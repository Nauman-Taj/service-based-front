"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, ShieldCheck, UserRound } from "lucide-react";

import Avatar from "@/components/common/Avatar";
import Button, { ButtonLink } from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/usePortalData";
import type { UserProfileRecord } from "@/types/dashboard";
import { formatDate } from "@/utils/formatDate";
import { roleLabel } from "@/utils/roleHelpers";

interface FormState {
  fullName: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function toFormState(
  profile: UserProfileRecord,
  fallbackName: string,
  fallbackPhone?: string,
): FormState {
  return {
    fullName: profile.fullName || fallbackName,
    phone: profile.phone || fallbackPhone || "",
    location: profile.location || "",
    bio: profile.bio ?? "",
    avatar: profile.avatar ?? "",
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const fullName = form.fullName.trim();
  const phone = form.phone.trim();

  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Use at least 2 characters.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!/^[0-9+()\s-]{7,20}$/.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!form.location.trim()) {
    errors.location = "Location is required.";
  }

  if (form.bio.trim().length > 300) {
    errors.bio = "Keep your bio under 300 characters.";
  }

  const avatar = form.avatar.trim();
  if (avatar && !avatar.startsWith("/")) {
    errors.avatar = "Use a local image path that starts with /.";
  }

  return errors;
}

/** Customer profile editor plus a read-only account summary. */
export default function CustomerProfileForm() {
  const { user } = useAuth();
  const { profile, saveProfile } = useUserProfile(user?.id);

  // `draft` is null until the user edits a field. Deriving from the stored
  // profile keeps the form correct when localStorage hydrates after mount.
  const [draft, setDraft] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const savedState = toFormState(profile, user?.name ?? "", user?.phone);
  const values = draft ?? savedState;
  const dirty =
    draft !== null && JSON.stringify(draft) !== JSON.stringify(savedState);

  function update(field: keyof FormState, value: string) {
    setDraft({ ...values, [field]: value });
    setSaved(false);
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
    saveProfile({
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      bio: values.bio.trim(),
      avatar: values.avatar.trim() || undefined,
    });
    setSaving(false);
    setSaved(true);
  }

  function discard() {
    setDraft(null);
    setErrors({});
    setSaved(false);
  }

  const displayAvatar =
    values.avatar.startsWith("/") ? values.avatar : user?.avatar;
  const displayName = values.fullName.trim() || user?.name || "Customer";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="h-fit rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-heading">Personal details</h3>
            <p className="mt-0.5 text-sm text-muted">
              Keep your contact information up to date.
            </p>
          </div>
        </div>

        {saved ? (
          <div
            role="status"
            className="mt-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Your profile has been saved.
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            label="Full name"
            value={values.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            error={errors.fullName}
            placeholder="Your full name"
            autoComplete="name"
          />
          <Input
            label="Phone number"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            error={errors.phone}
            placeholder="0300 1234567"
            autoComplete="tel"
          />
          <Input
            label="Location"
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            error={errors.location}
            placeholder="City, area"
            className="sm:col-span-2"
          />
          <Textarea
            label="Short bio"
            value={values.bio}
            onChange={(event) => update("bio", event.target.value)}
            error={errors.bio}
            placeholder="Tell clients a little about yourself"
            rows={3}
            className="sm:col-span-2"
          />
          <Input
            label="Avatar image path"
            value={values.avatar}
            onChange={(event) => update("avatar", event.target.value)}
            error={errors.avatar}
            placeholder="/images/providers/ayesha-khan.jpg"
            className="sm:col-span-2"
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Avatar is optional. Use an image path from this site that starts with
          a forward slash.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {dirty ? (
            <Button
              variant="ghost"
              onClick={discard}
              disabled={saving}
            >
              Discard
            </Button>
          ) : null}
        </div>
      </form>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar name={displayName} src={displayAvatar} size="lg" />
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-heading">
                {displayName}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{user?.email ?? "—"}</span>
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-muted">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Role
              </dt>
              <dd className="font-semibold text-heading">
                {user ? roleLabel(user.role) : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Member since</dt>
              <dd className="font-semibold text-heading">
                {user ? formatDate(user.createdAt.slice(0, 10)) : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Location</dt>
              <dd className="max-w-32 truncate text-right font-semibold text-heading">
                {values.location.trim() || "Not set"}
              </dd>
            </div>
          </dl>

          <ButtonLink
            href="/customer/settings"
            variant="outline"
            size="sm"
            className="mt-5 w-full"
          >
            Account settings
          </ButtonLink>
        </section>
      </aside>
    </div>
  );
}
