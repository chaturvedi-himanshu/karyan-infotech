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
      className="relative min-h-[min(100svh,940px)] w-full overflow-hidden bg-lux-navy"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-lux-navy via-lux-navy/88 to-lux-navy/55" />
                  <div className="absolute inset-0 bg-gradient-to-t from-lux-navy via-lux-navy/40 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_20%,rgba(228,199,107,0.12),transparent_55%)]" />
                  <div className="pointer-events-none absolute inset-0 z-5 opacity-[0.11] mix-blend-overlay">
                    <PropertySvgBackdrop variant="gradientMesh" />
                  </div>
                  <div className="pointer-events-none absolute left-0 top-0 z-[6] hidden h-full w-px bg-gradient-to-b from-lux-gold-bright/80 via-lux-gold/30 to-transparent lg:left-8 xl:left-12 lg:block" />

                  <div className="relative z-20 mx-auto flex h-full min-h-[min(100svh,940px)] max-w-7xl flex-col justify-center px-5 pb-36 pt-28 sm:px-8 sm:pb-32 sm:pt-32 lg:px-12 lg:pb-28">
                    <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-10">
                      <div className="relative z-20 lg:col-span-7">
                        <div
                          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-lux-gold-bright backdrop-blur-md"
                          data-swiper-parallax="-80"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {slide.tag}
                        </div>
                        <div
                          className="mb-6 h-px w-16 bg-gradient-to-r from-lux-gold-bright to-lux-gold/20"
                          data-swiper-parallax="-100"
                        />
                        <div className="mb-3" data-swiper-parallax="-120">
                          <SiteBrandLogo
                            src={brandLogoSrc}
                            alt={brandLogoAlt}
                            variant="onDark"
                            asLink={false}
                            className="h-7 w-auto max-w-[200px] opacity-90 sm:h-9 sm:max-w-[240px]"
                          />
                        </div>
                        <h1
                          className="font-display max-w-[22ch] text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl"
                          data-swiper-parallax="-180"
                        >
                          {slide.title}
                        </h1>
                        <p
                          className="mt-6 max-w-xl text-base leading-relaxed text-stone-300/95 sm:text-lg"
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
                            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition hover:border-lux-gold/50 hover:bg-white/10"
                          >
                            Full portfolio
                          </Link>
                          <Link
                            href={slide.exploreHref}
                            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-lux-gold-bright/90 underline-offset-4 transition hover:text-white hover:underline sm:ml-1"
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
                            className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.5)] backdrop-blur-md"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lux-gold-bright/80">
                              {s.label}
                            </p>
                            <p className="font-display mt-2 text-3xl font-medium text-white">
                              {s.value}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">{s.hint}</p>
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

        <div className="hidden sm:block pointer-events-none absolute bottom-20 left-0 right-0 z-20 bg-gradient-to-t from-lux-navy via-lux-navy/80 to-transparent pb-6 pt-16">
          <div className="pointer-events-auto mx-auto flex max-w-7xl flex-col items-stretch gap-4 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
            <a
              href="tel:+919206001002"
              className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md transition hover:border-lux-gold/40 hover:bg-white/[0.14]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lux-gold/20 text-lux-gold-bright">
                <Phone className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  Call desk
                </span>
                <span className="text-sm font-semibold tracking-wide">
                  +91 920 600 1002
                </span>
              </span>
            </a>
            <div className="lux-hero-pagination flex flex-1 justify-center gap-1 pb-1 sm:pb-2" />
            <div className="hidden items-center gap-2 text-white/45 sm:flex">
              <MapPin className="h-4 w-4 text-lux-gold/80" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Delhi NCR
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="hidden lg:flex lux-hero-prev absolute left-2 z-30 h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-lux-navy/55 text-white shadow-lg backdrop-blur-md transition hover:border-lux-gold/50 hover:bg-lux-gold/15 max-lg:top-auto max-lg:bottom-23 max-lg:translate-y-0 sm:left-3 sm:h-12 sm:w-12 lg:top-[42%] lg:left-8 lg:h-14 lg:w-14 lg:-translate-y-1/2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </button>
        <button
          type="button"
          className="hidden lg:flex lux-hero-next absolute right-2 z-30 h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-lux-navy/55 text-white shadow-lg backdrop-blur-md transition hover:border-lux-gold/50 hover:bg-lux-gold/15 max-lg:top-auto max-lg:bottom-23 max-lg:translate-y-0 sm:right-3 sm:h-12 sm:w-12 lg:top-[42%] lg:right-8 lg:h-14 lg:w-14 lg:-translate-y-1/2"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </button>

        <div className="pointer-events-none absolute bottom-[7.5rem] left-1/2 z-[25] hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 sm:bottom-[8.5rem] sm:flex lg:bottom-[9rem]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
