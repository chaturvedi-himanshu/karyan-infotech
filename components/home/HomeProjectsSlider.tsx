"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";

type Project = ProjectsListPayload["projects"][number];

/** Vertical card: image on top, copy below — fits two-across horizontal 3D carousel. */
function PortfolioStackCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-lux-ivory shadow-[0_24px_50px_-28px_rgba(10,22,40,0.15)] ring-1 ring-black/[0.03] transition duration-300 hover:border-lux-gold/35 hover:shadow-[0_28px_60px_-24px_rgba(198,160,82,0.18)]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-stone-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 92vw, 44vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className="rounded-full bg-theme-bg/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
          <span className="rounded-full bg-theme-bg/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.status}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-lux-gold-dim">{project.location}</p>
        <h3 className="font-display mt-2 text-lg font-medium text-lux-navy group-hover:text-lux-gold-dim sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600 sm:line-clamp-4">
          {project.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lux-navy">
          View project
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function HomeProjectsSlider({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);
  const trackKey = projects.map((p) => p.href).join("|");

  useEffect(() => {
    const root = rootRef.current;
    const container = root?.querySelector(".home-projects-swiper--3d");
    if (!root || !container || !projects.length) return;

    const swiper = new Swiper(container as HTMLElement, {
      direction: "horizontal",
      loop: projects.length > 2,
      slidesPerView: 1.08,
      centeredSlides: true,
      spaceBetween: 16,
      speed: 700,
      grabCursor: true,
      watchOverflow: true,
      effect: "coverflow",
      coverflowEffect: {
        rotate: 28,
        stretch: 0,
        depth: 160,
        modifier: 1,
        slideShadows: true,
      },
      autoplay: {
        enabled: true,
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 22,
          centeredSlides: false,
        },
      },
      navigation:
        prevRef.current && nextRef.current
          ? {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }
          : undefined,
      pagination: pagRef.current
        ? {
            el: pagRef.current,
            clickable: true,
            bulletClass: "swiper-pagination-bullet lux-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active lux-bullet-active",
          }
        : undefined,
    });

    const pauseHover = () => {
      if (swiper.autoplay?.running) swiper.autoplay.pause();
    };
    const resumeHover = () => {
      if (swiper.params.autoplay.disableOnInteraction) return;
      swiper.autoplay.paused = false;
      swiper.autoplay.run();
    };
    root.addEventListener("mouseenter", pauseHover);
    root.addEventListener("mouseleave", resumeHover);

    return () => {
      root.removeEventListener("mouseenter", pauseHover);
      root.removeEventListener("mouseleave", resumeHover);
      swiper.destroy(true, true);
    };
  }, [trackKey, projects.length]);

  if (!projects.length) return null;

  return (
    <div ref={rootRef} className="home-projects-carousel-root relative mt-14">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:items-stretch sm:gap-4">
        <button
          ref={prevRef}
          type="button"
          aria-label="Previous project"
          className="order-2 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lux-navy/10 bg-lux-ivory text-lux-navy shadow-sm transition hover:border-lux-gold/50 hover:bg-lux-cream hover:text-lux-gold-dim sm:order-1 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="swiper home-projects-swiper home-projects-swiper--3d order-1 min-h-0 min-w-0 basis-full overflow-hidden sm:order-2 sm:basis-auto sm:flex-1">
          <div className="swiper-wrapper">
            {projects.map((project) => (
              <div key={project.href} className="swiper-slide">
                <PortfolioStackCard project={project} />
              </div>
            ))}
          </div>
        </div>

        <button
          ref={nextRef}
          type="button"
          aria-label="Next project"
          className="order-2 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lux-navy/10 bg-lux-ivory text-lux-navy shadow-sm transition hover:border-lux-gold/50 hover:bg-lux-cream hover:text-lux-gold-dim sm:order-3 sm:flex"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <div ref={pagRef} className="home-projects-pagination mt-8 text-center" />
    </div>
  );
}
