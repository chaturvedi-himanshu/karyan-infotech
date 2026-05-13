import Image from "next/image";
import { getSiteSettings } from "@/lib/cms/getters";
import { normalizeImageSrc } from "@/lib/image/normalizeSrc";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Per-page heading; falls back to Site Settings -> Page header defaults. */
  title?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  /** Optional per-page cover image (e.g. project hero). Overrides global header image. */
  bgImage?: string;
  /** Legacy prop; kept for compatibility. Prefer `subheading`. */
  description?: string;
  /** Per-page subheading; falls back to Site Settings -> Page header defaults. */
  subheading?: string;
}

export default async function PageHeader({
  title,
  breadcrumbs = [],
  bgImage,
  description,
  subheading,
}: PageHeaderProps) {
  const settings = await getSiteSettings();
  const defaultHeader = settings.pageHeader;

  const resolvedBgRaw = bgImage?.trim() || defaultHeader.bgImage?.trim() || "";
  const resolvedBg = normalizeImageSrc(resolvedBgRaw);
  const resolvedTitle = title?.trim() || defaultHeader.heading.trim() || "Karyan Infratech";
  const resolvedSubheading = (subheading ?? description ?? defaultHeader.subheading)?.trim() || "";

  return (
    <header className="relative overflow-hidden border-b border-white/10">
      {resolvedBg ? (
        <div className="pointer-events-none absolute inset-0 z-0 min-h-[620px] w-full bg-theme-bg" aria-hidden>
          <Image
            src={resolvedBg}
            alt=""
            fill
            className="object-cover object-center scale-105"
            sizes="100vw"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-theme-bg" aria-hidden />
          <div
            className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-lux-gold/10 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-lux-gold-bright/5 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e4c76b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
        </>
      )}

      <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="flex w-full flex-col items-center gap-8 text-center">
          <div className="max-w-4xl">
            <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_8px_32px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {resolvedTitle}
            </h1>
            {resolvedSubheading ? (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] sm:text-base">
                {resolvedSubheading}
              </p>
            ) : (
              <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-lux-gold-bright to-lux-gold/30" />
            )}
          </div>

          {/* <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 [text-shadow:0_1px_2px_rgba(0,0,0,0.65)]"
          >
            <Link
              href="/"
              className="rounded-md px-2 py-1 text-white/90 transition hover:bg-white/10 hover:text-lux-gold-bright"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-lux-gold-dim/80"
                  aria-hidden
                />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded-md px-2 py-1 text-white/90 transition hover:bg-white/10 hover:text-lux-gold-bright"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="rounded-md px-2 py-1 text-lux-gold-bright">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav> */}
        </div>
      </div>
    </header>
  );
}
