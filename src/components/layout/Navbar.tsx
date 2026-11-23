"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import Logo from "@/components/common/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import NavAuthActions from "@/components/layout/NavAuthActions";
import NavLinkItem from "@/components/layout/NavLinkItem";
import { mainNav } from "@/data/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-card">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNav.map((link) => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              label={link.label}
              pathname={pathname}
              variant="desktop"
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <NavAuthActions variant="desktop" />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-heading transition-colors hover:bg-slate-100 md:hidden"
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <MobileMenu open={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
