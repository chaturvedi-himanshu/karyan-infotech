"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { createPortal } from "react-dom";

import "swiper/css";
import "swiper/css/navigation";

export type MediaLightboxImage = {
  src: string;
  alt: string;
  label?: string;
};

type ProjectMediaLightboxProps = {
  images: MediaLightboxImage[];
  activeIndex: number | null;
  onClose: () => void;
  backdropAriaLabel?: string;
};

export default function ProjectMediaLightbox({
  images,
  activeIndex,
  onClose,
  backdropAriaLabel = "Close image viewer",
}: ProjectMediaLightboxProps) {
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

  if (!isOpen || activeIndex === null || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center overscroll-none bg-black/88 p-4 sm:p-6">
      <button type="button" className="absolute inset-0" aria-label={backdropAriaLabel} onClick={onClose} />
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-[320] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-black shadow-lg transition hover:bg-stone-100"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <div className="relative z-[305] w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black">
          <button
            type="button"
            className="project-media-lightbox-prev absolute left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white transition hover:bg-black/60"
            aria-label="Previous image"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="project-media-lightbox-next absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white transition hover:bg-black/60"
            aria-label="Next image"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          <Swiper
            key={activeIndex}
            modules={[Navigation]}
            navigation={{
              prevEl: ".project-media-lightbox-prev",
              nextEl: ".project-media-lightbox-next",
            }}
            loop={images.length > 1}
            initialSlide={activeIndex}
          >
            {images.map((img, index) => (
              <SwiperSlide key={`${img.src}-${index}`}>
                <div className="relative h-[60vh] min-h-[360px] w-full sm:h-[72vh]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    referrerPolicy="no-referrer"
                  />
                  {img.label?.trim() ? (
                    <span className="absolute left-4 top-4 z-10 rounded-full border border-white/35 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      {img.label}
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
  );
}
