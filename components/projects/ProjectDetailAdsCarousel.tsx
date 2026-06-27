"use client";

import Image from "next/image";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryProvider";

import "swiper/css";
import "swiper/css/pagination";

const FALLBACK_IMAGE = "/images/proverview.jpg";

/** Design frame for sidebar ads — upload images at this size for best results. */
export const PROJECT_DETAIL_AD_WIDTH = 386;
export const PROJECT_DETAIL_AD_HEIGHT = 550;

export type ProjectDetailAdSlide = {
  src: string;
  alt: string;
};

export default function ProjectDetailAdsCarousel({
  images,
  enquiryProject,
  bookNowLabel = "Book Now",
}: {
  images: ProjectDetailAdSlide[];
  enquiryProject?: string;
  bookNowLabel?: string;
}) {
  const slides = images.filter((img) => img.src?.trim());
  if (!slides.length) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-[386px] overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-900 shadow-sm"
      style={{ aspectRatio: `${PROJECT_DETAIL_AD_WIDTH} / ${PROJECT_DETAIL_AD_HEIGHT}` }}
      aria-label="Project promotions"
    >
      <div className="relative h-full w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={slides.length > 1}
          speed={800}
          slidesPerView={1}
          spaceBetween={0}
          autoplay={
            slides.length > 1
              ? { delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }
              : false
          }
          pagination={{
            clickable: true,
            el: ".project-detail-ads-pagination",
            bulletClass: "project-hero-bullet",
            bulletActiveClass: "project-hero-bullet-active",
          }}
          className="absolute inset-0 h-full w-full"
        >
          {slides.map((img, index) => (
            <SwiperSlide key={`${img.src}-${index}`}>
              <div className="relative h-full w-full">
                <Image
                  src={img.src}
                  alt={img.alt || "Promotion"}
                  fill
                  className="object-cover object-center"
                  sizes="386px"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (!el.dataset.errored) {
                      el.dataset.errored = "1";
                      el.src = FALLBACK_IMAGE;
                    }
                  }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <EnquiryTrigger
          project={enquiryProject?.trim() || undefined}
          className="absolute bottom-0 left-0 z-20 inline-flex min-h-[40px] items-center justify-center rounded-tr-lg border border-[#ead7b0]/70 bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lux-gold sm:text-xs"
        >
          {bookNowLabel}
        </EnquiryTrigger>
      </div>
    </div>
  );
}
