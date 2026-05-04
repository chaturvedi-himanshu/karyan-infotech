import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import {
  ArrowUpRight,
  FileText,
  FolderKanban,
  Home,
  Inbox,
  Newspaper,
  Settings2,
  Users,
} from "lucide-react";

const AREAS = [
  {
    href: "/admin/settings",
    title: "Site Settings",
    body: "Top bar phone, navigation menus, footer columns, social links, and legal lines.",
    where: "Every page — header & footer",
    Icon: Settings2,
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    tag: "Global",
  },
  {
    href: "/admin/home",
    title: "Home Page",
    body: "Hero slides, stat cards, philosophy, project portfolio, FAQs, and call-to-action strips.",
    where: "Homepage at /",
    Icon: Home,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tag: "Page",
  },
  {
    href: "/admin/projects",
    title: "Project Pages",
    body: "Photos, specs, highlights, and enquiry wording for each development.",
    where: "/karyan-trevana, /karyan-citywalk…",
    Icon: FolderKanban,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "Pages",
  },
  {
    href: "/admin/blog",
    title: "Blog Articles",
    body: "Rich-text articles, excerpts, dates, and images for news cards.",
    where: "/blog and home journal teaser",
    Icon: Newspaper,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    tag: "Content",
  },
  {
    href: "/admin/leads",
    title: "Leads Inbox",
    body: "All submissions from the enquiry popup and the contact page form.",
    where: "Internal — not public",
    Icon: Inbox,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    tag: "CRM",
  },
  {
    href: "/admin/pages",
    title: "Other Pages",
    body: "Company story, contact info, projects listing grid, and blog intro.",
    where: "/about, /contact, /projects, /blog",
    Icon: FileText,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tag: "Pages",
  },
  {
    href: "/admin/users",
    title: "Team & Access",
    body: "Create and review accounts that can log into this content studio.",
    where: "Internal — not public",
    Icon: Users,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    tag: "Admin",
  },
];

export default async function AdminHome() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Choose a section to edit. Changes go live on the public website immediately after saving."
      breadcrumbs={[{ label: "Overview" }]}
      userEmail={session.email}
    >
      {/* Welcome strip */}
      <div className="rounded-xl border border-[#F7B90F]/30 bg-gradient-to-r from-[#F7B90F]/8 to-amber-50/50 px-5 py-4">
        <p className="text-sm font-semibold text-slate-800">
          Welcome back
          {session.email ? (
            <span className="ml-1 font-normal text-slate-500">— {session.email}</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          You have access to all content areas below. After saving, open your site in a private
          window to review live changes.
        </p>
      </div>

      {/* Content areas grid */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Content Areas
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => {
            const Icon = a.Icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.border} border ${a.color}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span
                    className={`rounded-full ${a.bg} ${a.border} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${a.color}`}
                  >
                    {a.tag}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-[15px] font-bold text-slate-900">{a.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{a.body}</p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <span className="truncate text-[11px] text-slate-400">
                    <span className="font-medium text-slate-500">Visible: </span>
                    {a.where}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[#F7B90F]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Help strip */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Tip:</span> After saving any section, open{" "}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            your live site
          </a>{" "}
          in a private window to verify the changes without browser cache.
        </p>
      </div>
    </AdminShell>
  );
}
