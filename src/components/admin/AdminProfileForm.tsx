"use client";

import { CheckCircle2, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";

import ProfileForm from "@/components/forms/ProfileForm";
import Avatar from "@/components/common/Avatar";
import DashboardIntro from "@/components/common/DashboardIntro";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/usePortalData";
import type { UserProfileRecord } from "@/types/dashboard";
import { roleLabel } from "@/utils/roleHelpers";

/** Admin profile editor backed by the shared profile store. */
export default function AdminProfileForm() {
  const { user, status } = useAuth();
  const { profile, saveProfile, loading, error } = useUserProfile(user?.id);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave(next: UserProfileRecord) {
    try {
      await saveProfile(next);
      setSaveError("");
      setSaved(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save your profile.",
      );
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="rounded-2xl border border-line bg-card p-8 text-center text-sm text-muted">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="My profile"
        description="Keep your administrator contact details and bio up to date."
      />

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-line bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Account summary
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar
              name={profile.fullName || user?.name || "Administrator"}
              src={profile.avatar || user?.avatar}
              size="lg"
            />
            <div className="min-w-0">
              <p className="truncate font-bold text-heading">
                {profile.fullName || user?.name || "Administrator"}
              </p>
              <p className="text-xs text-muted">
                {user ? roleLabel(user.role) : "Administrator"}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">Email address</dt>
                <dd className="break-all font-medium text-heading">
                  {user?.email ?? "Not available"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserRound
                className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
              <div>
                <dt className="text-xs text-muted">User ID</dt>
                <dd className="font-medium text-heading">
                  {user?.id ?? "Not available"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
              <div>
                <dt className="text-xs text-muted">Access level</dt>
                <dd className="font-medium text-heading">Full admin access</dd>
              </div>
            </div>
          </dl>
        </aside>

        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-heading">Edit profile</h2>
          <p className="mt-1 text-sm text-muted">
            Required fields are validated before anything is saved.
          </p>

          {saved ? (
            <p
              role="status"
              className="mt-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Profile saved successfully.
            </p>
          ) : null}

          {saveError ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {saveError}
            </p>
          ) : null}

          {error || saveError ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {saveError || error}
            </p>
          ) : null}

          <ProfileForm
            key={`${user?.id ?? "anonymous"}-${profile.fullName}`}
            className="mt-6"
            profile={profile}
            role="admin"
            showBusinessFields={false}
            onSubmit={handleSave}
          />
        </section>
      </div>
    </div>
  );
}
