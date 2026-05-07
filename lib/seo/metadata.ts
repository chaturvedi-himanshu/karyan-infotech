import type { Metadata } from "next";
import type { SeoConfig } from "@/lib/cms/types";

type OpenGraphType = NonNullable<
  NonNullable<Metadata["openGraph"]> extends { type?: infer T } ? T : never
>;

const OPEN_GRAPH_TYPES = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
] as const satisfies readonly OpenGraphType[];

function parseOpenGraphType(raw?: string): OpenGraphType | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  return (OPEN_GRAPH_TYPES as readonly string[]).includes(value)
    ? (value as OpenGraphType)
    : undefined;
}

function parseKeywords(raw?: string): string[] | undefined {
  if (!raw?.trim()) return undefined;
  const list = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

function parseRobots(raw?: string): Metadata["robots"] | undefined {
  if (!raw?.trim()) return undefined;
  const source = raw.toLowerCase();
  return {
    index: !source.includes("noindex"),
    follow: !source.includes("nofollow"),
  };
}

function parseLanguages(
  hreflangs?: { lang: string; url: string }[]
): Metadata["alternates"] {
  const rows = (hreflangs ?? []).filter((h) => h.lang.trim() && h.url.trim());
  if (!rows.length) return undefined;
  const languages = Object.fromEntries(rows.map((h) => [h.lang.trim(), h.url.trim()]));
  return { languages };
}

function parseOtherMeta(
  metaTags?: { name: string; content: string }[]
): Metadata["other"] {
  const rows = (metaTags ?? []).filter((m) => m.name.trim() && m.content.trim());
  if (!rows.length) return undefined;
  return Object.fromEntries(rows.map((m) => [m.name.trim(), m.content.trim()]));
}

export function buildSeoMetadata({
  title,
  description,
  seo,
}: {
  title: string;
  description: string;
  seo?: SeoConfig;
}): Metadata {
  const alternatesFromLang = parseLanguages(seo?.hreflangs);
  const canonical = seo?.canonical?.trim();
  const alternates =
    canonical || alternatesFromLang
      ? {
          canonical: canonical || undefined,
          ...(alternatesFromLang ?? {}),
        }
      : undefined;

  return {
    title,
    description,
    keywords: parseKeywords(seo?.keywords),
    robots: parseRobots(seo?.robots),
    alternates,
    openGraph: {
      title: seo?.openGraph?.title?.trim() || title,
      description: seo?.openGraph?.description?.trim() || description,
      url: seo?.openGraph?.url?.trim() || canonical || undefined,
      siteName: seo?.openGraph?.siteName?.trim() || undefined,
      locale: seo?.openGraph?.locale?.trim() || undefined,
      type: parseOpenGraphType(seo?.openGraph?.type) ?? "website",
      images: seo?.openGraph?.image?.trim() ? [seo.openGraph.image.trim()] : undefined,
    },
    twitter: {
      card: (seo?.twitter?.card?.trim() as "summary" | "summary_large_image" | undefined) || "summary_large_image",
      title: seo?.twitter?.title?.trim() || title,
      description: seo?.twitter?.description?.trim() || description,
      site: seo?.twitter?.site?.trim() || undefined,
      creator: seo?.twitter?.creator?.trim() || undefined,
      images: seo?.twitter?.image?.trim() ? [seo.twitter.image.trim()] : undefined,
    },
    other: parseOtherMeta(seo?.metaTags),
  };
}

export function parseSchemaJsonLd(raw?: string): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
