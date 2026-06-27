import { connectMongo } from "@/lib/mongodb";
import { LeadSubmissionModel } from "@/models/LeadSubmission";

export type LeadSubmissionRow = {
  id: string;
  source: string;
  name: string;
  email: string;
  mobile: string;
  project: string;
  preferredDate: string;
  pagePath: string;
  createdAt: string;
};

export async function listLeadSubmissions(limit = 300): Promise<LeadSubmissionRow[]> {
  await connectMongo();
  const rows = await LeadSubmissionModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return rows.map((r) => ({
    id: String(r._id),
    source: r.source,
    name: r.name,
    email: r.email,
    mobile: r.mobile,
    project: r.project ?? "",
    preferredDate: r.preferredDate ?? "",
    pagePath: r.pagePath ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
  }));
}
