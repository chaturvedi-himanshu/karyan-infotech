import Link from "next/link";
import {
  FileText,
  FolderKanban,
  Home,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Settings2,
  Users,
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

export type AdminBreadcrumb = { label: string; href?: string };

const NAV: {
  href: string;
  label: string;
  hint: string;
  Icon: typeof LayoutDashboard;
}[] = [
  {
    href: "/admin",
    label: "Overview",
    hint: "Map of everything you can edit",
    Icon: LayoutDashboard,
  },
  {
    href: "/admin/settings",
    label: "Site settings",
    hint: "Top bar, menus, footer, phone & social links",
    Icon: Settings2,
  },
  {
    href: "/admin/home",
    label: "Home page",
    hint: "Landing page story, hero, sections & contact strip",
    Icon: Home,
  },
  {
    href: "/admin/projects",
    label: "Project pages",
    hint: "Each development detail page (Trevana, CityWalk…)",
    Icon: FolderKanban,
  },
  {
    href: "/admin/blog",
    label: "Blog posts",
    hint: "Cards shown on /blog and home “Journal” teaser",
    Icon: Newspaper,
  },
  {
    href: "/admin/leads",
    label: "Form leads",
    hint: "Enquiry popup & contact page submissions",
    Icon: Inbox,
  },
  {
    href: "/admin/pages",
    label: "Other pages",
    hint: "About, Contact, Projects list, Blog intro",
    Icon: FileText,
  },
  {
    href: "/admin/users",
    label: "People & access",
    hint: "Who can log in to this studio",
    Icon: Users,
  },
];

function AdminBreadcrumbs({ items }: { items: AdminBreadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-stone-300">/</span> : null}
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium text-stone-500 transition hover:text-lux-navy"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-lux-navy">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function AdminShell({
  title,
  subtitle,
  breadcrumbs,
  userEmail,
  children,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: AdminBreadcrumb[];
  userEmail?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_20%_0%,rgba(198,160,82,0.12),transparent_50%),radial-gradient(ellipse_at_80%_10%,rgba(17,31,54,0.08),transparent_45%),linear-gradient(180deg,#f8f6f1_0%,#f1f0ee_100%)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-0 lg:flex-row lg:gap-8 lg:px-5 lg:py-10">
        <aside className="shrink-0 border-b border-stone-200/80 bg-white/70 px-4 py-5 backdrop-blur-md lg:w-[280px] lg:rounded-2xl lg:border lg:border-stone-200/80 lg:bg-white/90 lg:p-5 lg:shadow-xl">
          <div className="mb-6">
            <p className="font-display text-lg font-semibold tracking-tight text-lux-navy">Content Studio</p>
            <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
              Edit the live marketing site — no code, just forms.
            </p>
          </div>
          <nav className="space-y-0.5" aria-label="Studio navigation">
            {NAV.map(({ href, label, hint, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex gap-3 rounded-xl px-3 py-2.5 transition hover:bg-lux-cream"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-theme-fg transition group-hover:bg-theme-bg group-hover:text-theme-on-bg">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-stone-900">{label}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-stone-500">{hint}</span>
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-stone-200 pt-5">
            {userEmail ? (
              <p className="mb-3 truncate text-xs text-stone-500">
                Signed in as <span className="font-medium text-stone-800">{userEmail}</span>
              </p>
            ) : null}
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:bg-stone-50"
              >
                Log out
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-2 lg:py-0">
          <div className="rounded-2xl border border-stone-200/80 bg-white/95 p-6 shadow-xl shadow-stone-200/40 backdrop-blur-sm md:p-8">
            {breadcrumbs?.length ? <AdminBreadcrumbs items={breadcrumbs} /> : null}
            <header className="mb-8 border-b border-stone-100 pb-6">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-lux-navy md:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">{subtitle}</p>
              ) : null}
            </header>
            <div className="space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
