"use client";

import { CheckCircle2, LogOut, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import Button from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import Select from "@/components/common/Select";
import { useAuth } from "@/hooks/useAuth";
import { useAccountSettings } from "@/hooks/usePortalData";
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
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-background px-4 py-3.5 transition-colors hover:border-primary/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#0D9488]"
      />
      <span>
        <span className="block text-sm font-semibold text-heading">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
          {description}
        </span>
      </span>
    </label>
  );
}

/** Local-only admin preferences with working save, reset and sign-out. */
export default function AdminSettingsForm() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { settings, saveSettings } = useAccountSettings(user?.id);
  const [form, setForm] = useState<AccountSettingsRecord>(settings);
  const [message, setMessage] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  function update<K extends keyof AccountSettingsRecord>(
    field: K,
    value: AccountSettingsRecord[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSettings(form);
    setMessage("Preferences saved to this browser.");
  }

  function handleReset() {
    setForm(defaultAccountSettings);
    saveSettings(defaultAccountSettings);
    setMessage("Local admin preferences restored to defaults.");
  }

  async function handleSignOut() {
    setSigningOut(true);
    await logout();
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Settings"
        description="Notification and display preferences for this admin account."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-heading">Platform preferences</h2>
          <p className="mt-1 text-sm text-muted">
            These options are stored locally and take effect for this browser
            immediately.
          </p>

          {message ? (
            <p
              role="status"
              className="mt-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {message}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
                Notifications
              </legend>
              <div className="mt-3 space-y-3">
                <ToggleRow
                  label="Email notifications"
                  description="Receive platform alerts and booking updates by email."
                  checked={form.emailNotifications}
                  onChange={(value) => update("emailNotifications", value)}
                />
                <ToggleRow
                  label="SMS notifications"
                  description="Receive urgent service alerts as text messages."
                  checked={form.smsNotifications}
                  onChange={(value) => update("smsNotifications", value)}
                />
                <ToggleRow
                  label="Marketing emails"
                  description="Receive occasional marketplace news and offers."
                  checked={form.marketingEmails}
                  onChange={(value) => update("marketingEmails", value)}
                />
              </div>
            </fieldset>

            <fieldset className="border-t border-line pt-6">
              <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
                Display
              </legend>
              <div className="mt-3 space-y-3">
                <ToggleRow
                  label="Public profile visibility"
                  description="Make your administrator profile visible inside the portal."
                  checked={form.showPublicProfile}
                  onChange={(value) => update("showPublicProfile", value)}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Language"
                    value={form.language}
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
                    value={form.timezone}
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
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-muted"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset local admin preferences
              </Button>
              <Button type="submit">Save preferences</Button>
            </div>
          </form>
        </section>

        <aside className="h-fit space-y-4">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading">Account session</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Signed in as {user?.email ?? "an administrator"}. Signing out
              clears the local session for this browser.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full text-red-600 hover:border-red-300 hover:text-red-600"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
