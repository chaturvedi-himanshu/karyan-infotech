"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { createPortal } from "react-dom";

import "swiper/css";
import "swiper/css/navigation";

type FloorPlanImage = {
  src: string;
  alt: string;
  label?: string;
};

export default function ProjectFloorPlansLightbox({
  title = "Floor Plans",
  images,
}: {
  title?: string;
  images: FloorPlanImage[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const isOpen = activeIndex !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
    };
  }, [isOpen]);

  return (
    <>
      <h3 className="mb-5 mt-10 text-xl font-bold text-[#1a1a2e]">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((plan, index) => (
          <button
            key={`${plan.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative h-64 overflow-hidden rounded-sm border border-stone-200 bg-white text-left"
            aria-label={`Open floor plan ${index + 1}`}
          >
            <Image
              src={plan.src}
              alt={plan.alt}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {plan.label?.trim() ? (
              <span className="absolute left-3 top-3 z-10 rounded-full border border-white/35 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {plan.label}
              </span>
            ) : null}
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
          </button>
        ))}
      </div>

      {isOpen && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[300] flex items-center justify-center overscroll-none bg-black/88 p-4 sm:p-6">
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Close floor plans popup"
                onClick={() => setActiveIndex(null)}
              />
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="fixed right-4 top-4 z-[320] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-black shadow-lg transition hover:bg-stone-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <div className="relative z-[305] w-full max-w-6xl">
                <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black">
                  
                  <button
                    type="button"
                    className="floorplan-lightbox-prev absolute left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white transition hover:bg-black/60"
                    aria-label="Previous floor plan"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="floorplan-lightbox-next absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white transition hover:bg-black/60"
                    aria-label="Next floor plan"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <Swiper
                    key={activeIndex}
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".floorplan-lightbox-prev",
                      nextEl: ".floorplan-lightbox-next",
                    }}
                    loop={images.length > 1}
                    initialSlide={activeIndex}
                  >
                    {images.map((plan, index) => (
                      <SwiperSlide key={`${plan.src}-${index}`}>
                        <div className="relative h-[60vh] min-h-[360px] w-full sm:h-[72vh]">
                          <Image
                            src={plan.src}
                            alt={plan.alt}
                            fill
                            className="object-contain"
                            sizes="100vw"
                          />
                          {plan.label?.trim() ? (
                            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/35 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                              {plan.label}
                            </span>
                          ) : null}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
