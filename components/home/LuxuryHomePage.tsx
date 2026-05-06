import LuxuryHomeView from "@/components/home/LuxuryHomeView";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { DEFAULT_SITE_PAGES } from "@/lib/cms/defaults/sitePages";
import { getBlogPosts, getHomeContent, getSitePage, getSiteSettings } from "@/lib/cms/getters";

function mergeProjectsListPayload(
  fromCms: Record<string, unknown> | undefined
): ProjectsListPayload {
  const fb = DEFAULT_SITE_PAGES.find((p) => p.slug === "projects")!.payload as unknown as ProjectsListPayload;
  if (!fromCms || typeof fromCms !== "object") return fb;
  const projects = fromCms.projects;
  return {
    eyebrow: typeof fromCms.eyebrow === "string" ? fromCms.eyebrow : fb.eyebrow,
    title: typeof fromCms.title === "string" ? fromCms.title : fb.title,
    subtitle: typeof fromCms.subtitle === "string" ? fromCms.subtitle : fb.subtitle,
    projects: Array.isArray(projects) && projects.length ? (projects as ProjectsListPayload["projects"]) : fb.projects,
  };
}

export default async function LuxuryHomePage() {
  const [data, projectsDoc, site, blogPosts] = await Promise.all([
    getHomeContent(),
    getSitePage("projects"),
    getSiteSettings(),
    getBlogPosts(),
  ]);
  const projectsList = mergeProjectsListPayload(
    (projectsDoc?.payload ?? undefined) as Record<string, unknown> | undefined
  );
  return (
    <>
      <SeoJsonLd raw={data.seo?.schemaJsonLd} />
      <LuxuryHomeView
        data={data}
        projectsList={projectsList}
        brandLogoSrc={site.nav.headerLogoSrc}
        brandLogoAlt={site.nav.headerLogoAlt}
        deskPhone={site.nav.topBar.phone}
        deskPhoneHref={site.nav.topBar.phoneHref}
        blogPosts={blogPosts.slice(0, 10)}
      />
    </>
  );
}
