import nodemailer from "nodemailer";
import { connectMongo } from "@/lib/mongodb";
import { LeadSubmissionModel } from "@/models/LeadSubmission";

export type LeadSource =
  | "enquiry_modal"
  | "contact_page"
  | "about_page"
  | "property_details";

export type LeadInput = {
  source: LeadSource;
  name: string;
  email: string;
  mobile: string;
  project?: string;
  preferredDate?: string;
  pagePath?: string;
};

const MAX_LEN = {
  name: 200,
  email: 320,
  mobile: 80,
  project: 120,
  preferredDate: 32,
  pagePath: 500,
};
const ADMIN_RECIPIENTS = [
  "sales@globalrealtygroup.in",
  "amit.soam@globalrealtygroup.in",
];

function trim(str: unknown, max: number): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, max);
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getFormType(source: LeadSource): string {
  if (source === "contact_page") return "Contact Us";
  if (source === "about_page") return "About Us";
  if (source === "property_details") return "Property Details";
  return "Enquiry Popup";
}

function getEmailTransporter() {
  const enabled = process.env.SMTP_ENABLED?.trim().toLowerCase();
  if (enabled === "false") return null;
  const host = process.env.SMTP_HOST?.trim() || "";
  const user = process.env.SMTP_USER?.trim() || "";
  const pass = process.env.SMTP_PASS?.trim() || "";
  const port = Number(process.env.SMTP_PORT ?? 26);
  const secure = process.env.SMTP_SECURE === "true";
  const connectionTimeout = Number(process.env.SMTP_CONNECTION_TIMEOUT_MS ?? 5000);
  const greetingTimeout = Number(process.env.SMTP_GREETING_TIMEOUT_MS ?? 5000);
  const socketTimeout = Number(process.env.SMTP_SOCKET_TIMEOUT_MS ?? 5000);
  if (!host || !user || !pass || Number.isNaN(port)) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout,
    greetingTimeout,
    socketTimeout,
  });
}

function isLeadApiEnabled(): boolean {
  return process.env.LEAD_API_ENABLED?.trim().toLowerCase() === "true";
}

function getLeadApiUrl(): string {
  return (
    process.env.LEAD_API_URL?.trim() ||
    "https://helptrip.me/WebService/Lead.asmx/InsertLead"
  );
}

function getLeadProjectName(project?: string): string {
  const value = (project ?? "").trim().toLowerCase();
  if (!value) return "karyan website";
  if (value.includes("citywalk")) return "citywalk";
  if (value.includes("trevana")) return "trevana";
  if (value.includes("square")) return "square";
  if (value.includes("avenue")) return "avenue iv";
  if (value === "other") return "karyan website";
  return project!.trim();
}

async function sendToLeadApi(lead: {
  name: string;
  email: string;
  mobile: string;
  formType: string;
  project?: string;
  preferredDate?: string;
}) {
  const apiUrl = getLeadApiUrl();
  if (!isLeadApiEnabled()) {
    console.log(`[Lead API] Skipped: disabled (${apiUrl})`);
    return;
  }

  const remarkParts = [`Lead from ${lead.formType} Form - karyan website`];
  if (lead.preferredDate) remarkParts.push(`Preferred visit date: ${lead.preferredDate}`);

  const body = new URLSearchParams({
    Name: lead.name,
    ProjectName: getLeadProjectName(lead.project),
    City: "Gzb",
    Location: "NCR",
    Remark: remarkParts.join(" | "),
    Source: "karyan website",
    Email: lead.email,
    Mobile: lead.mobile,
  });
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const responseText = await res.text().catch(() => "");
    throw new Error(`Lead API failed with status ${res.status}: ${responseText}`);
  }
  console.log(`[Lead API] Success: ${apiUrl} (${lead.formType})`);
}

