import type { ReactNode } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout role="provider">{children}</DashboardLayout>;
}
