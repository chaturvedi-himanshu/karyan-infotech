"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Building2,
  Landmark,
  Home,
} from "lucide-react";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { DEFAULT_HEADER_LOGO_SRC } from "@/lib/cms/defaults/siteSettings";
import type { SiteNavPayload } from "@/lib/cms/types";

export default function NavbarClient({ nav }: { nav: SiteNavPayload }) {
  const { openEnquiry } = useEnquiry();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [mobileResOpen, setMobileResOpen] = useState(false);
  const [mobileComOpen, setMobileComOpen] = useState(false);
  const [deskProjectsOpen, setDeskProjectsOpen] = useState(false);
  const deskProjectsWrapRef = useRef<HTMLDivElement>(null);

  const { residentialProjects, commercialProjects, mainLinks, topBar } = nav;
  const headerLogoSrc = nav.headerLogoSrc?.trim() || DEFAULT_HEADER_LOGO_SRC;
  const headerLogoAlt = nav.headerLogoAlt?.trim() || "Karyan Infratech";

  const closeAllNav = useCallback(() => {
    setMobileOpen(false);
    setMobileProjectsOpen(false);
    setMobileResOpen(false);
    setMobileComOpen(false);
    setDeskProjectsOpen(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      closeAllNav();
    });
  }, [pathname, closeAllNav]);

  useEffect(() => {
    if (!deskProjectsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = deskProjectsWrapRef.current;
      if (el && !el.contains(e.target as Node)) setDeskProjectsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [deskProjectsOpen]);

  const active = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const projectActive = [...residentialProjects, ...commercialProjects].some(
    (p) => pathname === p.href || pathname.startsWith(`${p.href}/`)
  );

  return (
    <>
      <div className="border-b border-theme-bg-soft bg-theme-bg text-[11px] font-medium uppercase tracking-[0.2em] text-theme-on-bg-muted">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <a
            href={topBar.phoneHref}
            className="inline-flex items-center gap-2 text-theme-on-bg transition hover:text-theme-on-bg-muted"
          >
            <Phone className="h-3.5 w-3.5 text-theme-on-bg-subtle" />
            {topBar.phone}
          </a>
          <div className="flex items-center gap-5">
            {topBar.regionLabel ? (
              <span className="hidden sm:inline">{topBar.regionLabel}</span>
            ) : null}
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="text-theme-on-bg transition hover:text-theme-on-bg-muted"
            >
              {topBar.enquireLabel ?? "Enquire"}
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-100 border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <div className="relative z-10 flex shrink-0 items-center">
            <SiteBrandLogo
              src={headerLogoSrc}
              alt={headerLogoAlt}
              variant="onLight"
              className="h-9 max-h-11 w-auto max-w-[min(100vw-8rem,200px)] sm:h-11"
              priority
            />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {mainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active(l.href)
                    ? "text-lux-gold-dim"
                    : "text-theme-fg hover:text-theme-fg-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div ref={deskProjectsWrapRef} className="relative px-1">
              <button
                type="button"
                aria-expanded={deskProjectsOpen}
                aria-haspopup="true"
                onClick={() => setDeskProjectsOpen((o) => !o)}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  projectActive
                    ? "text-lux-gold-dim"
                    : "text-theme-fg hover:text-theme-fg-soft"
                } ${deskProjectsOpen ? "text-theme-fg" : ""}`}
              >
                Projects
                <ChevronDown
                  className={`h-4 w-4 opacity-60 transition ${deskProjectsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {deskProjectsOpen ? (
                <div className="absolute right-0 top-full z-50 w-[min(100vw-2rem,560px)] pt-3">
                  <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="border-r border-stone-100 bg-stone-50/90 p-5">
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-dim">
                        <Home className="h-3.5 w-3.5 shrink-0" />
                        Residential
                      </div>
                      <p className="mb-4 text-xs text-stone-500">Premium residences</p>
                      <div className="flex flex-col gap-1">
                        {residentialProjects.map((p) => (
                          <Link
                            key={p.href}
                            href={p.href}
                            onClick={() => setDeskProjectsOpen(false)}
                            className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-theme-fg transition hover:border-theme-bg-soft hover:bg-white"
                          >
                            {p.name}
                            <span className="mt-0.5 block text-[11px] font-normal text-stone-500">
                              {p.tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-dim">
                        <Landmark className="h-3.5 w-3.5 shrink-0" />
                        Commercial
                      </div>
                      <p className="mb-4 text-xs text-stone-500">Retail, offices & malls</p>
                      <div className="flex flex-col gap-1">
                        {commercialProjects.map((p) => (
                          <Link
                            key={p.href}
                            href={p.href}
                            onClick={() => setDeskProjectsOpen(false)}
                            className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-theme-fg transition hover:border-theme-bg-soft hover:bg-lux-cream/60"
                          >
                            {p.name}
                            <span className="mt-0.5 block text-[11px] font-normal text-stone-500">
                              {p.tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="hidden rounded-md bg-theme-bg-muted px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-theme-on-bg transition hover:bg-theme-bg-elevated sm:inline-block"
            >
              Book visit
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-stone-200 p-2.5 text-theme-fg lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-stone-100 bg-white px-4 py-5 lg:hidden">
            <div className="mx-auto flex max-w-lg flex-col gap-1">
              {mainLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeAllNav}
                  className="rounded-lg px-3 py-3 text-base font-medium text-theme-fg hover:bg-lux-cream"
                >
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setMobileProjectsOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-theme-fg hover:bg-lux-cream"
              >
                Projects
                <ChevronDown
                  className={`h-4 w-4 transition ${mobileProjectsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileProjectsOpen && (
                <div className="ml-2 border-l-2 border-lux-gold/40 pl-3">
                  <button
                    type="button"
                    onClick={() => setMobileResOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-lux-gold-dim"
                  >
                    Residential
                    <ChevronDown
                      className={`h-3.5 w-3.5 ${mobileResOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileResOpen &&
                    residentialProjects.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={closeAllNav}
                        className="block py-2 pl-2 text-sm text-theme-fg"
                      >
                        {p.name}
                      </Link>
                    ))}
                  <button
                    type="button"
                    onClick={() => setMobileComOpen((v) => !v)}
                    className="mt-2 flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-lux-gold-dim"
                  >
                    Commercial
                    <ChevronDown
                      className={`h-3.5 w-3.5 ${mobileComOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileComOpen &&
                    commercialProjects.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={closeAllNav}
                        className="block py-2 pl-2 text-sm text-theme-fg"
                      >
                        {p.name}
                      </Link>
                    ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openEnquiry();
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-theme-bg-muted py-3 text-sm font-semibold uppercase tracking-widest text-theme-on-bg"
              >
                <Building2 className="h-4 w-4" />
                Book a site visit
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
