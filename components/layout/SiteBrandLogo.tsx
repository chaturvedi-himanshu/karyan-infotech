"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import bundledLogo from "@/assets/karyan-header-logo.png";
import { normalizeImageSrc } from "@/lib/image/normalizeSrc";

/** Logo shipped with the app bundle — always available at `/_next/static/...` in production. */
const BUNDLED_LOGO_SRC: string =
  typeof bundledLogo === "object" && bundledLogo !== null && "src" in bundledLogo
    ? (bundledLogo as StaticImageData).src
    : String(bundledLogo);

const BUNDLED_WIDTH = typeof bundledLogo === "object" && "width" in bundledLogo ? bundledLogo.width : 200;
const BUNDLED_HEIGHT = typeof bundledLogo === "object" && "height" in bundledLogo ? bundledLogo.height : 56;

function resolveBrandLogoUrl(raw: string | null | undefined): string {
  let s = normalizeImageSrc(raw?.trim() ?? "");
  if (!s) return BUNDLED_LOGO_SRC;

  const isHttp = /^https?:\/\//i.test(s);
  if (!isHttp && !s.startsWith("/")) {
    s = `/${s.replace(/^\/+/, "")}`;
  }

  if (s.startsWith("/")) return s;

  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./i, "");
    if (host.endsWith("karyaninfratech.co.in") && u.pathname.includes("/wp-content/uploads/")) {
      return BUNDLED_LOGO_SRC;
    }
  } catch {
    return BUNDLED_LOGO_SRC;
  }

  return s;
}

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
  width,
  height,
  priority = false,
  asLink = true,
  linkHref = "/",
}: Props) {
  const [imgSrc, setImgSrc] = useState(() => resolveBrandLogoUrl(src));

  useEffect(() => {
    setImgSrc(resolveBrandLogoUrl(src));
  }, [src]);

  const resolvedAlt = alt?.trim() || "Karyan Infratech";
  const variantClass = variant === "onDark" ? "brightness-0 invert saturate-0" : "";

  const intrinsicW = imgSrc === BUNDLED_LOGO_SRC ? BUNDLED_WIDTH : (width ?? 200);
  const intrinsicH = imgSrc === BUNDLED_LOGO_SRC ? BUNDLED_HEIGHT : (height ?? 56);

  function handleError() {
    setImgSrc((prev) => (prev !== BUNDLED_LOGO_SRC ? BUNDLED_LOGO_SRC : prev));
  }

  const img = (
    <img
      src={imgSrc}
      alt={resolvedAlt}
      width={intrinsicW}
      height={intrinsicH}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={`h-auto w-auto max-w-full object-contain object-left ${variantClass} ${className}`.trim()}
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
