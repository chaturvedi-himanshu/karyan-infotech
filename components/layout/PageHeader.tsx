import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  /** Optional cover image (e.g. project hero). Falls back to rich navy gradient. */
  bgImage?: string;
  /** Short line under the title */
  description?: string;
}

export default function PageHeader({
  title,
  breadcrumbs = [],
  bgImage,
  description,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/10">
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_100%_120%_at_12%_45%,rgba(0,0,0,0.55),transparent_62%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-theme-bg/78 via-theme-bg/48 to-theme-bg/22"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-theme-bg/88 via-theme-bg/28 to-theme-bg/38"
            aria-hidden
          />
        </>
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

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="h-px w-8 shrink-0 bg-lux-gold-bright/80" aria-hidden />
              <SiteBrandLogo
                variant="onDark"
                asLink={false}
                className="h-7 w-auto max-w-[160px] opacity-95 sm:h-8 sm:max-w-[200px]"
              />
            </div>
            <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_8px_32px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] sm:text-base">
                {description}
              </p>
            ) : (
              <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-lux-gold-bright to-lux-gold/30" />
            )}
          </div>

          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-1 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 [text-shadow:0_1px_2px_rgba(0,0,0,0.65)]"
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
          </nav>
        </div>
      </div>
    </header>
  );
}
