import Link from "next/link";
import Image from "next/image";
import CmsImage from "@/components/ui/CmsImage";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryProvider";
import LocationRichHtml from "@/components/home/LocationRichHtml";
import SplitContactSection from "@/components/home/SplitContactSection";
import { normalizeHomeLocation } from "@/lib/cms/normalizeHomeLocation";
import { normalizeHomeSplitContact } from "@/lib/cms/normalizeHomeSplitContact";
import { ArrowRight } from "lucide-react";
import { FaCity, FaLeaf, FaLightbulb, FaLandmark } from "react-icons/fa";
import HeroSlider from "@/components/home/HeroSlider";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";
import HomeSiteProjectsSection from "@/components/home/HomeSiteProjectsSection";
import OurPresenceBlock from "@/components/home/OurPresenceBlock";
import HomeBlogCarousel from "@/components/home/HomeBlogCarousel";
import SectionBgStack from "@/components/decor/SectionBgStack";
import SectionWave from "@/components/decor/SectionWave";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import type { BlogPostPayload, HomePayload } from "@/lib/cms/types";
import { getLucideIcon } from "@/lib/cms/icons";
import type { IconType } from "react-icons";

const HOME_SECTION_KEYS = [
  "stats",
  "projects",
  "philosophy",
  "capabilities",
  "presence",
  "why",
  "process",
  "testimonials",
  "location",
  "about",
  "journal",
  "splitCta",
] as const;

function capabilityReactIcon(title: string, text: string): IconType {
  const haystack = `${title} ${text}`.toLowerCase();
  if (haystack.includes("land") || haystack.includes("ground")) return FaLeaf;
  if (haystack.includes("generations") || haystack.includes("lasting"))
    return FaLandmark;
  if (haystack.includes("future") || haystack.includes("innovation"))
    return FaLightbulb;
  if (haystack.includes("beauty") || haystack.includes("function"))
    return FaCity;
  return FaCity;
}

const LOCATION_CTA_CLASS =
  "inline-flex w-full items-center justify-center rounded-xl border border-[#ead7b0]/70 bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lux-gold";

