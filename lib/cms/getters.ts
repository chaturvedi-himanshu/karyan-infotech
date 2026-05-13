import { unstable_cache } from "next/cache";
import { connectMongo } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/models/SiteSettings";
import { HomeContentModel } from "@/models/HomeContent";
import { ProjectPageModel } from "@/models/ProjectPage";
import { BlogPostModel } from "@/models/BlogPost";
import { SitePageModel } from "@/models/SitePage";
import type {
  BlogPostPayload,
  HomePayload,
  HomePresenceBand,
  ProjectPayload,
  SiteSettingsBundle,
} from "./types";
import { migrateLegacyHomePresence } from "./migrateHomePresence";
import { normalizePresenceCityIds } from "./normalizePresenceCityIds";
import { DEFAULT_SITE_SETTINGS } from "./defaults/siteSettings";
import { DEFAULT_HOME_PAYLOAD } from "./defaults/homePayload";
import { DEFAULT_BLOG_POSTS } from "./defaults/blogPosts";
import { DEFAULT_SITE_PAGES } from "./defaults/sitePages";
import { DEFAULT_PROJECT_PAGES } from "./defaults/projectsSeed";
import { buildDefaultProjectPayload, slugFromProjectHref } from "./projects";

function defaultProject(slug: string): ProjectPayload | null {
  const row = DEFAULT_PROJECT_PAGES.find((p) => p.slug === slug);
  return row ? row.payload : null;
}

async function loadSiteSettingsFromDb(): Promise<SiteSettingsBundle> {
  try {
    await connectMongo();
    const doc = await SiteSettingsModel.findOne({ key: "default" }).lean();
    if (doc?.nav && doc?.footer) {
      const raw = doc as Record<string, unknown>;
      const pr = raw.enquiryFloatPromo;
      const ir = raw.projectInterestOptions;
      const hr = raw.pageHeader;
      const tr = raw.themeColors;
      const defPromo = DEFAULT_SITE_SETTINGS.enquiryFloatPromo;
      const defInterest = DEFAULT_SITE_SETTINGS.projectInterestOptions;
      const defHeader = DEFAULT_SITE_SETTINGS.pageHeader;
      const defTheme = DEFAULT_SITE_SETTINGS.themeColors;
      const enquiryFloatPromo: SiteSettingsBundle["enquiryFloatPromo"] =
        pr && typeof pr === "object" && !Array.isArray(pr)
          ? { ...defPromo, ...(pr as Partial<typeof defPromo>) }
          : defPromo;
      const pageHeader: SiteSettingsBundle["pageHeader"] =
        hr && typeof hr === "object" && !Array.isArray(hr)
          ? { ...defHeader, ...(hr as Partial<typeof defHeader>) }
          : defHeader;
      const projectInterestOptions: SiteSettingsBundle["projectInterestOptions"] = Array.isArray(ir)
        ? (ir as unknown[])
            .map((row) => {
              if (!row || typeof row !== "object") return null;
              const r = row as Record<string, unknown>;
              const value = typeof r.value === "string" ? r.value : "";
              const label = typeof r.label === "string" ? r.label : "";
              return label.trim() ? { value: value.trim(), label: label.trim() } : null;
            })
            .filter((x): x is { value: string; label: string } => !!x)
        : defInterest;
      const themeColors: SiteSettingsBundle["themeColors"] =
        tr && typeof tr === "object" && !Array.isArray(tr)
          ? { ...defTheme, ...(tr as Partial<typeof defTheme>) }
          : defTheme;
      return {
        nav: {
          ...DEFAULT_SITE_SETTINGS.nav,
          ...(doc.nav as Partial<SiteSettingsBundle["nav"]>),
          topBar: {
            ...DEFAULT_SITE_SETTINGS.nav.topBar,
            ...((doc.nav as Partial<SiteSettingsBundle["nav"]>)?.topBar ?? {}),
          },
        },
        footer: {
          ...DEFAULT_SITE_SETTINGS.footer,
          ...(doc.footer as Partial<SiteSettingsBundle["footer"]>),
        },
        projectInterestOptions,
        themeColors,
        pageHeader,
        enquiryFloatPromo,
      };
    }
  } catch {
    /* use defaults */
  }
  return DEFAULT_SITE_SETTINGS;
}

/** Cached across requests; invalidated when admin saves site settings (`revalidateTag`). */
export const getSiteSettings = unstable_cache(loadSiteSettingsFromDb, ["site-settings-bundle"], {
  tags: ["site-settings"],
  revalidate: 86_400,
});

