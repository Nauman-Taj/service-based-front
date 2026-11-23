import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Quicker account to manage bookings, services and settings.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading sign in…" />}>
      <LoginForm />
    </Suspense>
  );
}
