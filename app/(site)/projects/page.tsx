import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { getSitePage } from "@/lib/cms/getters";
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

export default async function ProjectsPage() {
  const doc = await getSitePage("projects");
  if (!doc) notFound();
  const payload = doc.payload as ProjectsListPayload;
  return (
    <>
      <SeoJsonLd raw={doc.seo?.schemaJsonLd} />
      <PageHeader
        title={payload.headerHeading || doc.metaTitle}
        subheading={payload.headerSubheading}
        bgImage={payload.headerBgImage}
        breadcrumbs={[{ label: "Projects" }]}
      />
      <ProjectsPageContent payload={payload} />
    </>
  );
}
