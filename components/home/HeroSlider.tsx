"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Swiper from "swiper/bundle";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import PropertySvgBackdrop from "@/components/decor/PropertySvgBackdrop";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import type { HomeHeroSlide, HomePayload } from "@/lib/cms/types";

type HeroSlide = HomeHeroSlide;

const defaultSlides: HeroSlide[] = [
  {
    bg: "https://karyaninfratech.co.in/wp-content/uploads/2026/04/20260409_1252_Image-Generation_remix_01knrhxdp4exssq8ndhw9y4r45.png",
    title: "Trevana Residence",
    subtitle:
      "Premium residences taking shape on NH-24 — composed layouts, dignified arrival, and a clear path to handover.",
    tag: "Residential",
    project: "trevana",
    exploreHref: "/karyan-trevana",
  },
  {
    bg: "https://karyaninfratech.co.in/wp-content/uploads/2024/11/Karyan-CityWalk.jpg",
    title: "Karyan CityWalk",
    subtitle:
      "High-street retail energy along the Delhi–Meerut Expressway — visibility, servicing, and footfall logic built in.",
    tag: "Commercial",
    project: "citywalk",
    exploreHref: "/karyan-citywalk",
  },
  {
    bg: "https://karyaninfratech.co.in/wp-content/uploads/2024/11/Avenue-IV.jpg",
    title: "Avenue IV",
    subtitle:
      "Wave City’s flagship commercial canvas — frontages designed for brands that anchor a catchment.",
    tag: "Commercial",
    project: "avenue-iv",
    exploreHref: "/karyan-avenue-iv",
  },
  {
    bg: "https://karyaninfratech.co.in/wp-content/uploads/2024/11/Karyan-Square.jpg",
    title: "Karyan Square",
    subtitle:
      "Retail and office plates on NH-24 — where daily traffic meets disciplined execution.",
    tag: "Commercial",
    project: "square",
    exploreHref: "/karyan-square",
  },
];

const defaultSideStats: HomePayload["heroSideStats"] = [
  { label: "Developments", value: "4+", hint: "Signature pipeline" },
  { label: "Focus", value: "NCR", hint: "NH-24 · DME · Wave" },
  { label: "Desk", value: "24h", hint: "Enquiry response" },
];

type Props = {
  slides?: HeroSlide[];
  sideStats?: HomePayload["heroSideStats"];
  brandLogoSrc?: string;
  brandLogoAlt?: string;
};

