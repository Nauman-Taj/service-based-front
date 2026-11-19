"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonStyles } from "@/components/common/Button";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  return (
    <div id="mobile-menu" className="border-t border-line bg-card md:hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-4 sm:px-6">
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {mainNav.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-body hover:bg-slate-100 hover:text-heading",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
          <Link
            href="/login"
            onClick={onClose}
            className={buttonStyles("outline", "md")}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className={buttonStyles("primary", "md")}
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
