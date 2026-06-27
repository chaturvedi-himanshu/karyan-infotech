import { NextResponse } from "next/server";
import { verifyMathCaptchaPayload } from "@/lib/forms/mathCaptcha.server";
import { sanitizeLeadInput, submitLead } from "@/lib/leads/submitLead";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!verifyMathCaptchaPayload(body)) {
    return NextResponse.json(
      { error: "Security check failed. Please solve the math question and try again." },
      { status: 400 }
    );
  }

  const lead = sanitizeLeadInput(body);
  if (!lead.name || !lead.email || !lead.mobile) {
    return NextResponse.json(
      { error: "Name, email, and mobile are required." },
      { status: 400 }
    );
  }

  try {
    await submitLead(lead);
  } catch (e) {
    console.error("Lead save failed", e);
    return NextResponse.json({ error: "Could not save. Try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