export default function LuxuryHomeView({
  data,
  projectsList,
  brandLogoSrc,
  brandLogoAlt,
  blogPosts,
}: {
  data: HomePayload;
  projectsList: ProjectsListPayload;
  brandLogoSrc?: string;
  brandLogoAlt?: string;
  blogPosts: BlogPostPayload[];
}) {
  const configured = Array.isArray(data.sectionOrder) ? data.sectionOrder : [];
  const normalizedSectionOrder = [
    ...configured.filter((id): id is (typeof HOME_SECTION_KEYS)[number] =>
      HOME_SECTION_KEYS.includes(id as (typeof HOME_SECTION_KEYS)[number]),
    ),
    ...HOME_SECTION_KEYS.filter((id) => !configured.includes(id)),
  ];
  const orderMap = new Map(
    normalizedSectionOrder.map((id, idx) => [id, (idx + 1) * 10] as const),
  );
  const sectionOrder = (id: (typeof HOME_SECTION_KEYS)[number]) =>
    orderMap.get(id) ?? 999;
  const location = normalizeHomeLocation(data.location);
  const splitContact = normalizeHomeSplitContact(data.splitCta);

  return (
    <>
      <HeroSlider
        slides={data.heroSlides}
        sideStats={data.heroSideStats}
        brandLogoSrc={brandLogoSrc}
        brandLogoAlt={brandLogoAlt}
      />

      <div className="flex flex-col">
        {/* Wave into light band */}
        <div style={{ order: sectionOrder("stats") }}>
        

          {/* Stats — glass cards, mesh blobs */}
          <section className="section-y relative z-10 overflow-hidden bg-gradient-to-b from-lux-ivory via-lux-cream/80 to-lux-cream">
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
                    <p className="font-display bg-gradient-to-br from-theme-bg to-theme-bg-elevated bg-clip-text text-4xl font-semibold text-transparent md:text-5xl">
                      {m.value}
                    </p>
                    <p className="mt-2 text-base font-semibold text-lux-navy md:text-lg">
                      {m.label}
                    </p>
                    {m.sub.trim() ? (
                      <p className="mt-1 text-sm text-stone-500">{m.sub}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div style={{ order: sectionOrder("projects") }}>
          <HomeSiteProjectsSection payload={projectsList} />
        </div>

        {/* Philosophy */}
        <section
          className="section-y relative overflow-hidden bg-gradient-to-br from-lux-cream via-lux-ivory to-lux-cream"
          style={{ order: sectionOrder("philosophy") }}
        >
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
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:flex lg:items-center lg:gap-16 lg:px-8">
            <HomeSectionHeading
              badge={data.philosophy.badge}
              title={data.philosophy.title}
              className="max-w-xl lg:max-w-md"
            />
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-stone-700 lg:mt-0 lg:text-lg">
              {data.philosophy.body}
            </p>
          </div>
        </section>

        <div style={{ order: sectionOrder("capabilities") }}>
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
          </div>

          {/* Capabilities — ribbon + cards like service tiles */}
          <section className="section-y relative overflow-hidden bg-lux-ivory">
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
              <HomeSectionHeading
                eyebrow={data.capabilitiesIntro.eyebrow}
                title={data.capabilitiesIntro.title}
              />
              <div className="mt-14 grid gap-6 sm:grid-cols-2">
                {data.capabilities.map(({ title, text, icon }) => {
                  const Icon = getLucideIcon(icon);
                  const ReactIcon = capabilityReactIcon(title, text);
                  return (
                    <div
                      key={title}
                      className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-lux-ivory to-lux-cream/70 p-8 shadow-[0_24px_50px_-28px_rgba(10,22,40,0.18)] ring-1 ring-lux-gold/10 transition hover:shadow-[0_28px_60px_-24px_rgba(198,160,82,0.2)]"
                    >
                      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-lux-gold/10 blur-2xl" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-theme-bg text-lux-gold-bright shadow-lg">
                        {/* Prefer rich semantic icon from react-icons for this themed content. */}
                        <ReactIcon className="h-7 w-7" />
                        <Icon className="hidden h-7 w-7" strokeWidth={1.35} />
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
        </div>

        {/* Our Presence */}
        <section
          className="section-y relative overflow-hidden bg-gradient-to-b from-lux-cream to-lux-ivory"
          style={{ order: sectionOrder("presence") }}
        >
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
                wrapClassName:
                  "left-1/3 top-full h-1/2 w-full -translate-y-full",
                opacityClassName: "opacity-[0.12]",
              },
            ]}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <OurPresenceBlock band={data.presence} />
          </div>
        </section>

        {/* Why */}
        <section
          className="section-y relative overflow-hidden bg-lux-ivory"
          style={{ order: sectionOrder("why") }}
        >
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
            <HomeSectionHeading
              eyebrow={data.whyIntro.eyebrow}
              title={data.whyIntro.title}
            />
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

        <div style={{ order: sectionOrder("process") }}>
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
          </div>

          {/* Process */}
          <section className="section-y relative overflow-hidden bg-theme-bg text-stone-200">
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
              <HomeSectionHeading
                eyebrow={data.processIntro.eyebrow}
                title={data.processIntro.title}
                variant="dark"
              />
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </div>

        {/* Testimonials */}
        {/* <section
        className="relative overflow-hidden bg-lux-ivory py-14 lg:py-20"
        style={{ order: sectionOrder("testimonials") }}
      >
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
      </section> */}

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
        <section
          className="section-y relative overflow-hidden bg-gradient-to-br from-lux-ivory via-lux-cream to-lux-cream"
          style={{ order: sectionOrder("location") }}
        >
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
              <HomeSectionHeading
                eyebrow={data.location.eyebrow}
                title={data.location.title}
                className="max-w-xl"
              />
              <p className="mt-6 text-base leading-relaxed text-stone-600">
                {data.location.body}
              </p>
              <LocationRichHtml html={location.bulletsHtml} className="mt-8" />
            </div>
            <div className="rounded-3xl border border-stone-200/90 bg-lux-ivory/95 p-8 shadow-xl ring-1 ring-lux-gold/10 backdrop-blur">
              <LocationRichHtml
                html={location.corridorsHtml}
                className="font-display text-lg text-lux-navy [&_li]:flex [&_li]:justify-between [&_li]:gap-4 [&_li]:border-b [&_li]:border-stone-200/80 [&_li]:pb-3 [&_li:last-child]:border-0 [&_li_span:last-child]:text-right [&_li_span:last-child]:text-sm [&_li_span:last-child]:font-sans [&_li_span:last-child]:font-normal [&_li_span:last-child]:text-stone-500"
              />
              <div className="mt-8 flex flex-col gap-3">
                {location.ctaButtons.map((btn, i) => (
                  <EnquiryTrigger
                    key={`${btn.label}-${i}`}
                    project={btn.project?.trim() || undefined}
                    className={LOCATION_CTA_CLASS}
                  >
                    {btn.label}
                  </EnquiryTrigger>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          className="section-y relative overflow-hidden bg-lux-ivory"
          style={{ order: sectionOrder("about") }}
        >
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
                variant: "meshPremium",
                wrapClassName: "-right-1/4 bottom-0 h-3/4 w-1/2",
                opacityClassName: "opacity-[0.1] text-lux-navy",
              },
              {
                variant: "stackWaves",
                wrapClassName: "bottom-0 left-0 right-0 h-40",
                opacityClassName: "opacity-[0.22]",
              },
            ]}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <HomeSectionHeading
                eyebrow={data.aboutSection.eyebrow}
                title={data.aboutSection.title}
              />
              <div
                className="mt-5 h-px w-14 bg-gradient-to-r from-lux-gold-dim to-transparent"
                aria-hidden
              />
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
              <div className="flex h-full flex-col rounded-3xl border border-stone-200/90 bg-gradient-to-b from-lux-ivory to-lux-cream/50 p-8 shadow-sm ring-1 ring-lux-gold/10">
                <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                  {data.aboutSection.description}
                </p>
                <ul className="mt-7 grid flex-1 gap-3 sm:grid-cols-2">
                  {data.aboutSection.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-stone-600"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lux-gold"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative min-h-[280px] overflow-hidden rounded-3xl border border-stone-200/90 shadow-sm ring-1 ring-lux-gold/10 lg:h-full lg:min-h-0">
                {data.aboutSection.logoSrc?.trim() ? (
                  <CmsImage
                    src={data.aboutSection.logoSrc}
                    alt={data.aboutSection.logoAlt || "Karyan about image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    fallback="/images/our-vision.webp"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-b from-lux-ivory to-lux-cream/50">
                    <p className="text-sm font-medium text-stone-500">
                      Upload About image from admin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Journal */}
        <section
          className="section-y relative overflow-hidden bg-theme-bg text-stone-300"
          style={{ order: sectionOrder("journal") }}
        >
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
                wrapClassName:
                  "-left-24 top-1/2 h-[85%] w-1/2 -translate-y-1/2",
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
                <HomeSectionHeading
                  eyebrow={data.journalIntro.eyebrow}
                  title={data.journalIntro.title}
                  variant="dark"
                />
              </div>
              <Link
                href={data.journalIntro.ctaHref}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-lux-gold-bright hover:text-white"
              >
                {data.journalIntro.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6">
              <HomeBlogCarousel posts={blogPosts} />
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        {/* <section className="relative overflow-hidden bg-theme-bg py-16 text-stone-300 lg:py-20">
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
      </section> */}

        {/* Split contact — gallery/video + contact bar */}
        <section
          className="section-y relative overflow-hidden bg-lux-ivory"
          style={{ order: sectionOrder("splitCta") }}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SplitContactSection data={splitContact} />
          </div>
        </section>
      </div>

      {/* Final CTA */}
      {/* <section className="relative overflow-hidden bg-lux-ivory pb-24 pt-8 lg:pb-32">
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
      </section> */}
    </>
  );
}
