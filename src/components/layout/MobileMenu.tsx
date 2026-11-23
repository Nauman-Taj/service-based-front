"use client";

import { usePathname } from "next/navigation";

import NavLinkItem from "@/components/layout/NavLinkItem";
import NavAuthActions from "@/components/layout/NavAuthActions";
import { mainNav } from "@/data/navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
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
          {mainNav.map((link) => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              label={link.label}
              pathname={pathname}
              variant="mobile"
              onNavigate={onClose}
            />
          ))}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
          <NavAuthActions variant="mobile" onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
