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

  return (
    <AdminShell
      title="Form leads"
      subtitle="Every submission from the site-wide enquiry popup or the /contact form is stored here."
      breadcrumbs={[{ label: "Overview", href: "/admin" }, { label: "Form leads" }]}
      userEmail={session.email}
    >
      <p className="text-sm text-stone-600">
        Newest first. Export is not automated yet — copy rows as needed or ask your developer to connect email
        notifications.
      </p>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50/80 px-6 py-10 text-center text-sm text-stone-500">
          No submissions yet. When visitors use the enquiry modal or the contact form, entries will appear in this
          table.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
          <table className="min-w-[920px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/90 text-xs font-bold uppercase tracking-wider text-stone-500">
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
                <tr key={row.id} className="align-top text-stone-800 hover:bg-lux-cream/40">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-stone-600">
                    {row.createdAt ? row.createdAt.replace("T", " ").slice(0, 19) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-theme-bg/10 px-2.5 py-0.5 text-xs font-semibold text-theme-fg">
                      {sourceLabel(row.source)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="max-w-[200px] break-all px-4 py-3 text-stone-600">
                    <a className="text-lux-navy underline-offset-2 hover:underline" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                    <a className="hover:underline" href={`tel:${row.mobile.replace(/\s/g, "")}`}>
                      {row.mobile}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{row.project || "—"}</td>
                  <td className="px-4 py-3 text-stone-600">
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