export default function HeroSlider({
  slides: slidesProp,
  sideStats: sideStatsProp,
  brandLogoSrc,
  brandLogoAlt,
}: Props) {
  const slides = slidesProp?.length ? slidesProp : defaultSlides;
  const sideStats = sideStatsProp?.length ? sideStatsProp : defaultSideStats;
  const rootRef = useRef<HTMLDivElement>(null);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    const el = rootRef.current?.querySelector(".swiper-container");
    if (!el) return;

    const swiper = new Swiper(el as HTMLElement, {
      loop: true,
      speed: 1100,
      parallax: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: rootRef.current?.querySelector(".lux-hero-pagination") ?? undefined,
        clickable: true,
        bulletClass: "lux-bullet",
        bulletActiveClass: "lux-bullet-active",
      },
      navigation: {
        nextEl: rootRef.current?.querySelector(".lux-hero-next") ?? undefined,
        prevEl: rootRef.current?.querySelector(".lux-hero-prev") ?? undefined,
      },
    });

    return () => {
      swiper.destroy(true, true);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative min-h-[min(100svh,940px)] w-full overflow-hidden bg-theme-bg"
    >
      <div className="hero-slider-inner relative min-h-[min(100svh,940px)] w-full">
        <div className="swiper-container absolute inset-0 h-full w-full">
          <div className="swiper-wrapper">
            {slides.map((slide) => (
              <div key={slide.bg} className="swiper-slide">
                <div className="relative h-full min-h-[min(100svh,940px)] w-full">
                  <div
                    className="absolute inset-0 scale-[1.08] bg-cover bg-center transition-transform duration-[10000ms] ease-out"
                    style={{ backgroundImage: `url('${slide.bg}')` }}
                    data-swiper-parallax="-8%"
                  />
                  {/* Read zone: darken behind headline column without crushing the whole slide */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_115%_at_14%_48%,rgba(0,0,0,0.58),transparent_58%)]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-theme-bg/72 via-theme-bg/42 to-theme-bg/18" />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/76 via-theme-bg/30 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_20%,rgba(228,199,107,0.12),transparent_55%)]" />
                  <div className="pointer-events-none absolute inset-0 z-5 opacity-[0.14] mix-blend-overlay">
                    <PropertySvgBackdrop variant="gradientMesh" />
                  </div>
                  <div className="pointer-events-none absolute left-0 top-0 z-[6] hidden h-full w-px bg-gradient-to-b from-lux-gold-bright/80 via-lux-gold/30 to-transparent lg:left-8 xl:left-12 lg:block" />

                  <div className="relative z-20 mx-auto flex h-full min-h-[min(100svh,940px)] max-w-7xl flex-col justify-center px-5 pb-36 pt-28 sm:px-8 sm:pb-32 sm:pt-32 lg:px-12 lg:pb-28">
                    <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-10">
                      <div className="relative z-20 lg:col-span-7">
                        <div
                          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-theme-bg/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                          data-swiper-parallax="-80"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {slide.tag}
                        </div>
                        <div
                          className="mb-6 h-px w-16 bg-gradient-to-r from-white to-white/25"
                          data-swiper-parallax="-100"
                        />
                        <div className="mb-3" data-swiper-parallax="-120">
                          <SiteBrandLogo
                            src={brandLogoSrc}
                            alt={brandLogoAlt}
                            variant="onDark"
                            asLink={false}
                            className="h-7 w-auto max-w-[200px] opacity-100 sm:h-9 sm:max-w-[240px]"
                          />
                        </div>
                        <h1
                          className="font-display max-w-[22ch] text-4xl font-medium leading-[1.05] tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_8px_40px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl"
                          data-swiper-parallax="-180"
                        >
                          {slide.title}
                        </h1>
                        <p
                          className="mt-6 max-w-xl text-base leading-relaxed text-stone-100 sm:text-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.75)]"
                          data-swiper-parallax="-260"
                        >
                          {slide.subtitle}
                        </p>
                        <div
                          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                          data-swiper-parallax="-320"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEnquiry({ project: slide.project })
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lux-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-lux-navy shadow-lg shadow-lux-gold/20 transition hover:bg-lux-gold-bright"
                          >
                            Request enquiry
                            <ArrowRight className="h-4 w-4" />
                          </button>
                          <Link
                            href="/projects"
                            className="inline-flex items-center justify-center rounded-xl border border-white/35 bg-theme-bg/75 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-theme-bg/35 backdrop-blur-sm transition hover:border-white/50 hover:bg-theme-bg/90"
                          >
                            Full portfolio
                          </Link>
                          <Link
                            href={slide.exploreHref}
                            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.75)] transition hover:text-white/90 hover:underline sm:ml-1"
                          >
                            View this project
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>

                      <div
                        className="hidden flex-col gap-4 lg:col-span-5 lg:flex"
                        data-swiper-parallax="-200"
                      >
                        {sideStats.map((s) => (
                          <div
                            key={s.label}
                            className="rounded-2xl border border-white/15 bg-theme-bg/75 p-5 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur-md"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.65)]">
                              {s.label}
                            </p>
                            <p className="font-display mt-2 text-3xl font-medium text-white">
                              {s.value}
                            </p>
                            <p className="mt-1 text-xs text-stone-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
                              {s.hint}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:block pointer-events-none absolute bottom-20 left-0 right-0 z-20 bg-gradient-to-t from-theme-bg via-theme-bg/68 to-transparent pb-6 pt-16">
          <div className="pointer-events-auto mx-auto flex max-w-7xl flex-col items-stretch gap-4 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
            <a
              href="tel:+919206001002"
              className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/25 bg-theme-bg/80 px-4 py-3 text-white shadow-md shadow-theme-bg/35 backdrop-blur-md transition hover:border-white/40 hover:bg-theme-bg/90"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                <Phone className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
                  Call desk
                </span>
                <span className="text-sm font-semibold tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]">
                  +91 920 600 1002
                </span>
              </span>
            </a>
            <div className="lux-hero-pagination flex flex-1 justify-center gap-1 pb-1 sm:pb-2" />
            <div className="hidden items-center gap-2 text-white/90 sm:flex [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
              <MapPin className="h-4 w-4 text-white/95" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Delhi NCR
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="hidden lg:flex lux-hero-prev absolute left-2 z-30 h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-theme-bg/85 text-white shadow-lg backdrop-blur-md transition hover:border-white/50 hover:bg-theme-bg max-lg:top-auto max-lg:bottom-23 max-lg:translate-y-0 sm:left-3 sm:h-12 sm:w-12 lg:top-[42%] lg:left-8 lg:h-14 lg:w-14 lg:-translate-y-1/2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </button>
        <button
          type="button"
          className="hidden lg:flex lux-hero-next absolute right-2 z-30 h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-theme-bg/85 text-white shadow-lg backdrop-blur-md transition hover:border-white/50 hover:bg-theme-bg max-lg:top-auto max-lg:bottom-23 max-lg:translate-y-0 sm:right-3 sm:h-12 sm:w-12 lg:top-[42%] lg:right-8 lg:h-14 lg:w-14 lg:-translate-y-1/2"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </button>

        <div className="pointer-events-none absolute bottom-[7.5rem] left-1/2 z-[25] hidden -translate-x-1/2 flex-col items-center gap-2 text-white/80 sm:bottom-[8.5rem] sm:flex lg:bottom-[9rem] [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
