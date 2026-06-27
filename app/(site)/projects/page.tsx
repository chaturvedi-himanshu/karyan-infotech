import type { Metadata } from "next";
import { notFound } from "next/navigation";

/** Always read fresh projects listing from Mongo (not a stale cached snapshot). */
export const dynamic = "force-dynamic";
import PageHeader from "@/components/layout/PageHeader";
import { getProjectsListPayload, getSitePage } from "@/lib/cms/getters";
import { sortProjectsByOrder } from "@/lib/cms/projects";
import ProjectsPageContent, {
  type ProjectsListPayload,
} from "@/components/site/ProjectsPageContent";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildSeoMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getSitePage("projects");
  if (!doc) return { title: "Our Projects" };
  return buildSeoMetadata({
    title: doc.metaTitle,
    description: doc.metaDescription,
    seo: doc.seo,
  });
}

function normalizeProjectType(raw: string): string {
  return raw.trim().toLowerCase();
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?:
    | { type?: string | string[] }
    | Promise<{ type?: string | string[] }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const [doc, payload] = await Promise.all([getSitePage("projects"), getProjectsListPayload()]);
  if (!doc) notFound();
  const rawType = Array.isArray(resolvedSearchParams.type)
    ? resolvedSearchParams.type[0]
    : resolvedSearchParams.type;
  const activeType = rawType?.toLowerCase().trim();
  const filteredPayload: ProjectsListPayload = activeType
    ? {
        ...payload,
        projects: sortProjectsByOrder(
          payload.projects.filter((project) => normalizeProjectType(project.type) === activeType)
        ),
      }
    : payload;
  return (
    <>
      <SeoJsonLd raw={doc.seo?.schemaJsonLd} />
      <PageHeader
        title={payload.headerHeading || doc.metaTitle}
        subheading={payload.headerSubheading}
        bgImage={payload.headerBgImage}
        breadcrumbs={[{ label: "Projects" }]}
      />
      <ProjectsPageContent payload={filteredPayload} />
    </>
  );
}
