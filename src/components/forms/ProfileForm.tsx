"use client";

import { useState, type FormEvent } from "react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { cn } from "@/lib/utils";
import { emptyUserProfile, type UserProfileRecord } from "@/types/dashboard";
import type { UserRole } from "@/types/user";

export interface ProfileFormProps {
  profile?: UserProfileRecord;
  onSubmit: (profile: UserProfileRecord) => void | Promise<void>;
  /** Provider roles get business fields by default. */
  role?: UserRole;
  /** Explicitly show or hide business name and specialty. */
  showBusinessFields?: boolean;
  submitLabel?: string;
  className?: string;
}

type FieldErrors = Partial<Record<keyof UserProfileRecord, string>>;

/** Shared, validated profile editor used by every dashboard role. */
export default function ProfileForm({
  profile,
  onSubmit,
  role = "customer",
  showBusinessFields,
  submitLabel = "Save changes",
  className,
}: ProfileFormProps) {
  const [values, setValues] = useState<UserProfileRecord>({
    ...emptyUserProfile,
    ...profile,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const withBusiness = showBusinessFields ?? role === "provider";

  function update<K extends keyof UserProfileRecord>(
    field: K,
    value: UserProfileRecord[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (values.fullName.trim().length < 2) {
      next.fullName = "Enter your full name.";
    }
    if (values.phone.trim().replace(/[^\d]/g, "").length < 7) {
      next.phone = "Enter a valid phone number.";
    }
    if (values.location.trim().length < 2) {
      next.location = "Enter your city or area.";
    }

    const website = values.website?.trim();
    if (website) {
      try {
        const parsed = new URL(website);
        if (!/^https?:$/.test(parsed.protocol)) {
          next.website = "Use an http or https URL.";
        }
      } catch {
        next.website = "Enter a valid URL, including https://";
      }
    }

    if (withBusiness) {
      if (!values.businessName?.trim()) {
        next.businessName = "Enter your business name.";
      }
      if (!values.specialty?.trim()) {
        next.specialty = "Enter your main specialty.";
      }
    }

    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...values,
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        location: values.location.trim(),
        bio: values.bio?.trim() ?? "",
        businessName: values.businessName?.trim() ?? "",
        specialty: values.specialty?.trim() ?? "",
        website: values.website?.trim() ?? "",
        avatar: values.avatar?.trim() ?? "",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("space-y-5", className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          value={values.fullName}
          onChange={(event) => update("fullName", event.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          error={errors.fullName}
        />
        <Input
          label="Phone number"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          placeholder="0300 1234567"
          autoComplete="tel"
          error={errors.phone}
        />
      </div>

      <Input
        label="City or area"
        value={values.location}
        onChange={(event) => update("location", event.target.value)}
        placeholder="Multan, Punjab"
        autoComplete="address-level2"
        error={errors.location}
      />

      {withBusiness ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Business name"
            value={values.businessName ?? ""}
            onChange={(event) => update("businessName", event.target.value)}
            placeholder="Your business name"
            error={errors.businessName}
          />
          <Input
            label="Specialty"
            value={values.specialty ?? ""}
            onChange={(event) => update("specialty", event.target.value)}
            placeholder="e.g. Home Cleaning"
            error={errors.specialty}
          />
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Website (optional)"
          value={values.website ?? ""}
          onChange={(event) => update("website", event.target.value)}
          placeholder="https://example.com"
          type="url"
          error={errors.website}
        />
        <Input
          label="Avatar image URL (optional)"
          value={values.avatar ?? ""}
          onChange={(event) => update("avatar", event.target.value)}
          placeholder="/images/providers/ayesha-khan.jpg"
          error={errors.avatar}
        />
      </div>

      <Textarea
        label="Short bio"
        rows={4}
        value={values.bio ?? ""}
        onChange={(event) => update("bio", event.target.value)}
        placeholder="Tell people a little about your experience."
        error={errors.bio}
      />

      <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
