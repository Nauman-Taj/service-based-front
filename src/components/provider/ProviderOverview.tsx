"use client";

import { Briefcase } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import BookingRequests from "@/components/provider/BookingRequests";
import ProviderStats from "@/components/provider/ProviderStats";
import { useAuth } from "@/hooks/useAuth";

export default function ProviderOverview() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <DashboardIntro
        title={`Welcome back, ${firstName}`}
        description="Track new requests, upcoming jobs and your earnings."
        action={
          <ButtonLink href="/provider/services" size="sm" variant="outline">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            My services
          </ButtonLink>
        }
      />
      <ProviderStats />
      <BookingRequests />
    </div>
  );
}
