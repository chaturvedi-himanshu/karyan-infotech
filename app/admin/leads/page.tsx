import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { listLeadSubmissions } from "@/lib/leads/listLeads";

function sourceLabel(source: string) {
  if (source === "contact_page") return "Contact page";
  return "Enquiry popup";
}

export default async function AdminLeadsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const leads = await listLeadSubmissions();
  const contactLeads = leads.filter((row) => row.source === "contact_page").length;
  const popupLeads = leads.length - contactLeads;

  return (
    <AdminShell
      title="Form leads"
      subtitle="Every submission from the site-wide enquiry popup or the /contact form is stored here."
      breadcrumbs={[{ label: "Overview", href: "/admin" }, { label: "Form leads" }]}
      userEmail={session.email}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Total leads</p>
          <p className="mt-1 text-2xl font-bold text-lux-navy">{leads.length}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Contact page</p>
          <p className="mt-1 text-2xl font-bold text-lux-navy">{contactLeads}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Enquiry popup</p>
          <p className="mt-1 text-2xl font-bold text-lux-navy">{popupLeads}</p>
        </div>
      </div>
      <p className="text-sm text-stone-600">
        Newest first. Export is not automated yet — copy rows as needed or ask your developer to connect email
        notifications.
      </p>

      {leads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-200 bg-gradient-to-b from-stone-50 to-white px-6 py-12 text-center text-sm text-stone-500 shadow-sm">
          No submissions yet. When visitors use the enquiry modal or the contact form, entries will appear in this
          table.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)]">
          <table className="min-w-[1020px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-stone-100/90 text-xs font-bold uppercase tracking-wider text-stone-500">
                <th className="whitespace-nowrap px-4 py-3">When (UTC)</th>
                <th className="whitespace-nowrap px-4 py-3">Source</th>
                <th className="whitespace-nowrap px-4 py-3">Name</th>
                <th className="whitespace-nowrap px-4 py-3">Email</th>
                <th className="whitespace-nowrap px-4 py-3">Mobile</th>
                <th className="whitespace-nowrap px-4 py-3">Project</th>
                <th className="min-w-[220px] px-4 py-3">Message</th>
                <th className="whitespace-nowrap px-4 py-3">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {leads.map((row) => (
                <tr
                  key={row.id}
                  className="align-top text-stone-800 transition-colors odd:bg-white even:bg-stone-50/35 hover:bg-[#f7f2e8]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-stone-600">
                    {row.createdAt ? row.createdAt.replace("T", " ").slice(0, 19) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex whitespace-nowrap rounded-full border border-theme-bg/15 bg-theme-bg/10 px-2.5 py-0.5 text-xs font-semibold text-theme-fg">
                      {sourceLabel(row.source)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{row.name}</td>
                  <td className="max-w-[260px] whitespace-nowrap px-4 py-3 text-stone-600">
                    <a
                      className="block overflow-hidden text-ellipsis whitespace-nowrap text-lux-navy underline-offset-2 hover:underline"
                      href={`mailto:${row.email}`}
                      title={row.email}
                    >
                      {row.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                    <a className="hover:underline" href={`tel:${row.mobile.replace(/\s/g, "")}`}>
                      {row.mobile}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{row.project || "—"}</td>
                  <td className="max-w-[260px] px-4 py-3 text-stone-600">
                    <span className="line-clamp-4 whitespace-pre-wrap" title={row.message}>
                      {row.message || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">{row.pagePath || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
