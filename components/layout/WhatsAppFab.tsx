"use client";

import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
  href?: string;
  phone?: string;
};

function toWhatsappHref(phone?: string) {
  const digits = (phone ?? "").replace(/\D+/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default function WhatsAppFab({ href, phone }: Props) {
  const pathname = usePathname();
  const targetHref =
    href?.trim() || toWhatsappHref(phone) || "https://wa.me/919953298484";
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="lux-whatsapp-fab pointer-events-none fixed bottom-8 right-5 z-[70] sm:bottom-8 sm:right-6">
      <div className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full">
        <a
          href={targetHref}
          target="_blank"
          rel="noopener noreferrer"
          className="lux-whatsapp-fab__link relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-[#25d366] text-white ring-1 ring-white/15 transition-transform duration-300 hover:scale-[1.06] active:scale-[0.97] sm:h-14 sm:w-14"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-7 w-7" aria-hidden />
        </a>
      </div>
    </div>
  );
}
