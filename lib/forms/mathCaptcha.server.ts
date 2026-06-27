import { createHmac, timingSafeEqual } from "crypto";
import {
  getExpectedMathCaptchaAnswer,
  type MathCaptchaOp,
} from "@/lib/forms/mathCaptcha.shared";

export {
  getExpectedMathCaptchaAnswer,
  type MathCaptchaChallenge,
  type MathCaptchaOp,
} from "@/lib/forms/mathCaptcha.shared";

function getCaptchaSecret(): string {
  const secret =
    process.env.CAPTCHA_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "";
  if (!secret && process.env.NODE_ENV === "production") {
    console.warn("[captcha] CAPTCHA_SECRET is not set.");
  }
  return secret || "karyan-dev-captcha-secret";
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createMathCaptchaChallenge() {
  const useAddition = Math.random() < 0.5;
  if (useAddition) {
    const a = randomInt(1, 12);
    const b = randomInt(1, 12);
    return { a, b, op: "+" as const, prompt: `${a} + ${b}` };
  }
  const a = randomInt(6, 18);
  const b = randomInt(1, a);
  return { a, b, op: "-" as const, prompt: `${a} − ${b}` };
}

export function signMathCaptcha(a: number, b: number, op: MathCaptchaOp): string {
  return createHmac("sha256", getCaptchaSecret())
    .update(`${a}:${b}:${op}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export function verifyMathCaptchaPayload(payload: {
  captchaToken?: unknown;
  captchaAnswer?: unknown;
  captchaA?: unknown;
  captchaB?: unknown;
  captchaOp?: unknown;
}): boolean {
  const a = Number(payload.captchaA);
  const b = Number(payload.captchaB);
  const op = payload.captchaOp;
  const token = typeof payload.captchaToken === "string" ? payload.captchaToken.trim() : "";
  const answerRaw = typeof payload.captchaAnswer === "string" ? payload.captchaAnswer.trim() : "";

  if (!token || !answerRaw || !Number.isInteger(a) || !Number.isInteger(b)) return false;
  if (op !== "+" && op !== "-") return false;
  if (a < 1 || a > 20 || b < 1 || b > 20) return false;
  if (op === "-" && b > a) return false;
  if (!safeEqual(signMathCaptcha(a, b, op), token)) return false;

  const answer = Number(answerRaw);
  if (!Number.isInteger(answer)) return false;
  return answer === getExpectedMathCaptchaAnswer(a, b, op);
}
