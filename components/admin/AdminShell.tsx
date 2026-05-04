import Link from "next/link";
import AdminSidebar from "./AdminSidebar";

export type AdminBreadcrumb = { label: string; href?: string };

function Breadcrumbs({ items }: { items: AdminBreadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 ? <span className="text-slate-300">/</span> : null}
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-500 transition hover:text-slate-800"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-700">{item.label}</span>
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
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <AdminSidebar userEmail={userEmail} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Page header */}
        <header className="shrink-0 border-b border-slate-200 bg-white px-7 py-4 shadow-sm">
          {breadcrumbs?.length ? (
            <div className="mb-1">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-bold leading-tight tracking-tight text-slate-900">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-7 py-7">
            <div className="space-y-5">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
