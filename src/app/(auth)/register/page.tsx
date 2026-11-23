import type { Metadata } from "next";

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Join Quicker as a customer to book vetted local services, or as a provider to grow your service business.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