function mergeHomePayloadFromDoc(raw: Record<string, unknown>): HomePayload {
  const base = { ...DEFAULT_HOME_PAYLOAD, ...raw } as HomePayload;
  const defP = DEFAULT_HOME_PAYLOAD.presence;
  const rp = raw.presence as Record<string, unknown> | undefined;

  /** Deep-merge `presence` so a partial or oddly shaped DB object does not wipe `cityIds`. */
  const presence: HomePresenceBand = {
    eyebrow: typeof rp?.eyebrow === "string" ? rp.eyebrow : defP.eyebrow,
    heading: typeof rp?.heading === "string" ? rp.heading : defP.heading,
    subheading: typeof rp?.subheading === "string" ? rp.subheading : defP.subheading,
    cityIds: Array.isArray(rp?.cityIds)
      ? normalizePresenceCityIds(rp.cityIds as unknown[])
      : defP.cityIds,
  };

  const out = { ...base, presence } as HomePayload;
  return migrateLegacyHomePresence(out, raw);
}

export async function getHomeContent(): Promise<HomePayload> {
  try {
    await connectMongo();
    const doc = await HomeContentModel.findOne({ key: "default" }).lean();
    if (doc?.data && typeof doc.data === "object") {
      return mergeHomePayloadFromDoc(doc.data as Record<string, unknown>);
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_HOME_PAYLOAD;
}

export async function getProjectPayload(slug: string): Promise<ProjectPayload | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  try {
    await connectMongo();
    const doc = await ProjectPageModel.findOne({ slug: normalizedSlug }).lean();
    if (doc?.payload && typeof doc.payload === "object") {
      return doc.payload as ProjectPayload;
    }
  } catch {
    /* fall through */
  }
  const seeded = defaultProject(normalizedSlug);
  if (seeded) return seeded;

  // Fallback: if the slug exists in the projects listing, return a generated template
  // so new listing entries do not 404 before full details are saved.
  const listingDoc = await getSitePage("projects");
  const listingPayload = listingDoc?.payload as
    | { projects?: { title?: string; href?: string }[] }
    | undefined;
  const row = (listingPayload?.projects ?? []).find(
    (p) => slugFromProjectHref(p.href ?? "") === normalizedSlug
  );
  if (row) {
    const title = row.title?.trim() || normalizedSlug;
    return buildDefaultProjectPayload(normalizedSlug, title);
  }
  // Final safety: for new project-like slugs, provide a starter payload
  // instead of 404 so admin can fill details right away.
  if (normalizedSlug.startsWith("karyan-")) {
    const title = normalizedSlug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return buildDefaultProjectPayload(normalizedSlug, title);
  }
  return null;
}

export async function getBlogPosts(): Promise<BlogPostPayload[]> {
  try {
    await connectMongo();
    const rows = await BlogPostModel.find().sort({ order: 1, createdAt: -1 }).lean();
    if (rows.length) {
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        body: r.body ?? undefined,
        date: r.date,
        category: r.category,
        href: r.href,
        image: r.image,
        order: r.order,
        seo: (r.seo as BlogPostPayload["seo"]) ?? undefined,
      }));
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostPayload | null> {
  const posts = await getBlogPosts();
  const normalized = slug.toLowerCase();
  return (
    posts.find(
      (p) =>
        p.slug.toLowerCase() === normalized ||
        p.href === `/blog/${slug}` ||
        p.href.endsWith(`/${normalized}`)
    ) ?? null
  );
}

export async function getSitePage(slug: string): Promise<{
  metaTitle: string;
  metaDescription: string;
  seo?: import("./types").SeoConfig;
  payload: Record<string, unknown>;
} | null> {
  const fallback = DEFAULT_SITE_PAGES.find((p) => p.slug === slug);
  try {
    await connectMongo();
    const doc = await SitePageModel.findOne({ slug }).lean();
    if (doc) {
      return {
        metaTitle: doc.metaTitle,
        metaDescription: doc.metaDescription,
        seo: (doc.seo as import("./types").SeoConfig) ?? undefined,
        payload: (doc.payload ?? {}) as Record<string, unknown>,
      };
    }
  } catch {
    /* fall through */
  }
  if (!fallback) return null;
  return {
    metaTitle: fallback.metaTitle,
    metaDescription: fallback.metaDescription,
    seo: undefined,
    payload: { ...fallback.payload } as Record<string, unknown>,
  };
}
