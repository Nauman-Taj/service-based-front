import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import Logo from "@/components/common/Logo";
import { SITE } from "@/lib/constants";

/**
 * Full-page chrome for the auth pages: the brand logo centred above a
 * single form card on the light app background. No split-screen panel.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-10 sm:px-6">
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-muted">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-heading"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to homepage
            </Link>
          </p>
        </div>
      </main>

      <p className="mt-10 text-center text-xs text-muted">
        &copy; {SITE.copyrightYear} {SITE.name}. All rights reserved.
      </p>
    </div>
  );
}
