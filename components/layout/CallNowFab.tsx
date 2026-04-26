"use client";

import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
};

export default function CallNowFab({ href }: Props) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || !href) {
    return null;
  }

  return (
    <div className="lux-call-fab pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] z-50 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:right-[max(1.5rem,env(safe-area-inset-right,0px))]">
      <a
        href={href}
        className="lux-call-fab__link pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-lux-gold/40 bg-lux-navy/95 text-lux-gold-bright shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-transform duration-300 hover:scale-[1.06] active:scale-[0.97] sm:h-15 sm:w-15"
        aria-label="Call now"
      >
        <Phone className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.25} aria-hidden />
      </a>
    </div>
  );
}
