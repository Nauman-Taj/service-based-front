import type { Metadata } from "next";
import { Suspense } from "react";

import AdminServiceEditor from "@/components/admin/AdminServiceEditor";

export const metadata: Metadata = {
  title: "Edit Service",
  description: "Edit an individual service in the admin catalogue.",
};

export default function AdminServiceDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-line bg-card p-8 text-center text-sm text-muted shadow-sm">
          Loading service editor...
        </div>
      }
    >
      <AdminServiceEditor />
    </Suspense>
  );
}
