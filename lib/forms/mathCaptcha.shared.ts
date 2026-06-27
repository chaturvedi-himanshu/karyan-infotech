export type MathCaptchaOp = "+" | "-";

export type MathCaptchaChallenge = {
  a: number;
  b: number;
  op: MathCaptchaOp;
  prompt: string;
};

export function getExpectedMathCaptchaAnswer(a: number, b: number, op: MathCaptchaOp): number {
  return op === "+" ? a + b : a - b;
}
