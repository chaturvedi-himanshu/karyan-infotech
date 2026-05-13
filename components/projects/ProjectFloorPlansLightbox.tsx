"use client";

import { useState } from "react";
import Image from "next/image";

import ProjectMediaLightbox, {
  type MediaLightboxImage,
} from "@/components/projects/ProjectMediaLightbox";

export default function ProjectFloorPlansLightbox({
  title = "Floor Plans",
  images,
}: {
  title?: string;
  images: MediaLightboxImage[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
              referrerPolicy="no-referrer"
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

      <ProjectMediaLightbox
        images={images}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        backdropAriaLabel="Close floor plans popup"
      />
    </>
  );
}
