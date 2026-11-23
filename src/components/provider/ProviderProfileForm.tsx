"use client";

import { type FormEvent, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Save,
  Star,
} from "lucide-react";

import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import Input from "@/components/common/Input";
import StarRating from "@/components/common/StarRating";
import Textarea from "@/components/common/Textarea";
import { getProviderById } from "@/data/providers";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/usePortalData";
import { validatePhone, validateRequired } from "@/lib/validations";
import type { UserProfileRecord } from "@/types/dashboard";

interface FormErrors {
  fullName?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

function isRemoteOrLocalPath(value: string): boolean {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

export default function ProviderProfileForm() {
  const { user } = useAuth();
  const { profile, saveProfile } = useUserProfile(user?.id);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  const provider = user?.providerId
    ? getProviderById(user.providerId)
    : undefined;

  const displayName =
    profile.fullName || provider?.name || user?.name || "Service provider";
  const avatarSrc = profile.avatar?.startsWith("/")
    ? profile.avatar
    : provider?.avatar;
  const location = profile.location || provider?.location || "Not set yet";
  const bio =
    profile.bio ||
    provider?.bio ||
    "Add a short introduction so customers know what makes your service different.";
  const businessName =
    profile.businessName || provider?.businessName || "Your business name";
  const specialty = profile.specialty || provider?.specialty || "Your specialty";

  // Remount the uncontrolled form whenever the persisted profile changes, so
  // saved values are reflected without syncing state in an effect.
  const formKey = [
    user?.id ?? "anonymous",
    profile.fullName,
    profile.phone,
    profile.location,
    profile.bio,
    profile.businessName,
    profile.specialty,
    profile.website,
    profile.avatar,
  ].join("|");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      fullName: String(data.get("fullName") ?? ""),
      phone: String(data.get("phone") ?? ""),
      location: String(data.get("location") ?? ""),
      bio: String(data.get("bio") ?? ""),
      businessName: String(data.get("businessName") ?? ""),
      specialty: String(data.get("specialty") ?? ""),
      website: String(data.get("website") ?? ""),
      avatar: String(data.get("avatar") ?? ""),
    };

    const nextErrors: FormErrors = {
      fullName: validateRequired(values.fullName, "Please enter your full name."),
      phone: validatePhone(values.phone),
      location: validateRequired(values.location, "Please enter your location."),
    };

    if (
      values.website.trim() &&
      !isRemoteOrLocalPath(values.website.trim())
    ) {
      nextErrors.website = "Enter a full URL starting with http:// or https://.";
    }
    if (values.avatar.trim() && !isRemoteOrLocalPath(values.avatar.trim())) {
      nextErrors.avatar = "Enter an image URL or a local path starting with /.";
    }

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSaved(false);
      return;
    }

    const next: UserProfileRecord = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      bio: values.bio.trim(),
      businessName: values.businessName.trim(),
      specialty: values.specialty.trim(),
      website: values.website.trim(),
      avatar: values.avatar.trim(),
    };

    saveProfile(next);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <DashboardIntro
        title="Your profile"
        description="Keep your business details current so customers know exactly who they are booking."
        action={
          <ButtonLink href="/provider/services" variant="outline" size="sm">
            <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
            My services
          </ButtonLink>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-heading">
                Editable details
              </h3>
              <p className="mt-1 text-sm text-muted">
                These details are saved on this device for your provider portal.
              </p>
            </div>
          </div>

          {saved ? (
            <p
              role="status"
              className="mt-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Profile saved successfully.
            </p>
          ) : null}

          <form
            key={formKey}
            onSubmit={handleSubmit}
            onChange={() => setSaved(false)}
            noValidate
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                name="fullName"
                defaultValue={profile.fullName || user?.name || ""}
                placeholder="Ayesha Khan"
                autoComplete="name"
                error={errors.fullName}
              />
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                defaultValue={profile.phone || user?.phone || ""}
                placeholder="0300 1234567"
                autoComplete="tel"
                error={errors.phone}
              />
            </div>

            <Input
              label="Service location"
              name="location"
              defaultValue={profile.location || provider?.location || ""}
              placeholder="Gulgasht Colony, Multan"
              error={errors.location}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Business name"
                name="businessName"
                defaultValue={profile.businessName || provider?.businessName || ""}
                placeholder="Ayesha Home Cleaning"
              />
              <Input
                label="Specialty"
                name="specialty"
                defaultValue={profile.specialty || provider?.specialty || ""}
                placeholder="Home Cleaning"
              />
            </div>

            <Textarea
              label="Short bio"
              name="bio"
              rows={4}
              defaultValue={profile.bio || provider?.bio || ""}
              placeholder="Tell customers about your experience and approach."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Website (optional)"
                name="website"
                type="url"
                defaultValue={profile.website ?? ""}
                placeholder="https://your-business.example"
                error={errors.website}
              />
              <Input
                label="Avatar image URL (optional)"
                name="avatar"
                defaultValue={profile.avatar ?? ""}
                placeholder="/images/providers/ayesha-khan.jpg"
                error={errors.avatar}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit">
                <Save className="h-4 w-4" aria-hidden="true" />
                Save changes
              </Button>
              <p className="text-xs text-muted">
                Your email address is managed in your sign-in account.
              </p>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
            <div className="h-2 bg-primary" aria-hidden="true" />
            <div className="p-6 text-center">
              <div className="flex justify-center">
                <Avatar
                  name={displayName}
                  src={avatarSrc}
                  size="lg"
                  className="h-20 w-20 text-xl"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-heading">
                {displayName}
              </h3>
              <p className="mt-1 text-sm text-muted">{businessName}</p>
              {provider?.verified ? (
                <div className="mt-3 flex justify-center">
                  <Badge variant="success">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified provider
                  </Badge>
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl border border-line bg-background p-3">
                  <p className="text-xs text-muted">Rating</p>
                  <p className="mt-1 flex items-center gap-1 text-lg font-bold text-heading">
                    <Star
                      className="h-4 w-4 fill-highlight text-highlight"
                      aria-hidden="true"
                    />
                    {provider ? provider.rating.toFixed(1) : "New"}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-background p-3">
                  <p className="text-xs text-muted">Completed jobs</p>
                  <p className="mt-1 text-lg font-bold text-heading">
                    {provider ? provider.completedJobs : 0}
                  </p>
                </div>
              </div>

              {provider ? (
                <div className="mt-4 flex justify-center">
                  <StarRating rating={provider.rating} />
                </div>
              ) : null}

              <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {location}
              </p>
              <p className="mt-3 text-left text-sm leading-relaxed text-body">
                {bio}
              </p>
              <p className="mt-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                {specialty}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading">Public profile</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Your rating, completed jobs and reviews come from your public
              provider listing and update automatically.
            </p>
            {provider ? (
              <p className="mt-3 text-xs text-muted">
                {provider.reviewCount} customer reviews on your public listing.
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
