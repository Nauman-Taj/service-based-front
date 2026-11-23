import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import Logo from "@/components/common/Logo";
import { footerNav } from "@/data/navigation";
import { SITE } from "@/lib/constants";

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-heading text-slate-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              {SITE.description}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-white"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <a
                  href={SITE.phoneHref}
                  className="transition-colors hover:text-white"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  {SITE.addressLine1}
                  <br />
                  {SITE.addressLine2}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{SITE.hours}</span>
              </li>
            </ul>
          </div>

          <FooterColumn title="Company" links={footerNav.company} />
          <FooterColumn title="For Customers" links={footerNav.customers} />
          <FooterColumn title="For Providers" links={footerNav.providers} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6 text-center text-sm sm:flex-row">
          <p>
            &copy; {SITE.copyrightYear} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
