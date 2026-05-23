import type { MetadataRoute } from "next";
import { connectMongo } from "@/lib/mongodb";
import { BlogPostModel } from "@/models/BlogPost";
import { ContentPageModel } from "@/models/ContentPage";
import { ProjectPageModel } from "@/models/ProjectPage";
import { getProjectsListPayload } from "@/lib/cms/getters";
import { absoluteUrl } from "@/lib/seo/siteUrl";

/**
 * Re-build the sitemap at most once per hour. The route handler is cached by
 * default (Next 16 metadata-file convention); revalidation lets newly published
 * blog posts / projects appear without a redeploy.
 */
export const revalidate = 3600;

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Static, hand-crafted routes — these always exist on the site. */
const STATIC_ROUTES: SitemapEntry[] = [
  {
    url: absoluteUrl("/"),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: absoluteUrl("/about"),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/contact"),
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    url: absoluteUrl("/projects"),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/blog"),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

function normalizeTypeFilter(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Best-effort DB read. Returns `[]` on any failure (e.g. build with no Mongo). */
async function safeFetch<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    await connectMongo();
    return await fn();
  } catch {
    return [];
  }
}

async function buildBlogEntries(): Promise<SitemapEntry[]> {
  const rows = await safeFetch(() =>
    BlogPostModel.find({}, { slug: 1, href: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .lean(),
  );
  return rows.map((row) => {
    const r = row as { slug?: string; href?: string; updatedAt?: Date };
    const path = r.href?.startsWith("/")
      ? r.href
      : `/blog/${(r.slug ?? "").trim()}`;
    return {
      url: absoluteUrl(path),
      lastModified: r.updatedAt instanceof Date ? r.updatedAt : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    } satisfies SitemapEntry;
  });
}

async function buildContentPageEntries(): Promise<SitemapEntry[]> {
  const rows = await safeFetch(() =>
    ContentPageModel.find({}, { slug: 1, updatedAt: 1 }).lean(),
  );
  return rows
    .map((row) => {
      const r = row as { slug?: string; updatedAt?: Date };
      const slug = r.slug?.trim();
      if (!slug) return null;
      return {
        url: absoluteUrl(`/${slug}`),
        lastModified: r.updatedAt instanceof Date ? r.updatedAt : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      } satisfies SitemapEntry;
    })
    .filter((x): x is SitemapEntry => Boolean(x));
}

async function buildProjectEntries(): Promise<SitemapEntry[]> {
  const rows = await safeFetch(() =>
    ProjectPageModel.find({}, { slug: 1, updatedAt: 1 }).lean(),
  );
  const fromDb = rows
    .map((row) => {
      const r = row as { slug?: string; updatedAt?: Date };
      const slug = r.slug?.trim();
      if (!slug) return null;
      return {
        url: absoluteUrl(`/${slug}`),
        lastModified: r.updatedAt instanceof Date ? r.updatedAt : new Date(),
        changeFrequency: "monthly",
        priority: 0.85,
      } satisfies SitemapEntry;
    })
    .filter((x): x is SitemapEntry => Boolean(x));

  // Also include any project listed only in the listing payload (covers seeded
  // projects that haven't been edited in the admin yet).
  let fromListing: SitemapEntry[] = [];
  try {
    const listing = await getProjectsListPayload();
    fromListing = listing.projects
      .map((p) => {
        const path = p.href?.startsWith("/") ? p.href : `/${p.href ?? ""}`;
        if (!path || path === "/") return null;
        return {
          url: absoluteUrl(path),
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.85,
        } satisfies SitemapEntry;
      })
      .filter((x): x is SitemapEntry => Boolean(x));
  } catch {
    /* ignore — listing fallback is opportunistic */
  }

  // De-duplicate by URL, preferring DB rows (they have real lastModified).
  const seen = new Map<string, SitemapEntry>();
  for (const entry of [...fromDb, ...fromListing]) {
    if (!seen.has(entry.url)) seen.set(entry.url, entry);
  }
  return [...seen.values()];
}

async function buildProjectTypeFilterEntries(): Promise<SitemapEntry[]> {
  try {
    const listing = await getProjectsListPayload();
    const types = new Set<string>();
    for (const project of listing.projects) {
      const t = normalizeTypeFilter(project.type ?? "");
      if (t) types.add(t);
    }
    return [...types].map(
      (type) =>
        ({
          url: absoluteUrl(`/projects?type=${encodeURIComponent(type)}`),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        }) satisfies SitemapEntry,
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, contentPages, blog, typeFilters] = await Promise.all([
    buildProjectEntries(),
    buildContentPageEntries(),
    buildBlogEntries(),
    buildProjectTypeFilterEntries(),
  ]);

  // Final de-duplication across the whole sitemap (e.g. a content-page slug
  // can collide with a static route if mis-seeded).
  const all = [
    ...STATIC_ROUTES,
    ...projects,
    ...contentPages,
    ...blog,
    ...typeFilters,
  ];
  const byUrl = new Map<string, SitemapEntry>();
  for (const entry of all) {
    if (!byUrl.has(entry.url)) byUrl.set(entry.url, entry);
  }
  return [...byUrl.values()];
}
