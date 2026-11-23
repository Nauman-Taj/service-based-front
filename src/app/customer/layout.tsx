import type { ReactNode } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout role="customer">{children}</DashboardLayout>;
}
