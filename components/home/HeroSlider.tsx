"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
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

type Props = {
  slides?: HeroSlide[];
  sideStats?: HomePayload["heroSideStats"];
  brandLogoSrc?: string;
  brandLogoAlt?: string;
};

export default function HeroSlider({ slides: slidesProp }: Props) {
  const slides = slidesProp?.length ? slidesProp : defaultSlides;
  const rootRef = useRef<HTMLDivElement>(null);

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
                    className="absolute inset-0 scale-[1.08] bg-cover bg-center transition-transform duration-10000 ease-out"
                    style={{ backgroundImage: `url('${slide.bg}')` }}
                    data-swiper-parallax="-8%"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-theme-bg/65 via-theme-bg/28 to-theme-bg/15"
                    aria-hidden
                  />
                  <div className="relative z-20 flex h-full min-h-[min(100svh,940px)] w-full max-w-7xl items-end px-4 pb-[150px] sm:px-6 lg:px-8">
                    <div
                      className="w-full max-w-3xl rounded-3xl border border-white/15 bg-black/60 p-6 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.55)] sm:p-8"
                      data-swiper-parallax="-100"
                    >
                      {slide.tag?.trim() ? (
                        <span className="inline-flex rounded-full border border-white/30 bg-theme-bg/35 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
                          {slide.tag}
                        </span>
                      ) : null}
                      <h1
                        className="font-display mt-4 max-w-[18ch] text-4xl font-medium leading-[1.06] tracking-tight text-white [text-shadow:0_3px_14px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl"
                        data-swiper-parallax="-160"
                      >
                        {slide.title}
                      </h1>
                      {slide.subtitle?.trim() ? (
                        <p
                          className="mt-4 max-w-[56ch] text-sm leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] sm:text-base"
                          data-swiper-parallax="-120"
                        >
                          {slide.subtitle}
                        </p>
                      ) : null}
                      {slide.exploreHref?.trim() ? (
                        <Link
                          href={slide.exploreHref}
                          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/25"
                          data-swiper-parallax="-80"
                        >
                          Explore
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
