"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings2,
  Users,
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

const NAV = [
  {
    href: "/admin",
    label: "Overview",
    hint: "Dashboard home",
    Icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    hint: "Nav, footer & branding",
    Icon: Settings2,
  },
  {
    href: "/admin/home",
    label: "Home Page",
    hint: "Hero, stats & sections",
    Icon: Home,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    hint: "Development detail pages",
    Icon: FolderKanban,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    hint: "Articles & journal cards",
    Icon: Newspaper,
  },
  {
    href: "/admin/leads",
    label: "Leads Inbox",
    hint: "Enquiry submissions",
    Icon: Inbox,
  },
  {
    href: "/admin/pages",
    label: "Other Pages",
    hint: "About, Contact & more",
    Icon: FileText,
  },
  {
    href: "/admin/users",
    label: "Team & Access",
    hint: "Admin user management",
    Icon: Users,
  },
];

export default function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="flex h-screen w-[230px] shrink-0 flex-col bg-[#0f172a]">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-[18px]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7B90F]">
          <span className="text-sm font-black text-[#0f172a]">K</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-white">Karyan Studio</p>
          <p className="text-[10px] text-slate-500">Content Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600">
          Workspace
        </p>
        <div className="space-y-px">
          {NAV.map(({ href, label, hint, Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                    active
                      ? "bg-[#F7B90F] text-[#0f172a]"
                      : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium leading-none">
                    {label}
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-[10px] ${
                      active ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {hint}
                  </span>
                </span>
                {active && (
                  <span className="ml-auto h-4 w-0.5 shrink-0 rounded-full bg-[#F7B90F]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 p-3">
        {userEmail ? (
          <div className="mb-2.5 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F7B90F] text-[10px] font-black text-[#0f172a]">
              {userEmail[0].toUpperCase()}
            </div>
            <p className="min-w-0 flex-1 truncate text-[11px] text-slate-400">{userEmail}</p>
          </div>
        ) : null}
        <div className="flex gap-1.5">
          <form action={logoutAdmin} className="flex-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>
          </form>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View live site"
            className="flex items-center justify-center rounded-lg bg-white/5 px-2.5 py-2 text-slate-500 transition hover:bg-white/10 hover:text-slate-300"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
