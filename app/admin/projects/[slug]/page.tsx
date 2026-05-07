import { getAdminSession } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProjectPortalForm from "@/components/admin/ProjectPortalForm";
import { getSitePage } from "@/lib/cms/getters";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import { collectProjectsFromListing } from "@/lib/cms/projects";

export default async function AdminProjectEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { slug } = await params;
  const projectsDoc = await getSitePage("projects");
  const listingPayload = projectsDoc?.payload as ProjectsListPayload | undefined;
  const projects = listingPayload ? collectProjectsFromListing(listingPayload) : [];
  const project = projects.find((row) => row.slug === slug);
  if (!project) notFound();

  const name = project.label;

  return (
    <AdminShell
      title={name}
      subtitle="Structured sections mirror the public project page from hero to footer CTA."
      breadcrumbs={[
        { label: "Overview", href: "/admin" },
        { label: "Project pages", href: "/admin/projects" },
        { label: name },
      ]}
      userEmail={session.email}
    >
      <ProjectPortalForm key={slug} slug={slug} />
    </AdminShell>
  );
}
