"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";

type Project = ProjectsListPayload["projects"][number];

/** Same layout as the former “wide” bento card — used for every slide. */
function PortfolioWideCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-lux-ivory shadow-[0_24px_50px_-28px_rgba(10,22,40,0.15)] ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-1 hover:border-lux-gold/35 hover:shadow-[0_28px_60px_-24px_rgba(198,160,82,0.18)] sm:min-h-[260px] sm:flex-row lg:min-h-[300px]"
    >
      <div className="relative h-52 shrink-0 overflow-hidden bg-stone-100 sm:h-auto sm:w-[46%] sm:min-h-[240px] lg:min-h-[280px]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, 46vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-theme-bg/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.type}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-theme-bg/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.status}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 sm:py-10 sm:pl-2 sm:pr-10">
        <p className="text-xs font-medium uppercase tracking-wide text-lux-gold-dim">{project.location}</p>
        <h3 className="font-display mt-2 text-xl font-medium text-lux-navy group-hover:text-lux-gold-dim sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-stone-600 sm:line-clamp-5">
          {project.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lux-navy">
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
    const container = root?.querySelector(".home-projects-swiper");
    if (!root || !container || !projects.length) return;

    const swiper = new Swiper(container as HTMLElement, {
      loop: projects.length > 1,
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 650,
      watchOverflow: true,
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

    return () => {
      swiper.destroy(true, true);
    };
  }, [trackKey, projects.length]);

  if (!projects.length) return null;

  return (
    <div ref={rootRef} className="relative mt-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-4">
        <button
          ref={prevRef}
          type="button"
          aria-label="Previous project"
          className="order-2 flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full border border-lux-navy/10 bg-lux-ivory text-lux-navy shadow-sm transition hover:border-lux-gold/50 hover:bg-lux-cream hover:text-lux-gold-dim sm:order-1 sm:self-center"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="swiper home-projects-swiper order-1 min-w-0 flex-1 overflow-hidden sm:order-2">
          <div className="swiper-wrapper">
            {projects.map((project) => (
              <div key={project.href} className="swiper-slide h-auto">
                <PortfolioWideCard project={project} />
              </div>
            ))}
          </div>
        </div>

        <button
          ref={nextRef}
          type="button"
          aria-label="Next project"
          className="order-3 flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full border border-lux-navy/10 bg-lux-ivory text-lux-navy shadow-sm transition hover:border-lux-gold/50 hover:bg-lux-cream hover:text-lux-gold-dim sm:self-center"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <div ref={pagRef} className="home-projects-pagination mt-8 text-center" />
    </div>
  );
}
