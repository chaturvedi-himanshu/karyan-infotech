import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import type { ProjectPayload } from "@/lib/cms/types";

export type ProjectListCard = ProjectsListPayload["projects"][number];

/** Parse display order; unknown/missing sorts last. */
export function parseProjectOrder(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 9999;
}

export function sortProjectsByOrder<T extends { order?: number; title?: string }>(
  projects: T[]
): T[] {
  return [...projects].sort((a, b) => {
    const diff = parseProjectOrder(a.order) - parseProjectOrder(b.order);
    if (diff !== 0) return diff;
    return (a.title ?? "").localeCompare(b.title ?? "", undefined, { sensitivity: "base" });
  });
}

export type ProjectListingFieldsBySlug = Map<
  string,
  { order?: number; rera?: string }
>;

/** Merge order & RERA from project detail pages, then sort. */
export function applyProjectListingFields<T extends ProjectListCard>(
  projects: T[],
  fieldsBySlug: ProjectListingFieldsBySlug
): T[] {
  const enriched = projects.map((project) => {
    const slug = slugFromProjectHref(project.href);
    const fromPage = slug ? fieldsBySlug.get(slug) : undefined;
    if (!fromPage) return project;

    let next = { ...project };
    const order =
      typeof project.order === "number" && Number.isFinite(project.order)
        ? project.order
        : fromPage.order;
    if (order !== undefined) next = { ...next, order };

    const pageRera = fromPage.rera?.trim();
    if (pageRera) next = { ...next, rera: pageRera };
    else if (!next.rera?.trim() && fromPage.rera !== undefined) {
      next = { ...next, rera: fromPage.rera };
    }

    return next;
  });
  return sortProjectsByOrder(enriched);
}

/** @deprecated Use applyProjectListingFields */
export function applyProjectOrders<T extends ProjectListCard>(
  projects: T[],
  orderBySlug: Map<string, number>
): T[] {
  const fieldsBySlug: ProjectListingFieldsBySlug = new Map();
  for (const [slug, order] of orderBySlug) fieldsBySlug.set(slug, { order });
  return applyProjectListingFields(projects, fieldsBySlug);
}

/** Lowercase URL segment: letters, numbers, hyphens only (e.g. karyan-9). */
export function normalizeProjectSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function migrateProjectPayloadSlug(
  payload: ProjectPayload,
  oldSlug: string,
  newSlug: string
): ProjectPayload {
  const next = structuredClone(payload);
  const o = oldSlug.toLowerCase();
  const n = newSlug.toLowerCase();
  const ep = next.cta.enquiryProject?.trim().toLowerCase();
  if (!ep || ep === o) {
    next.cta = { ...next.cta, enquiryProject: n };
  }
  if (next.specs?.length) {
    next.specs = next.specs.map((row) =>
      row.label.trim().toLowerCase() === "slug" ? { ...row, value: n } : row
    );
  }
  return next;
}

/** Normalize listing cards — only fills href from title when needed; no placeholder defaults. */
export function normalizeProjectListingCards(
  projects: unknown[] | undefined
): ProjectListCard[] {
  if (!Array.isArray(projects)) return [];
  return projects.map((raw) => {
    const row = (raw && typeof raw === "object" ? raw : {}) as Partial<ProjectListCard>;
    const title = String(row.title ?? "").trim();
    const hrefRaw = String(row.href ?? "").trim();
    const slugFromHref = slugFromProjectHref(hrefRaw);
    const href =
      slugFromHref
        ? hrefRaw.startsWith("/")
          ? hrefRaw
          : `/${hrefRaw}`
        : title
          ? `/${normalizeProjectSlug(title)}`
          : "";
    return {
      title,
      description: String(row.description ?? "").trim(),
      image: String(row.image ?? "").trim(),
      href,
      type: String(row.type ?? "").trim(),
      location: String(row.location ?? "").trim(),
      status: String(row.status ?? "").trim(),
      featured: Boolean(row.featured),
      ...(typeof row.order === "number" && Number.isFinite(row.order)
        ? { order: row.order }
        : {}),
      ...(typeof row.rera === "string" && row.rera.trim() ? { rera: row.rera.trim() } : {}),
    };
  });
}

/** Cards shown on /projects — must have a title and valid project link. */
export function filterPublishableProjectCards<T extends ProjectListCard>(
  projects: T[]
): T[] {
  return projects.filter(
    (project) => project.title?.trim() && slugFromProjectHref(project.href ?? ""),
  );
}

export function slugFromProjectHref(href: string): string | null {
  const value = href.trim();
  if (!value) return null;
  let path = value;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      path = new URL(value).pathname;
    } catch {
      path = value;
    }
  }
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const parts = path.split("/").filter(Boolean);
  if (parts.length !== 1) return null;
  const slug = parts[0]?.trim().toLowerCase();
  return slug || null;
}

export function collectProjectsFromListing(payload: ProjectsListPayload): {
  slug: string;
  label: string;
  blurb: string;
  type: string;
  order: number;
}[] {
  return sortProjectsByOrder(payload.projects)
    .map((project) => {
      const slug = slugFromProjectHref(project.href);
      if (!slug) return null;
      return {
        slug,
        label: project.title?.trim() || slug,
        blurb: project.description?.trim() || `${project.type} project`,
        type: project.type?.trim() || "project",
        order: parseProjectOrder(project.order),
      };
    })
    .filter(
      (row): row is { slug: string; label: string; blurb: string; type: string; order: number } =>
        !!row
    );
}

export function collectProjectTypes(payload: ProjectsListPayload): string[] {
  const seen = new Set<string>();
  for (const project of payload.projects) {
    const type = project.type?.trim();
    if (!type) continue;
    const key = type.toLowerCase();
    if (!seen.has(key)) seen.add(key);
  }
  return Array.from(seen.values());
}

export function buildDefaultProjectPayload(
  slug: string,
  title: string,
  order?: number
): ProjectPayload {
  return {
    ...(order !== undefined ? { order } : {}),
    metadata: {
      title: `${title} | Karyan Project`,
      description: `${title} project details, specifications, gallery, and enquiry information.`,
    },
    header: {
      title,
      breadcrumbs: [
        { label: "Projects", href: "/projects" },
        { label: title },
      ],
      bgImage: "",
    },
    investmentHighlights: [
      { icon: "Building2", title: "Project Type", value: "Project", description: "Update from admin panel" },
      { icon: "MapPin", title: "Location", value: "TBD", description: "Update from admin panel" },
      { icon: "TrendingUp", title: "Status", value: "Upcoming", description: "Update from admin panel" },
    ],
    mainTitle: title,
    introParagraphs: ["Project details coming soon."],
    benefitsTitle: "Key Benefits",
    benefits: [],
    unitTypesTitle: "Available Units",
    unitTypes: [],
    architectsTitle: "Design Team",
    architects: [],
    gallery: [],
    floorPlansTitle: "Floor Plans",
    floorPlans: [],
    downloads: {
      brochureLabel: "Download Brochure",
      brochureUrl: "",
      priceListLabel: "Download Price List",
      priceListUrl: "",
    },
    specs: [
      { label: "Project", value: title },
      { label: "Slug", value: slug },
    ],
    sidebarFormTitle: `Enquire About ${title}`,
    cta: {
      title: `Interested in ${title}?`,
      description: "Submit your details and our team will get in touch.",
      enquiryProject: slug,
    },
  };
}
