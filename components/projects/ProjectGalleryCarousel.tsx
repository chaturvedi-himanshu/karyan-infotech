"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import ProjectMediaLightbox, {
  type MediaLightboxImage,
} from "@/components/projects/ProjectMediaLightbox";

import "swiper/css";
import "swiper/css/navigation";

export default function ProjectGalleryCarousel({
  title = "Project Gallery",
  images,
}: {
  title?: string;
  images: MediaLightboxImage[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-[#1a1a2e]">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            className="project-gallery-prev inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-lux-navy transition hover:border-lux-gold/50 hover:text-lux-gold-dim"
            aria-label="Previous image"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="project-gallery-next inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-lux-navy transition hover:border-lux-gold/50 hover:text-lux-gold-dim"
            aria-label="Next image"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        navigation={{
          prevEl: ".project-gallery-prev",
          nextEl: ".project-gallery-next",
        }}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 18 },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={`${img.src}-${index}`} className="h-auto">
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="relative block h-64 w-full overflow-hidden rounded-sm text-left outline-none ring-lux-gold/40 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label={`Open gallery image ${index + 1} in full screen`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                referrerPolicy="no-referrer"
              />
              {img.label?.trim() ? (
                <span className="absolute bottom-3 right-3 rounded-full border border-white/35 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  {img.label}
                </span>
              ) : null}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <ProjectMediaLightbox
        images={images}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        backdropAriaLabel="Close gallery popup"
      />
    </div>
  );
}
