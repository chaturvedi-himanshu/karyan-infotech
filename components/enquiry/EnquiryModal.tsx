"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { X, Send, CheckCircle2 } from "lucide-react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import type { SiteProjectInterestOption } from "@/lib/cms/types";
import { useLeadSubmission } from "@/hooks/useLeadSubmission";

const PROJECT_OPTIONS_FALLBACK: SiteProjectInterestOption[] = [
  { value: "", label: "Select a project" },
  { value: "trevana", label: "Karyan Trevana" },
  { value: "citywalk", label: "Karyan CityWalk" },
  { value: "avenue-iv", label: "Karyan Avenue IV" },
  { value: "square", label: "Karyan Square" },
  { value: "other", label: "Other / General" },
];

type FormState = {
  name: string;
  email: string;
  mobile: string;
  project: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  mobile: "",
  project: "",
  message: "",
};

export default function EnquiryModal({
  isOpen,
  onClose,
  defaultProject = "",
  logoSrc,
  logoAlt,
  projectOptions = PROJECT_OPTIONS_FALLBACK,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
  logoSrc?: string;
  logoAlt?: string;
  projectOptions?: SiteProjectInterestOption[];
}) {
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const { submitLead, loading } = useLeadSubmission();

  useEffect(() => {
    if (!isOpen) return;
    queueMicrotask(() => {
      setForm({ ...initialForm, project: defaultProject || "" });
      setSubmitted(false);
      setErrors({});
    });
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [isOpen, defaultProject]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const mobile = form.mobile.trim();

    if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(name)) {
      nextErrors.name = "Enter a valid name (2-80 letters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!/^\d{10}$/.test(mobile)) {
      nextErrors.mobile = "Phone number must be exactly 10 digits.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const ok = await submitLead({
        source: "enquiry_modal",
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        project: form.project,
        message: form.message.trim(),
        pagePath: typeof window !== "undefined" ? window.location.pathname : "",
      });
      if (!ok) throw new Error("Request failed");
      setSubmitted(true);
      setErrors({});
    } catch {
      alert("We could not send your enquiry. Please try again or call the desk.");
    }
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setForm(initialForm);
      setSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-theme-bg/65 backdrop-blur-sm transition-opacity"
        aria-label="Close enquiry"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={panelId}
        className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-stone-200/90 bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-100 bg-gradient-to-br from-lux-cream/80 to-white px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <SiteBrandLogo
              src={logoSrc}
              alt={logoAlt}
              variant="onLight"
              asLink={false}
              className="h-8 w-auto max-w-[180px]"
            />
            <h2 id={panelId} className="font-display mt-2 text-2xl font-medium text-lux-navy">
              Enquire with us
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Share your details — our desk responds within one business day.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-stone-200/80 p-2 text-stone-500 transition hover:border-lux-gold/40 hover:bg-lux-cream hover:text-lux-navy"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-lux-gold-dim" strokeWidth={1.25} />
              <p className="font-display mt-4 text-xl font-medium text-lux-navy">
                Thank you
              </p>
              <p className="mt-2 max-w-xs text-sm text-stone-600">
                We&apos;ve received your enquiry and will reach out shortly.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 rounded-xl bg-theme-bg px-8 py-3 text-sm font-semibold uppercase tracking-widest text-theme-on-bg transition hover:bg-theme-bg-muted"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Full name *
                </label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-lux-navy outline-none ring-lux-gold/30 transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2"
                />
                {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Mobile *
                </label>
                <input
                  name="mobile"
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="\d{10}"
                  maxLength={10}
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+91 …"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-lux-navy outline-none ring-lux-gold/30 transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2"
                />
                {errors.mobile ? <p className="mt-1 text-xs text-red-500">{errors.mobile}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-lux-navy outline-none ring-lux-gold/30 transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2"
                />
                {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Project of interest
                </label>
                <select
                  name="project"
                  value={form.project}
                  onChange={(e) => {
                    handleChange(e);
                    e.currentTarget.blur();
                  }}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-lux-navy outline-none ring-lux-gold/30 transition focus:border-lux-gold/50 focus:ring-2"
                >
                  {projectOptions.map((o) => (
                    <option key={o.value || "any"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Corridor, unit type, timeline…"
                  className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-lux-navy outline-none ring-lux-gold/30 transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2"
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-theme-bg py-3.5 text-sm font-semibold uppercase tracking-widest text-theme-on-bg transition hover:bg-theme-bg-muted disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending…" : "Submit enquiry"}
              </button>
              <p className="text-center text-xs text-stone-500">
                Prefer the full page?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-lux-gold-dim underline-offset-2 hover:text-lux-navy hover:underline"
                  onClick={handleClose}
                >
                  Contact &amp; map
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
