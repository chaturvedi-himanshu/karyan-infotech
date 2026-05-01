import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import {
  ArrowRight,
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
    title: "Site settings",
    body: "Phone in the top bar, main menu links, footer columns, social links, and legal lines.",
    where: "Every page — header and footer.",
    Icon: Settings2,
    accent: "from-stone-700 to-stone-900",
  },
  {
    href: "/admin/home",
    title: "Home page",
    body: "Hero slides, story sections, FAQs, journal teaser, and the final call-to-action.",
    where: "Your homepage at /.",
    Icon: Home,
    accent: "from-theme-bg to-theme-bg-soft",
  },
  {
    href: "/admin/projects",
    title: "Project detail pages",
    body: "Each development: photos, specs, highlights, and enquiry wording.",
    where: "URLs like /karyan-trevana, /karyan-citywalk…",
    Icon: FolderKanban,
    accent: "from-amber-700 to-orange-900",
  },
  {
    href: "/admin/blog",
    title: "Blog articles",
    body: "Rich-text articles (Jodit), excerpts, dates, and images for news cards.",
    where: "/blog and home page journal teaser.",
    Icon: Newspaper,
    accent: "from-violet-700 to-indigo-900",
  },
  {
    href: "/admin/leads",
    title: "Form leads inbox",
    body: "Submissions from the enquiry popup and the contact page form.",
    where: "Not public — your team only.",
    Icon: Inbox,
    accent: "from-rose-800 to-red-950",
  },
  {
    href: "/admin/pages",
    title: "About, Contact & lists",
    body: "Company story, contact rows, map, projects grid, and blog intro.",
    where: "/about, /contact, /projects, /blog header.",
    Icon: FileText,
    accent: "from-emerald-800 to-teal-900",
  },
  {
    href: "/admin/users",
    title: "People who can edit",
    body: "Create or review accounts that may log into this studio.",
    where: "Does not appear on the public site.",
    Icon: Users,
    accent: "from-slate-600 to-slate-800",
  },
];

export default async function AdminHome() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      title="Welcome to your content studio"
      subtitle="Pick an area to edit. Each card explains what visitors see on the live website."
      breadcrumbs={[{ label: "Overview" }]}
      userEmail={session.email}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {AREAS.map((a) => {
          const Icon = a.Icon;
          return (
          <Link
            key={a.href}
            href={a.href}
            className="group relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90 ${a.accent}`}
            />
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lux-cream text-lux-navy ring-1 ring-stone-200/80 transition group-hover:ring-lux-gold/40">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold text-lux-navy">{a.title}</h2>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:text-lux-gold-dim" />
                </div>
                <p className="text-sm leading-relaxed text-stone-600">{a.body}</p>
                <p className="rounded-lg bg-amber-50/90 px-3 py-2 text-xs leading-snug text-amber-950/90 ring-1 ring-amber-100">
                  <span className="font-semibold text-amber-900">Visitors see this: </span>
                  {a.where}
                </p>
              </div>
            </div>
          </Link>
          );
        })}
      </div>

      <p className="text-center text-xs text-stone-500">
        Tip: after saving any area, open your live site in a private window to review changes without cache.
      </p>
    </AdminShell>
  );
}
