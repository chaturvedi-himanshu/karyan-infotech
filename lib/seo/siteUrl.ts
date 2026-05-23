/**
 * Canonical absolute site URL helpers.
 *
 * Driven by `NEXT_PUBLIC_SITE_URL` (set in apphosting.yaml for prod / .env for
 * local). A safe fallback to the live production host is used so that build
 * artifacts (sitemap, robots, OG tags, …) never come out blank if the env var
 * is missing.
 */

const FALLBACK_SITE_URL = "https://karyaninfratech.co.in";

/** Returns the site origin (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = raw && /^https?:\/\//i.test(raw) ? raw : FALLBACK_SITE_URL;
  return base.replace(/\/+$/, "");
}

/** Joins the site origin with a path, returning an absolute URL. */
export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