async function sendEmails(lead: {
  name: string;
  email: string;
  mobile: string;
  project: string;
  preferredDate: string;
  formType: string;
}) {
  const transporter = getEmailTransporter();
  if (!transporter) return;
  const fromUser = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || "";
  if (!fromUser) return;

  const name = escapeHtml(lead.name);
  const email = escapeHtml(lead.email);
  const mobile = escapeHtml(lead.mobile);
  const project = escapeHtml(lead.project || "General");
  const preferredDate = escapeHtml(lead.preferredDate || "N/A");
  const formType = escapeHtml(lead.formType);

  const adminEmailPromise = transporter.sendMail({
    from: fromUser,
    to: ADMIN_RECIPIENTS.join(", "),
    subject: "New Lead From - Karyan City Walk",
    html: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <tr>
          <td align="center">
            <table width="680" border="0" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:22px 26px;background:linear-gradient(135deg,#0f172a,#1f2937);">
                  <p style="margin:0;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#f7b90f;font-weight:700;">Karyan Lead Desk</p>
                  <h2 style="margin:8px 0 0 0;font-size:24px;line-height:1.2;color:#ffffff;">New Property Inquiry</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 26px 10px 26px;">
                  <p style="margin:0 0 12px 0;font-size:14px;color:#4b5563;">A new lead has been submitted on the website. Please find details below.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 26px 8px 26px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#faf8f2;border:1px solid #eadfbe;border-radius:12px;">
                    <tr>
                      <td style="padding:16px 18px;">
                        <p style="margin:0 0 10px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#8b6b2c;font-weight:700;">Lead Information</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Project Name:</strong> Karyan City Walk</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Form Type:</strong> ${formType}</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Name:</strong> ${name}</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Mobile:</strong> ${mobile}</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Project:</strong> ${project}</p>
                        <p style="margin:0 0 8px 0;font-size:14px;"><strong>Preferred visit date:</strong> ${preferredDate}</p>
                        <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 26px 24px 26px;">
                  <p style="margin:0;font-size:12px;color:#6b7280;">This is an automated alert from the website lead system.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });

  const userEmailPromise = transporter.sendMail({
    from: fromUser,
    to: lead.email,
    subject: "Thank You for Your Interest in - Karyan City Walk",
    html: `
      <html>
      <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
          <tr>
            <td align="center">
              <table width="620" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px;background:linear-gradient(135deg,#0f172a,#1f2937);">
                    <p style="margin:0;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#f7b90f;font-weight:700;">Karyan Infratech</p>
                    <h2 style="margin:8px 0 0 0;color:#ffffff;font-size:24px;line-height:1.2;">Thank You for Your Enquiry</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 6px 28px;">
                    <p style="margin:0 0 12px 0;font-size:16px;">Dear ${name},</p>
                    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#4b5563;">Thank you for reaching out to us regarding the <strong>Karyan City Walk</strong> project. We truly appreciate your interest.</p>
                    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#4b5563;">Our team will connect with you shortly to understand your requirements and share the next best options.</p>
                    <p style="margin:0 0 18px 0;font-size:14px;line-height:1.7;color:#4b5563;">If you have any immediate query, please feel free to reply to this email or contact our sales desk.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 22px 28px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#faf8f2;border:1px solid #eadfbe;border-radius:12px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <p style="margin:0;font-size:13px;color:#8b6b2c;"><strong>Project:</strong> Karyan City Walk</p>
                          <p style="margin:6px 0 0 0;font-size:13px;color:#8b6b2c;"><strong>Submitted from:</strong> ${formType}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <p style="margin:0;font-size:14px;">Best regards,</p>
                    <p style="margin:6px 0 0 0;font-size:16px;font-weight:700;color:#111827;">Karyan Infratech Group</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  await Promise.all([adminEmailPromise, userEmailPromise]);
}

export function sanitizeLeadInput(body: Record<string, unknown>): LeadInput {
  const rawSource = trim(body.source, 40);
  const source: LeadSource =
    rawSource === "contact_page" ||
    rawSource === "about_page" ||
    rawSource === "property_details"
      ? rawSource
      : "enquiry_modal";
  return {
    source,
    name: trim(body.name, MAX_LEN.name),
    email: trim(body.email, MAX_LEN.email),
    mobile: trim(body.mobile, MAX_LEN.mobile),
    project: trim(body.project, MAX_LEN.project),
    preferredDate: trim(body.preferredDate, MAX_LEN.preferredDate),
    pagePath: trim(body.pagePath, MAX_LEN.pagePath),
  };
}

export async function submitLead(rawLead: LeadInput) {
  if (!rawLead.name || !rawLead.email || !rawLead.mobile) {
    throw new Error("Name, email, and mobile are required.");
  }

  await connectMongo();
  await LeadSubmissionModel.create({
    source: rawLead.source,
    name: rawLead.name,
    email: rawLead.email,
    mobile: rawLead.mobile,
    project: rawLead.project ?? "",
    preferredDate: rawLead.preferredDate ?? "",
    pagePath: rawLead.pagePath ?? "",
  });

  const formType = getFormType(rawLead.source);
  const tasks = [
    sendToLeadApi({
      name: rawLead.name,
      email: rawLead.email,
      mobile: rawLead.mobile,
      formType,
      project: rawLead.project,
      preferredDate: rawLead.preferredDate,
    }),
    sendEmails({
      name: rawLead.name,
      email: rawLead.email,
      mobile: rawLead.mobile,
      project: rawLead.project ?? "",
      preferredDate: rawLead.preferredDate ?? "",
      formType,
    }),
  ];
  const results = await Promise.allSettled(tasks);
  if (results[0].status === "rejected") {
    console.error("Lead API submission failed", results[0].reason);
  }
  if (results[1].status === "rejected") {
    console.error("Lead email send failed", results[1].reason);
  }
}
