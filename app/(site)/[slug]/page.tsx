import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPageView, { projectMetadata } from "@/components/projects/ProjectPageView";
import { getProjectPayload } from "@/lib/cms/getters";

const RESERVED_SLUGS = new Set(["about", "contact", "projects", "blog", "thank-you", "admin", "api"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};
  const data = await getProjectPayload(slug);
  if (!data) return {};
  return projectMetadata(data);
}

export default async function DynamicProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();
  const data = await getProjectPayload(slug);
  if (!data) notFound();
  return <ProjectPageView data={data} />;
}
