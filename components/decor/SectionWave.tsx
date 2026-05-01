/** Curved section divider — Payloan-style wave transition between bands. */
export default function SectionWave({
  flip = false,
  className = "",
  fill = "fill-lux-cream",
}: {
  flip?: boolean;
  className?: string;
  /** Tailwind fill class, e.g. fill-white, fill-theme-bg, fill-lux-cream */
  fill?: string;
}) {
  return (
    <div
      className={`relative z-10 -mt-px h-12 w-full overflow-hidden md:h-16 ${className}`}
      aria-hidden
    >
      <svg
        className={`absolute left-1/2 w-[min(160%,2000px)] max-w-none -translate-x-1/2 ${flip ? "top-0 rotate-180" : "bottom-0"}`}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={fill}
          d="M0,50 C240,10 480,90 720,48 S1080,-5 1440,35 L1440,100 L0,100 Z"
        />
        <path
          className={`${fill} opacity-[0.72]`}
          d="M0,70 C320,40 640,95 960,55 S1280,25 1440,60 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
}
