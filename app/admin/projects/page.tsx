import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { ArrowRight } from "lucide-react";
import { getSitePage } from "@/lib/cms/getters";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import { collectProjectsFromListing } from "@/lib/cms/projects";

export default async function AdminProjectsIndex() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const projectsDoc = await getSitePage("projects");
  const listingPayload = projectsDoc?.payload as ProjectsListPayload | undefined;
  const projects = listingPayload ? collectProjectsFromListing(listingPayload) : [];

  return (
    <AdminShell
      title="Project pages"
      subtitle="Choose a development to edit its public detail page — photos, copy, and enquiry area."
      breadcrumbs={[{ label: "Overview", href: "/admin" }, { label: "Project pages" }]}
      userEmail={session.email}
    >
      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-200 bg-white px-5 py-8 text-sm text-stone-600">
          No projects found in listing page yet. Add cards in Admin - Pages - Projects first.
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/projects/${p.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-lux-navy">{p.label}</h2>
              <p className="mt-1 text-sm text-stone-600">{p.blurb}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{p.type}</p>
              <p className="mt-3 text-xs text-stone-500">
                Live URL: <span className="font-mono text-stone-700">/{p.slug}</span>
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-lux-navy">
              Edit this project
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
