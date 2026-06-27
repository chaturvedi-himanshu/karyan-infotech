import { NextResponse } from "next/server";
import {
  createMathCaptchaChallenge,
  signMathCaptcha,
} from "@/lib/forms/mathCaptcha.server";

export const runtime = "nodejs";

export async function GET() {
  const challenge = createMathCaptchaChallenge();
  const token = signMathCaptcha(challenge.a, challenge.b, challenge.op);

  return NextResponse.json({
    a: challenge.a,
    b: challenge.b,
    op: challenge.op,
    prompt: challenge.prompt,
    token,
  });
}
