"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_HEADER_LOGO_SRC } from "@/lib/cms/defaults/siteSettings";

type Props = {
  src?: string | null;
  alt?: string | null;
  /** onDark: light treatment for navy / hero backgrounds (approx. white mark). */
  variant?: "onLight" | "onDark";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** When false, renders a non-clickable mark (e.g. modal header). */
  asLink?: boolean;
  linkHref?: string;
};

export default function SiteBrandLogo({
  src,
  alt,
  variant = "onLight",
  className = "",
  width = 200,
  height = 56,
  priority = false,
  asLink = true,
  linkHref = "/",
}: Props) {
  const resolvedSrc = src?.trim() || DEFAULT_HEADER_LOGO_SRC;
  const resolvedAlt = alt?.trim() || "Karyan Infratech";
  const variantClass =
    variant === "onDark" ? "brightness-0 invert saturate-0" : "";

  const img = (
    <Image
      src={resolvedSrc}
      alt={resolvedAlt}
      width={width}
      height={height}
      className={`h-auto w-auto max-w-full object-contain object-left ${variantClass} ${className}`.trim()}
      priority={priority}
    />
  );

  if (!asLink) {
    return <span className="inline-flex leading-none">{img}</span>;
  }

  return (
    <Link
      href={linkHref}
      className="inline-flex leading-none transition-opacity hover:opacity-90"
    >
      {img}
    </Link>
  );
}
