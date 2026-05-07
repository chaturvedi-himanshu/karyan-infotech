"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Landmark,
  Phone,
} from "lucide-react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { DEFAULT_HEADER_LOGO_SRC } from "@/lib/cms/defaults/siteSettings";
import type { SiteNavPayload } from "@/lib/cms/types";

function typeHref(type: string): string {
  return `/projects?type=${encodeURIComponent(type.toLowerCase())}`;
}

export default function NavbarClient({
  nav,
  projectTypes = [],
}: {
  nav: SiteNavPayload;
  projectTypes?: string[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [deskProjectsOpen, setDeskProjectsOpen] = useState(false);
  const deskProjectsWrapRef = useRef<HTMLDivElement>(null);

  const { mainLinks, topBar } = nav;
  const callLabel = topBar.phone?.trim() || "Call us";
  const callHref = topBar.phoneHref?.trim() || "tel:";
  const headerLogoSrc = nav.headerLogoSrc?.trim() || DEFAULT_HEADER_LOGO_SRC;
  const headerLogoAlt = nav.headerLogoAlt?.trim() || "Karyan Infratech";

  const closeAllNav = useCallback(() => {
    setMobileOpen(false);
    setMobileProjectsOpen(false);
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

  const projectActive = pathname === "/projects" || pathname.startsWith("/projects/");
  const typeLinks = (projectTypes.length ? projectTypes : ["residential", "commercial"])
    .map((type) => type.trim())
    .filter(Boolean);

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-md">
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

          <div className="hidden items-center gap-3 lg:flex">
            <nav className="flex items-center gap-1">
              {mainLinks.slice(0, 2).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-2 text-base font-medium transition ${
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
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-base font-medium transition ${
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
                  <div className="absolute left-0 right-0 top-full z-50 mx-auto w-[min(100vw-2rem,320px)] pt-3">
                    <div className="overflow-hidden rounded-xl border border-stone-200/90 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                      {typeLinks.map((type) => (
                        <Link
                          key={type}
                          href={typeHref(type)}
                          onClick={() => setDeskProjectsOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-theme-fg transition hover:bg-lux-cream"
                        >
                          <Landmark className="h-4 w-4 shrink-0 text-lux-gold-dim" />
                          {type}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {mainLinks.slice(2).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-2 text-base font-medium transition ${
                    active(l.href)
                      ? "text-lux-gold-dim"
                      : "text-theme-fg hover:text-theme-fg-soft"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <a
              href={callHref}
              className="hidden items-center gap-2 rounded-md border border-stone-200/90 bg-lux-ivory px-3 py-2.5 text-sm font-semibold tabular-nums text-theme-fg transition hover:border-lux-gold/40 hover:bg-lux-cream hover:text-lux-gold-dim sm:inline-flex"
            >
              <Phone className="h-4 w-4 shrink-0 text-lux-gold-dim" aria-hidden />
              <span>{callLabel}</span>
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-stone-200 p-2.5 text-theme-fg lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
                  {typeLinks.map((type, index) => (
                    <Link
                      key={type}
                      href={typeHref(type)}
                      onClick={closeAllNav}
                      className={`${index > 0 ? "mt-2 " : ""}flex items-center gap-2 py-2 text-sm font-semibold uppercase tracking-wide text-lux-gold-dim`}
                    >
                      <Landmark className="h-4 w-4 shrink-0" />
                      {type}
                    </Link>
                  ))}
                </div>
              )}
              <a
                href={callHref}
                onClick={() => setMobileOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200 bg-lux-ivory py-3 text-sm font-semibold tabular-nums text-theme-fg transition hover:border-lux-gold/40 hover:bg-lux-cream"
              >
                <Phone className="h-4 w-4 shrink-0 text-lux-gold-dim" aria-hidden />
                {callLabel}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
