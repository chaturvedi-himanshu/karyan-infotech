"use client";

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
    <footer className="border-t border-stone-200/90 bg-lux-navy text-stone-400">
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
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-bright">
              Explore
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footer.explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-lux-gold-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-bright">
              Residential
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footer.residential.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-lux-gold-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-bright">
              Commercial
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footer.commercial.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-lux-gold-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-bright">
              Contact
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={footer.contactPhoneHref}
                  className="transition hover:text-lux-gold-bright"
                >
                  {footer.contactPhone}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="text-left transition hover:text-lux-gold-bright"
                >
                  Enquiry form
                </button>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-lux-gold-bright">
                  Contact &amp; map
                </Link>
              </li>
            </ul>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-bright">
              Social
            </p>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm">
              {footer.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-lux-gold-bright"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 text-xs leading-relaxed text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {footer.legalLine}
            {footer.disclaimerExtra ? (
              <span className="mt-2 block max-w-xl text-[11px] md:mt-1">{footer.disclaimerExtra}</span>
            ) : null}
          </p>
          <a href="#top" className="shrink-0 text-lux-gold-bright transition hover:text-white">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
