"use client";

import { useCallback, useState } from "react";
import type { MathCaptchaPayload } from "@/hooks/useMathCaptcha";

type LeadSource =
  | "enquiry_modal"
  | "contact_page"
  | "about_page"
  | "property_details";

type LeadPayload = MathCaptchaPayload & {
  source: LeadSource;
  name: string;
  email: string;
  mobile: string;
  project?: string;
  preferredDate?: string;
  pagePath?: string;
};

export type LeadSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export function useLeadSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLead = useCallback(async (payload: LeadPayload): Promise<LeadSubmitResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const message =
          typeof j.error === "string" ? j.error : "We could not process your request right now.";
        throw new Error(message);
      }
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitLead, loading, error };
}

export function isCaptchaSubmitError(message: string): boolean {
  return message.toLowerCase().includes("security check");
}
