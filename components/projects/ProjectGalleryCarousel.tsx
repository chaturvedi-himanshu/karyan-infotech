"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

export default function ProjectGalleryCarousel({
  title = "Project Gallery",
  images,
}: {
  title?: string;
  images: { src: string; alt: string }[];
}) {
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
        {images.map((img) => (
          <SwiperSlide key={img.src} className="h-auto">
            <div className="relative h-64 overflow-hidden rounded-sm">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
