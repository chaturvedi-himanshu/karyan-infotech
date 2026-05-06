import type { Metadata } from "next";
import type { SeoConfig } from "@/lib/cms/types";

function parseKeywords(keywords?: string): string[] | undefined {
  if (!keywords?.trim()) return undefined;
  const list = keywords
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

function parseRobots(robots?: string): Metadata["robots"] | undefined {
  if (!robots?.trim()) return undefined;
  const tokens = robots
    .toLowerCase()
    .split(",")
    .map((x) => x.trim());
  const hasNoIndex = tokens.includes("noindex");
  const hasNoFollow = tokens.includes("nofollow");
  return {
    index: !hasNoIndex,
    follow: !hasNoFollow,
  };
}

function parseLanguages(hreflangs?: SeoConfig["hreflangs"]): Record<string, string> | undefined {
  if (!Array.isArray(hreflangs) || !hreflangs.length) return undefined;
  const languages = Object.fromEntries(
    hreflangs
      .map((row) => [row.lang?.trim(), row.url?.trim()] as const)
      .filter(([lang, url]) => !!lang && !!url)
  );
  return Object.keys(languages).length ? languages : undefined;
}

function parseMetaTags(metaTags?: SeoConfig["metaTags"]): Record<string, string> | undefined {
  if (!Array.isArray(metaTags) || !metaTags.length) return undefined;
  const out: Record<string, string> = {};
  for (const row of metaTags) {
    const name = row.name?.trim();
    const content = row.content?.trim();
    if (!name || !content) continue;
    out[name] = content;
  }
  return Object.keys(out).length ? out : undefined;
}

export function buildSeoMetadata(
  base: { title?: string; description?: string },
  seo?: SeoConfig
): Metadata {
  const metadata: Metadata = {
    title: base.title,
    description: base.description,
  };
  const keywords = parseKeywords(seo?.keywords);
  const robots = parseRobots(seo?.robots);
  const languages = parseLanguages(seo?.hreflangs);
  const metaTags = parseMetaTags(seo?.metaTags);
  if (keywords) metadata.keywords = keywords;
  if (robots) metadata.robots = robots;
  if (seo?.canonical?.trim() || languages) {
    metadata.alternates = {
      canonical: seo?.canonical?.trim() || undefined,
      languages,
    };
  }
  if (metaTags) metadata.other = metaTags;
  return metadata;
}

