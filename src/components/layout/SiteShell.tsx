import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

interface SiteShellProps {
  children: ReactNode;
}

/**
 * Shared chrome for public-facing pages.
 * Dashboard and authentication routes are intentionally excluded.
 */
export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
