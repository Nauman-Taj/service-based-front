"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  Globe2,
  LogOut,
  Save,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/common/Button";
import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import Select from "@/components/common/Select";
import { useAuth } from "@/hooks/useAuth";
import { useAccountSettings } from "@/hooks/usePortalData";
import type { AccountSettingsRecord } from "@/types/dashboard";

interface ToggleRowProps {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}

function ToggleRow({ id, title, description, defaultChecked }: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-background p-4 transition-colors hover:border-primary/40"
    >
      <span>
        <span className="block text-sm font-semibold text-heading">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted">
          {description}
        </span>
      </span>
      <input
        id={id}
        name={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}

export default function ProviderSettingsForm() {
  const { user, logout } = useAuth();
  const { settings, saveSettings } = useAccountSettings(user?.id);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const language: AccountSettingsRecord["language"] =
      data.get("language") === "ur" ? "ur" : "en";
    const timezone: AccountSettingsRecord["timezone"] =
      data.get("timezone") === "UTC" ? "UTC" : "Asia/Karachi";

    saveSettings({
      emailNotifications: data.has("emailNotifications"),
      smsNotifications: data.has("smsNotifications"),
      marketingEmails: data.has("marketingEmails"),
      showPublicProfile: data.has("showPublicProfile"),
      language,
      timezone,
    });
    setSaved(true);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="space-y-8">
      <DashboardIntro
        title="Account settings"
        description="Control notifications, profile visibility and your preferred language."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
          {saved ? (
            <p
              role="status"
              className="mb-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Settings saved successfully.
            </p>
          ) : null}

          <form
            key={JSON.stringify(settings)}
            onSubmit={handleSubmit}
            onChange={() => setSaved(false)}
            className="space-y-7"
          >
            <div>
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-heading">
                  Notifications
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                <ToggleRow
                  id="emailNotifications"
                  title="Email notifications"
                  description="Get booking updates and reminders by email."
                  defaultChecked={settings.emailNotifications}
                />
                <ToggleRow
                  id="smsNotifications"
                  title="SMS notifications"
                  description="Receive a text when a customer confirms a booking."
                  defaultChecked={settings.smsNotifications}
                />
                <ToggleRow
                  id="marketingEmails"
                  title="Offers and tips"
                  description="Occasional product news and provider tips from Quicker."
                  defaultChecked={settings.marketingEmails}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-heading">
                  Profile and locale
                </h3>
              </div>
              <div className="mt-4 space-y-4">
                <ToggleRow
                  id="showPublicProfile"
                  title="Show public profile"
                  description="Let customers see your business listing and reviews."
                  defaultChecked={settings.showPublicProfile}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Language"
                    name="language"
                    defaultValue={settings.language}
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                  </Select>
                  <Select
                    label="Timezone"
                    name="timezone"
                    defaultValue={settings.timezone}
                  >
                    <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                    <option value="UTC">UTC</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <Button type="submit">
                <Save className="h-4 w-4" aria-hidden="true" />
                Save settings
              </Button>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                Preferences are stored on this device for now.
              </p>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading">Quick links</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Manage the hours customers can book you, or review your public
              details.
            </p>
            <div className="mt-4 space-y-3">
              <ButtonLink
                href="/provider/availability"
                variant="outline"
                className="w-full justify-start"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Manage availability
              </ButtonLink>
              <ButtonLink
                href="/provider/profile"
                variant="ghost"
                className="w-full justify-start"
              >
                Edit provider profile
              </ButtonLink>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading">Session</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Signed in as{" "}
              <span className="font-semibold text-heading">
                {user?.email ?? "your account"}
              </span>
              .
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full justify-start"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
