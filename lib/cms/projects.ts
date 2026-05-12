import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import type { ProjectPayload } from "@/lib/cms/types";

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
}[] {
  return payload.projects
    .map((project) => {
      const slug = slugFromProjectHref(project.href);
      if (!slug) return null;
      return {
        slug,
        label: project.title?.trim() || slug,
        blurb: project.description?.trim() || `${project.type} project`,
        type: project.type?.trim() || "project",
      };
    })
    .filter((row): row is { slug: string; label: string; blurb: string; type: string } => !!row);
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

export function buildDefaultProjectPayload(slug: string, title: string): ProjectPayload {
  return {
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
