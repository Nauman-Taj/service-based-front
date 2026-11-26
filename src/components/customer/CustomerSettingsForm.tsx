"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Bell,
  CheckCircle2,
  LogOut,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
import { useAuth } from "@/hooks/useAuth";
import { useAccountSettings } from "@/hooks/usePortalData";
import { cn } from "@/lib/utils";
import {
  defaultAccountSettings,
  type AccountSettingsRecord,
} from "@/types/dashboard";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-heading">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-all",
            checked && "left-[22px]",
          )}
        />
      </button>
    </div>
  );
}

/** Customer notification, privacy and locale preferences. */
export default function CustomerSettingsForm() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { settings, saveSettings, loading, error } = useAccountSettings(
    user?.id,
  );

  // Deriving from the saved settings keeps the form correct when the API
  // response arrives after mount, without overwriting edits already in progress.
  const [draft, setDraft] = useState<AccountSettingsRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const values = draft ?? settings;

  function update<K extends keyof AccountSettingsRecord>(
    field: K,
    value: AccountSettingsRecord[K],
  ) {
    setDraft({ ...values, [field]: value });
    setNotice(null);
    setSaveError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      await saveSettings(values);
      setDraft(null);
      setNotice("Your preferences have been saved.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save your settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    try {
      await saveSettings({ ...defaultAccountSettings });
      setDraft(null);
      setSaveError("");
      setNotice("Your preferences were reset to their defaults.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not reset your settings.",
      );
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await logout();
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-bold text-heading">Notifications</h3>
              <p className="mt-0.5 text-sm text-muted">
                Choose how Quicker can reach you.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ToggleRow
              label="Email notifications"
              description="Booking updates and service reminders sent to your inbox."
              checked={values.emailNotifications}
              onChange={(checked) => update("emailNotifications", checked)}
            />
            <ToggleRow
              label="SMS notifications"
              description="Short text alerts for appointment confirmations and changes."
              checked={values.smsNotifications}
              onChange={(checked) => update("smsNotifications", checked)}
            />
            <ToggleRow
              label="Marketing emails"
              description="Occasional offers and recommendations from Quicker."
              checked={values.marketingEmails}
              onChange={(checked) => update("marketingEmails", checked)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-bold text-heading">
                Privacy and locale
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                Control your visible profile and preferred language.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ToggleRow
              label="Public profile"
              description="Let other customers see the name and bio on your profile."
              checked={values.showPublicProfile}
              onChange={(checked) => update("showPublicProfile", checked)}
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Select
              label="Language"
              value={values.language}
              onChange={(event) =>
                update(
                  "language",
                  event.target.value as AccountSettingsRecord["language"],
                )
              }
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </Select>
            <Select
              label="Timezone"
              value={values.timezone}
              onChange={(event) =>
                update(
                  "timezone",
                  event.target.value as AccountSettingsRecord["timezone"],
                )
              }
            >
              <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
              <option value="UTC">UTC</option>
            </Select>
          </div>
        </section>

        {loading ? (
          <p
            role="status"
            className="mt-5 rounded-xl border border-line bg-background px-4 py-3 text-sm font-medium text-muted"
          >
            Loading your preferences…
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

        {notice ? (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {notice}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save preferences"}
          </Button>
        </div>
      </form>

      <section className="rounded-2xl border border-red-200 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-heading">Danger zone</h3>
            <p className="mt-0.5 text-sm text-muted">
              Manage your session and account preferences.
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-line border-t border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-semibold text-heading">Sign out</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                End this session and return to the homepage.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="border-red-200 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-semibold text-heading">
                Reset preferences
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Restore notification and locale settings to their defaults on
                your account. Your profile and bookings are not affected.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => void handleReset()}
              disabled={saving}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset preferences
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
