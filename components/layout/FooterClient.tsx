"use client";

import Image from "next/image";
import Link from "next/link";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import type { SiteFooterPayload } from "@/lib/cms/types";

export default function FooterClient({
  footer,
  logoSrc,
  logoAlt,
}: {
  footer: SiteFooterPayload;
  logoSrc?: string;
  logoAlt?: string;
}) {
  const { openEnquiry } = useEnquiry();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-theme-bg-soft bg-theme-bg text-theme-on-bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <SiteBrandLogo
              src={logoSrc}
              alt={logoAlt}
              variant="onDark"
              className="h-10 w-auto max-w-[200px] sm:h-11"
            />
            <p className="mt-6 text-sm leading-relaxed">{footer.tagline}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-theme-on-bg-subtle">
              Explore
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footer.explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-theme-on-bg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-theme-on-bg-subtle">
              Residential
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footer.residential.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-theme-on-bg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-theme-on-bg-subtle">
              Commercial
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footer.commercial.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-theme-on-bg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-theme-on-bg-subtle">
              Contact
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={footer.contactPhoneHref}
                  className="transition hover:text-theme-on-bg"
                >
                  {footer.contactPhone}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="text-left transition hover:text-theme-on-bg"
                >
                  Enquiry form
                </button>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-theme-on-bg">
                  Contact &amp; map
                </Link>
              </li>
            </ul>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-theme-on-bg-subtle">
              Social
            </p>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm">
              {footer.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-theme-on-bg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-theme-bg-soft pt-8 text-base leading-relaxed text-theme-on-bg-subtle lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 space-y-3">
            <p>© {year} {footer.legalLine}</p>
            {footer.disclaimerExtra ? (
              <p className="max-w-3xl">{footer.disclaimerExtra}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <span className="text-base font-medium text-theme-on-bg-subtle">
              Designed and developed by
            </span>
            <Image
              src="/images/sysneticindialogo.png"
              alt="Sysnetic India — Serves your purpose better"
              width={220}
              height={56}
              className="h-9 w-auto max-w-[min(100%,220px)] object-contain object-left opacity-95 transition-opacity hover:opacity-100 sm:h-10 lg:object-right"
            />
          </div>
          
        </div>
      </div>
    </footer>
  );
}
