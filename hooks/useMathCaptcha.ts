"use client";

import { useCallback, useEffect, useState } from "react";
import { getExpectedMathCaptchaAnswer } from "@/lib/forms/mathCaptcha.shared";
import type { MathCaptchaOp } from "@/lib/forms/mathCaptcha.shared";

type CaptchaChallenge = {
  a: number;
  b: number;
  op: MathCaptchaOp;
  prompt: string;
  token: string;
};

export type MathCaptchaPayload = {
  captchaToken: string;
  captchaAnswer: string;
  captchaA: number;
  captchaB: number;
  captchaOp: MathCaptchaOp;
};

export function useMathCaptcha(enabled = true) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [answer, setAnswerState] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(enabled);

  const loadChallenge = useCallback(
    async (clearError = true) => {
      if (!enabled) return;
      setLoading(true);
      setAnswerState("");
      if (clearError) setError(undefined);
      try {
        const res = await fetch("/api/leads/captcha", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load captcha");
        const data = (await res.json()) as CaptchaChallenge;
        setChallenge(data);
      } catch {
        setChallenge(null);
        setError("Could not load security check. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    },
    [enabled]
  );

  const reset = useCallback(() => loadChallenge(true), [loadChallenge]);

  useEffect(() => {
    if (!enabled) return;
    void loadChallenge(true);
  }, [enabled, loadChallenge]);

  const setAnswer = useCallback((value: string) => {
    setAnswerState(value);
    setError(undefined);
  }, []);

  const validate = useCallback(() => {
    if (!challenge) {
      setError("Security check is loading. Please wait.");
      return false;
    }
    const trimmed = answer.trim();
    if (!trimmed) {
      setError("Please solve the math question.");
      return false;
    }
    const parsed = Number(trimmed);
    const expected = getExpectedMathCaptchaAnswer(challenge.a, challenge.b, challenge.op);
    if (!Number.isInteger(parsed) || parsed !== expected) {
      setError("Incorrect answer. Please try again.");
      void loadChallenge(false);
      return false;
    }
    setError(undefined);
    return true;
  }, [answer, challenge, loadChallenge]);

  const getPayload = useCallback((): MathCaptchaPayload | null => {
    if (!challenge || !answer.trim()) return null;
    return {
      captchaToken: challenge.token,
      captchaAnswer: answer.trim(),
      captchaA: challenge.a,
      captchaB: challenge.b,
      captchaOp: challenge.op,
    };
  }, [answer, challenge]);

  const reportError = useCallback((message: string) => {
    setError(message);
    void loadChallenge(false);
  }, [loadChallenge]);

  return {
    challenge,
    answer,
    setAnswer,
    error,
    loading,
    validate,
    reset,
    getPayload,
    reportError,
  };
}
