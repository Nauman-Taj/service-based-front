"use client";

import { Search } from "lucide-react";

import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import CustomerStats from "@/components/customer/CustomerStats";
import RecentBookings from "@/components/customer/RecentBookings";
import { useAuth } from "@/hooks/useAuth";

export default function CustomerOverview() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <DashboardIntro
        title={`Welcome back, ${firstName}`}
        description="Here is what is happening with your bookings and services."
        action={
          <ButtonLink href="/services" size="sm">
            <Search className="h-4 w-4" aria-hidden="true" />
            Book a service
          </ButtonLink>
        }
      />
      <CustomerStats />
      <RecentBookings />
    </div>
  );
}
