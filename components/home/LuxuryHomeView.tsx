import Link from "next/link";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryProvider";
import { ArrowRight, Award, CheckCircle2, Phone } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import HomeSiteProjectsSection from "@/components/home/HomeSiteProjectsSection";
import SectionBgStack from "@/components/decor/SectionBgStack";
import SectionWave from "@/components/decor/SectionWave";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import type { HomePayload } from "@/lib/cms/types";
import { getLucideIcon } from "@/lib/cms/icons";

export default function LuxuryHomeView({
  data,
  projectsList,
  brandLogoSrc,
  brandLogoAlt,
}: {
  data: HomePayload;
  projectsList: ProjectsListPayload;
  brandLogoSrc?: string;
  brandLogoAlt?: string;
}) {
  return (
    <>
      <HeroSlider
        slides={data.heroSlides}
        sideStats={data.heroSideStats}
        brandLogoSrc={brandLogoSrc}
        brandLogoAlt={brandLogoAlt}
      />

      {/* Wave into light band */}
      <div className="relative z-20 -mt-14 overflow-hidden bg-lux-ivory md:-mt-20">
        <SectionBgStack
          layers={[
            {
              variant: "waveFluid",
              wrapClassName: "inset-x-0 -top-[35%] bottom-0 h-[150%]",
              opacityClassName: "opacity-[0.32]",
            },
            {
              variant: "meshPremium",
              wrapClassName: "inset-0",
              opacityClassName: "opacity-[0.12] text-lux-navy",
            },
          ]}
        />
        <SectionWave
          fill="fill-lux-ivory"
          className="relative z-10 drop-shadow-sm"
        />
      </div>

      {/* Stats — glass cards, mesh blobs */}
      <section className="relative z-10 overflow-hidden bg-gradient-to-b from-lux-ivory via-lux-cream/80 to-lux-cream pb-6 pt-2">
        <SectionBgStack
          topGlow
          bottomGlow
          grain
          layers={[
            {
              variant: "meshPremium",
              opacityClassName: "text-lux-navy",
            },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-[0.42] mix-blend-multiply",
            },
            {
              variant: "orbRings",
              wrapClassName:
                "-right-1/4 top-1/2 h-[130%] w-[58%] -translate-y-1/2",
              opacityClassName: "rotate-6 opacity-[0.22]",
            },
            {
              variant: "ribbonArcs",
              wrapClassName: "-left-1/3 top-0 h-2/3 w-2/3",
              opacityClassName: "opacity-[0.12]",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.statCards.map((m) => (
              <div
                key={m.label}
                className="group rounded-2xl border border-lux-ivory/70 bg-lux-ivory/70 p-6 shadow-[0_20px_60px_-24px_rgba(10,22,40,0.25)] ring-1 ring-lux-gold/15 backdrop-blur-md transition hover:-translate-y-0.5 hover:ring-lux-gold/35"
              >
                <p className="font-display bg-gradient-to-br from-theme-bg to-theme-bg-elevated bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
                  {m.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-lux-navy">
                  {m.label}
                </p>
                {m.sub.trim() ? (
                  <p className="mt-1 text-xs text-stone-500">{m.sub}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeSiteProjectsSection payload={projectsList} />

      {/* Philosophy */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lux-cream via-lux-ivory to-lux-cream">
        <SectionBgStack
          diagonalSheen
          bottomGlow
          grain
          layers={[
            { variant: "blobOrganic", opacityClassName: "opacity-90" },
            {
              variant: "meshPremium",
              opacityClassName:
                "opacity-[0.26] mix-blend-multiply text-lux-navy",
            },
            {
              variant: "gradientMesh",
              wrapClassName: "right-0 top-0 h-full w-1/2",
              opacityClassName: "opacity-20",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:flex lg:items-center lg:gap-20 lg:px-8 lg:py-28">
          <div className="max-w-xl lg:max-w-md">
            <span className="inline-flex items-center rounded-full border border-lux-gold/30 bg-lux-ivory/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-gold-dim shadow-sm backdrop-blur">
              {data.philosophy.badge}
            </span>
            <h2 className="font-display mt-6 text-3xl font-medium leading-tight text-lux-navy sm:text-4xl lg:text-[2.75rem]">
              {data.philosophy.title}
            </h2>
          </div>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-stone-700 lg:mt-0 lg:text-lg">
            {data.philosophy.body}
          </p>
        </div>
      </section>

      <div className="relative overflow-hidden bg-lux-ivory">
        <SectionBgStack
          layers={[
            {
              variant: "meshPremium",
              opacityClassName: "opacity-[0.12] text-lux-navy",
            },
            {
              variant: "waveFluid",
              wrapClassName: "bottom-0 left-0 right-0 h-32",
              opacityClassName: "opacity-20",
            },
          ]}
        />
        <SectionWave
          fill="fill-lux-ivory"
          className="relative z-10 bg-lux-ivory"
        />
      </div>

      {/* Capabilities — ribbon + cards like service tiles */}
      <section className="relative overflow-hidden bg-lux-ivory pb-20 pt-4">
        <SectionBgStack
          topGlow
          grain
          layers={[
            { variant: "ribbonArcs", opacityClassName: "opacity-85" },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-[0.48] mix-blend-multiply",
            },
            {
              variant: "gradientMesh",
              wrapClassName: "-right-1/3 bottom-0 top-0 w-2/3",
              opacityClassName: "opacity-[0.18]",
            },
            {
              variant: "orbRings",
              wrapClassName: "left-[-12%] top-1/4 h-[70%] w-[45%]",
              opacityClassName: "opacity-[0.1]",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lux-gold-dim">
              {data.capabilitiesIntro.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-medium text-lux-navy sm:text-4xl">
              {data.capabilitiesIntro.title}
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {data.capabilities.map(({ title, text, icon }) => {
              const Icon = getLucideIcon(icon);
              return (
                <div
                  key={title}
                  className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-lux-ivory to-lux-cream/70 p-8 shadow-[0_24px_50px_-28px_rgba(10,22,40,0.18)] ring-1 ring-lux-gold/10 transition hover:shadow-[0_28px_60px_-24px_rgba(198,160,82,0.2)]"
                >
                  <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-lux-gold/10 blur-2xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-theme-bg text-lux-gold-bright shadow-lg">
                    <Icon className="h-7 w-7" strokeWidth={1.35} />
                  </div>
                  <h3 className="font-display relative mt-6 text-xl font-medium text-lux-navy">
                    {title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-stone-600">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="relative overflow-hidden bg-gradient-to-b from-lux-cream to-lux-ivory py-20 lg:py-28">
        <SectionBgStack
          diagonalSheen
          bottomGlow
          grain
          layers={[
            {
              variant: "orbRings",
              wrapClassName:
                "-right-32 top-1/2 h-[140%] w-[58%] -translate-y-1/2",
              opacityClassName: "opacity-[0.72]",
            },
            {
              variant: "meshPremium",
              wrapClassName: "-left-1/4 -top-20 h-[85%] w-[55%]",
              opacityClassName: "opacity-[0.16] text-lux-navy",
            },
            {
              variant: "waveFluid",
              wrapClassName: "bottom-0 left-0 right-0 h-44",
              opacityClassName: "opacity-[0.22]",
            },
            {
              variant: "blobOrganic",
              wrapClassName: "left-1/3 top-full h-1/2 w-full -translate-y-full",
              opacityClassName: "opacity-[0.12]",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
                {data.portfolioIntro.eyebrow}
              </p>
              <h2 className="font-display mt-2 text-3xl font-medium text-lux-navy sm:text-4xl">
                {data.portfolioIntro.title}
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[#ead7b0]/70 bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110"
            >
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {data.portfolio.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-lux-ivory p-6 shadow-md ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:border-lux-gold/40 hover:shadow-xl"
              >
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.22em] text-lux-gold-dim">
                  {p.tag}
                </span>
                <span className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-lux-gold/25 to-transparent opacity-0 blur-xl transition group-hover:opacity-100" />
                <h3 className="font-display relative z-10 mt-3 text-xl font-medium text-lux-navy group-hover:text-lux-gold-dim">
                  {p.name}
                </h3>
                <p className="relative z-10 mt-2 flex-1 text-sm text-stone-600">
                  {p.blurb}
                </p>
                <span className="relative z-10 mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lux-navy">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="relative overflow-hidden bg-lux-ivory py-20 lg:py-28">
        <SectionBgStack
          edgeFade="light"
          topGlow
          grain
          layers={[
            { variant: "scatterDots", opacityClassName: "opacity-[0.58]" },
            {
              variant: "ribbonArcs",
              wrapClassName: "inset-x-0 -top-24 h-72",
              opacityClassName: "opacity-[0.22]",
            },
            {
              variant: "orbRings",
              wrapClassName:
                "left-1/2 top-1/2 h-[125%] w-full -translate-x-1/2 -translate-y-1/2",
              opacityClassName: "opacity-[0.07]",
            },
            {
              variant: "meshPremium",
              wrapClassName: "-right-1/4 bottom-0 h-3/4 w-1/2",
              opacityClassName: "opacity-[0.1] text-lux-navy",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
              {data.whyIntro.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-medium text-lux-navy sm:text-4xl">
              {data.whyIntro.title}
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {data.pillars.map(({ title, text, icon }) => {
              const Icon = getLucideIcon(icon);
              return (
                <div
                  key={title}
                  className="rounded-3xl border border-stone-200/90 bg-gradient-to-b from-lux-ivory to-lux-cream/50 p-8 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lux-gold/15 text-lux-gold-dim">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display mt-7 text-xl font-medium text-lux-navy">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promises checklist */}
      <section className="relative overflow-hidden border-y border-stone-200/80 bg-lux-cream py-16 lg:py-20">
        <SectionBgStack
          topGlow
          grain
          layers={[
            { variant: "waveFluid", opacityClassName: "opacity-45" },
            {
              variant: "meshPremium",
              opacityClassName:
                "opacity-[0.2] mix-blend-multiply text-lux-navy",
            },
            {
              variant: "stackWaves",
              wrapClassName: "bottom-0 left-0 right-0 h-52",
              opacityClassName: "opacity-30",
            },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-25",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
                {data.promisesIntro.eyebrow}
              </p>
              <h2 className="font-display mt-3 text-3xl font-medium text-lux-navy sm:text-4xl">
                {data.promisesIntro.title}
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {data.promises.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-2xl border border-stone-200/80 bg-lux-ivory/95 px-4 py-3 text-sm text-stone-700 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lux-gold-dim" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Wave into dark process */}
      <div className="relative overflow-hidden bg-lux-cream">
        <SectionBgStack
          layers={[
            {
              variant: "blobOrganic",
              opacityClassName: "opacity-[0.14]",
            },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-20 mix-blend-multiply",
            },
          ]}
        />
        <SectionWave
          fill="fill-theme-bg"
          className="relative z-10 bg-lux-cream"
        />
      </div>

      {/* Process */}
      <section className="relative overflow-hidden bg-theme-bg pb-24 pt-4 text-stone-200">
        <SectionBgStack
          edgeFade="dark"
          bottomGlow
          grain
          layers={[
            { variant: "gradientMesh", opacityClassName: "opacity-80" },
            {
              variant: "stackWaves",
              wrapClassName: "bottom-0 left-0 right-0 h-48",
              opacityClassName: "opacity-45",
            },
            {
              variant: "orbRings",
              wrapClassName: "-right-28 -top-28 h-[55%] w-[48%]",
              opacityClassName: "opacity-15",
            },
            {
              variant: "ribbonArcs",
              wrapClassName: "-left-36 bottom-0 h-2/3 w-4/5",
              opacityClassName: "opacity-12",
            },
            {
              variant: "meshPremium",
              wrapClassName: "left-1/4 top-0 h-1/2 w-full",
              opacityClassName: "opacity-[0.08]",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lux-gold-bright">
              {data.processIntro.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-medium text-white sm:text-4xl">
              {data.processIntro.title}
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.process.map((s) => (
              <div
                key={s.step}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md"
              >
                <span className="font-display text-4xl text-lux-gold-bright/95">
                  {s.step}
                </span>
                <h3 className="font-display mt-5 text-lg font-medium text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden bg-theme-bg">
        <SectionBgStack
          layers={[
            {
              variant: "orbRings",
              wrapClassName:
                "left-1/2 top-full h-48 w-full -translate-x-1/2 -translate-y-full",
              opacityClassName: "opacity-15",
            },
            {
              variant: "waveFluid",
              wrapClassName: "inset-x-0 bottom-0 h-28",
              opacityClassName: "opacity-20",
            },
          ]}
        />
        <SectionWave
          fill="fill-lux-ivory"
          flip
          className="relative z-10 bg-theme-bg"
        />
      </div>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-lux-ivory py-20 lg:py-28">
        <SectionBgStack
          topGlow
          diagonalSheen
          grain
          layers={[
            {
              variant: "gradientMesh",
              wrapClassName: "left-0 top-0 h-full w-2/3 max-w-3xl",
              opacityClassName: "opacity-65",
            },
            {
              variant: "blobOrganic",
              wrapClassName: "-right-1/4 bottom-0 h-[92%] w-[58%]",
              opacityClassName: "opacity-38",
            },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-28 mix-blend-multiply",
            },
            {
              variant: "waveFluid",
              wrapClassName: "bottom-0 left-0 right-0 h-40",
              opacityClassName: "opacity-18",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
                {data.testimonialsIntro.eyebrow}
              </p>
              <h2 className="font-display mt-2 max-w-xl text-3xl font-medium text-lux-navy sm:text-4xl">
                {data.testimonialsIntro.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-lux-gold/25 bg-lux-ivory/90 px-4 py-2 text-sm text-stone-600 shadow-sm backdrop-blur">
              <Award className="h-5 w-5 text-lux-gold-dim" />
              {data.testimonialsIntro.badge}
            </div>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {data.testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-3xl border border-stone-200/90 bg-lux-ivory/95 p-9 shadow-[0_24px_50px_-32px_rgba(10,22,40,0.15)]"
              >
                <p className="font-display text-lg font-normal leading-relaxed text-lux-navy md:text-xl">
                  “{t.quote}”
                </p>
                <footer className="mt-8 border-t border-stone-100 pt-6">
                  <p className="text-sm font-semibold text-lux-navy">
                    {t.name}
                  </p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {/* <section className="relative overflow-hidden bg-lux-ivory py-20 lg:py-28">
        <SectionBgStack
          edgeFade="light"
          grain
          layers={[
            { variant: "meshPremium", opacityClassName: "text-lux-navy" },
            {
              variant: "orbRings",
              wrapClassName: "-right-1/4 top-1/4 h-[72%] w-1/2",
              opacityClassName: "opacity-18",
            },
            {
              variant: "waveFluid",
              wrapClassName: "bottom-0 left-0 right-0 h-40",
              opacityClassName: "opacity-18",
            },
            {
              variant: "ribbonArcs",
              wrapClassName: "left-0 top-0 h-1/2 w-3/4",
              opacityClassName: "opacity-10",
            },
          ]}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-lux-gold-dim">
            {data.faqIntro.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-center text-3xl font-medium text-lux-navy sm:text-4xl">
            {data.faqIntro.title}
          </h2>
          <div className="mt-12 space-y-3">
            {data.faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-stone-200/90 bg-lux-ivory/95 shadow-sm backdrop-blur open:ring-2 open:ring-lux-gold/20"
              >
                <summary className="cursor-pointer list-none px-5 py-4 pr-12 font-medium text-lux-navy transition marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-lux-gold-dim transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-stone-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-stone-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section> */}

      {/* Location */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lux-ivory via-lux-cream to-lux-cream py-20 lg:py-28">
        <SectionBgStack
          diagonalSheen
          bottomGlow
          grain
          layers={[
            {
              variant: "blobOrganic",
              wrapClassName: "bottom-0 right-0 h-3/4 w-3/5",
              opacityClassName: "opacity-58",
            },
            {
              variant: "meshPremium",
              wrapClassName: "left-0 top-0 h-full w-1/2",
              opacityClassName: "opacity-14 text-lux-navy",
            },
            {
              variant: "ribbonArcs",
              opacityClassName: "opacity-18",
            },
            {
              variant: "orbRings",
              wrapClassName: "left-[-8%] bottom-[-10%] h-1/2 w-1/2",
              opacityClassName: "opacity-10",
            },
          ]}
        />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
              {data.location.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-medium text-lux-navy sm:text-4xl">
              {data.location.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-stone-600">
              {data.location.body}
            </p>
            <ul className="mt-8 space-y-4 text-sm text-stone-700">
              {data.location.bullets.map((b) => {
                const BIcon = getLucideIcon(b.icon);
                return (
                  <li key={b.text} className="flex items-start gap-3">
                    <BIcon className="mt-0.5 h-5 w-5 shrink-0 text-lux-gold-dim" />
                    {b.text}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-3xl border border-stone-200/90 bg-lux-ivory/95 p-8 shadow-xl ring-1 ring-lux-gold/10 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lux-gold-dim">
              {data.location.corridorsTitle}
            </p>
            <ul className="mt-6 space-y-4 font-display text-lg text-lux-navy">
              {data.location.corridors.map((row, i) => (
                <li
                  key={row.corridor}
                  className={`flex justify-between ${i < data.location.corridors.length - 1 ? "border-b border-stone-200/80 pb-3" : "pb-1"}`}
                >
                  <span>{row.corridor}</span>
                  <span className="text-right text-sm font-sans font-normal text-stone-500">
                    {row.projects}
                  </span>
                </li>
              ))}
            </ul>
            <EnquiryTrigger className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-[#ead7b0]/70 bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110">
              Plan a site tour
            </EnquiryTrigger>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="relative overflow-hidden border-t border-stone-200/80 bg-lux-ivory py-20 lg:py-28">
        <SectionBgStack
          topGlow
          grain
          layers={[
            { variant: "ribbonArcs", opacityClassName: "opacity-40" },
            {
              variant: "meshPremium",
              wrapClassName: "left-1/2 top-0 h-2/3 w-full -translate-x-1/2",
              opacityClassName: "opacity-11 text-lux-navy",
            },
            {
              variant: "stackWaves",
              wrapClassName: "bottom-0 left-0 right-0 h-40",
              opacityClassName: "opacity-22",
            },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-20 mix-blend-multiply",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
              {data.amenitiesIntro.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-medium text-lux-navy sm:text-4xl">
              {data.amenitiesIntro.title}
            </h2>
          </div>
          <ul className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-3">
            {data.amenities.map((a) => (
              <li
                key={a}
                className="rounded-full border border-stone-200/90 bg-gradient-to-r from-lux-ivory to-lux-cream/70 px-5 py-2.5 text-sm font-medium text-stone-700 shadow-sm"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Journal */}
      <section className="relative overflow-hidden bg-theme-bg py-20 text-stone-300 lg:py-28">
        <SectionBgStack
          edgeFade="dark"
          topGlow
          grain
          layers={[
            { variant: "meshPremium", opacityClassName: "opacity-48" },
            {
              variant: "gradientMesh",
              opacityClassName: "opacity-32 mix-blend-overlay",
            },
            {
              variant: "orbRings",
              wrapClassName: "-left-24 top-1/2 h-[85%] w-1/2 -translate-y-1/2",
              opacityClassName: "opacity-11",
            },
            {
              variant: "ribbonArcs",
              wrapClassName: "right-0 top-0 h-2/3 w-2/3",
              opacityClassName: "opacity-10",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lux-gold-bright">
                {data.journalIntro.eyebrow}
              </p>
              <h2 className="font-display mt-3 text-3xl font-medium text-white sm:text-4xl">
                {data.journalIntro.title}
              </h2>
            </div>
            <Link
              href={data.journalIntro.ctaHref}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-lux-gold-bright hover:text-white"
            >
              {data.journalIntro.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {data.journalTeasers.map((j) => (
              <Link
                key={j.title}
                href={j.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md transition hover:border-lux-gold/35 hover:bg-white/[0.09]"
              >
                <p className="font-display text-lg text-white group-hover:text-lux-gold-bright">
                  {j.title}
                </p>
                <p className="mt-2 text-sm text-stone-400">{j.hint}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-lux-gold-bright">
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="relative overflow-hidden bg-theme-bg py-16 text-stone-300 lg:py-20">
        <SectionBgStack
          bottomGlow
          edgeFade="dark"
          layers={[
            { variant: "scatterDots", opacityClassName: "opacity-40" },
            {
              variant: "gradientMesh",
              wrapClassName: "inset-x-0 top-0 h-1/2",
              opacityClassName: "opacity-22",
            },
            {
              variant: "waveFluid",
              wrapClassName: "bottom-0 left-0 right-0 h-36",
              opacityClassName: "opacity-22",
            },
            {
              variant: "meshPremium",
              opacityClassName: "opacity-12",
            },
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-lux-gold-bright">
            {data.ecosystem.eyebrow}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
            {data.ecosystem.body}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {data.ecosystem.tags.map((x) => (
              <span
                key={x}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[11px] font-semibold uppercase tracking-widest text-white/55"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Split CTA — phone + form */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lux-cream via-lux-ivory to-lux-cream py-20 lg:py-28">
        <SectionBgStack
          diagonalSheen
          topGlow
          bottomGlow
          grain
          layers={[
            { variant: "orbRings", opacityClassName: "opacity-32" },
            {
              variant: "blobOrganic",
              wrapClassName: "-left-1/3 top-0 h-full w-2/3",
              opacityClassName: "opacity-14",
            },
            {
              variant: "meshPremium",
              wrapClassName: "right-0 top-1/4 h-3/4 w-1/2",
              opacityClassName: "opacity-11 text-lux-navy",
            },
            {
              variant: "scatterDots",
              opacityClassName: "opacity-18 mix-blend-multiply",
            },
          ]}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div className="rounded-3xl border border-stone-200/90 bg-lux-ivory/95 p-10 shadow-xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lux-gold-dim">
              {data.splitCta.leftEyebrow}
            </p>
            <h2 className="font-display mt-4 text-3xl font-medium text-lux-navy">
              {data.splitCta.leftTitle}
            </h2>
            <a
              href={data.splitCta.phoneHref}
              className="mt-8 inline-flex items-center gap-3 text-2xl font-semibold text-lux-navy transition hover:text-lux-gold-dim"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-bg text-white">
                <Phone className="h-5 w-5" />
              </span>
              {data.splitCta.phone}
            </a>
            <p className="mt-4 text-sm text-stone-600">{data.splitCta.hours}</p>
          </div>
          <div className="flex flex-col justify-center rounded-3xl border border-lux-gold/25 bg-theme-bg p-10 text-center text-white shadow-2xl lg:text-left">
            <h3 className="font-display text-2xl font-medium">
              {data.splitCta.rightTitle}
            </h3>
            <p className="mt-3 text-sm text-stone-400">
              {data.splitCta.rightBody}
            </p>
            <EnquiryTrigger className="mt-8 inline-flex items-center justify-center rounded-xl border border-[#ead7b0]/70 bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110">
              {data.splitCta.rightCtaLabel}
            </EnquiryTrigger>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-lux-ivory pb-24 pt-8 lg:pb-32">
        <SectionBgStack
          topGlow
          edgeFade="light"
          grain
          layers={[
            {
              variant: "meshPremium",
              opacityClassName: "opacity-26 text-lux-navy",
            },
            {
              variant: "orbRings",
              wrapClassName: "-right-24 bottom-[-12%] h-[72%] w-[52%]",
              opacityClassName: "opacity-14",
            },
            {
              variant: "ribbonArcs",
              wrapClassName: "left-0 top-1/3 h-1/2 w-3/4",
              opacityClassName: "opacity-11",
            },
            {
              variant: "gradientMesh",
              wrapClassName: "left-1/2 top-0 h-1/2 w-full -translate-x-1/2",
              opacityClassName: "opacity-[0.08]",
            },
          ]}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-stone-200/90 bg-gradient-to-b from-lux-ivory to-lux-cream/80 p-10 shadow-[0_40px_80px_-40px_rgba(10,22,40,0.35)] ring-1 ring-lux-gold/15 sm:p-14">
            <h2 className="font-display text-3xl font-medium text-lux-navy sm:text-4xl">
              {data.finalCta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm text-stone-600 sm:text-base">
              {data.finalCta.body}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <EnquiryTrigger className="inline-flex min-w-[220px] items-center justify-center rounded-xl border border-[#ead7b0]/70 bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110">
                {data.finalCta.primaryLabel}
              </EnquiryTrigger>
              <Link
                href={data.finalCta.secondaryHref}
                className="inline-flex min-w-[220px] items-center justify-center rounded-xl border-2 border-lux-navy/20 px-10 py-4 text-sm font-semibold uppercase tracking-widest text-lux-navy transition hover:border-lux-gold/50"
              >
                {data.finalCta.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
