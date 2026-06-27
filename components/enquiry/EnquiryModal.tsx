"use client";

import { useEffect, useId, useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import type { SiteProjectInterestOption } from "@/lib/cms/types";
import { isCaptchaSubmitError, useLeadSubmission } from "@/hooks/useLeadSubmission";
import { useMathCaptcha } from "@/hooks/useMathCaptcha";
import MathCaptchaField from "@/components/shared/MathCaptchaField";

const PROJECT_OPTIONS_FALLBACK: SiteProjectInterestOption[] = [
  { value: "", label: "Select a project" },
  { value: "trevana", label: "Karyan Trevana" },
  { value: "citywalk", label: "Karyan CityWalk" },
  { value: "avenue-iv", label: "Karyan Avenue IV" },
  { value: "square", label: "Karyan Square" },
  { value: "other", label: "Other / General" },
];

type EnquiryTab = "agent" | "site_visit";

type FormState = {
  name: string;
  email: string;
  mobile: string;
  project: string;
  preferredDate: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  mobile: "",
  project: "",
  preferredDate: "",
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const TAB_CONFIG: Record<
  EnquiryTab,
  { label: string; heading: string; subtitle: string }
> = {
  agent: {
    label: "Connect with an agent",
    heading: "Connect with an agent",
    subtitle: "Share your details — our team responds within one business day.",
  },
  site_visit: {
    label: "Book a site visit",
    heading: "Book a site visit",
    subtitle: "Pick a project and tell us when you would like to visit.",
  },
};

const fieldClass =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-lux-navy outline-none ring-lux-gold/30 transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500";

export default function EnquiryModal({
  isOpen,
  onClose,
  defaultProject = "",
  skipAutofocus = false,
  logoSrc,
  logoAlt,
  projectOptions = PROJECT_OPTIONS_FALLBACK,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
  skipAutofocus?: boolean;
  logoSrc?: string;
  logoAlt?: string;
  projectOptions?: SiteProjectInterestOption[];
}) {
  const panelId = useId();
  const [activeTab, setActiveTab] = useState<EnquiryTab>("agent");
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const { submitLead, loading } = useLeadSubmission();
  const {
    challenge: captchaChallenge,
    answer: captchaAnswer,
    setAnswer: setCaptchaAnswer,
    error: captchaError,
    loading: captchaLoading,
    validate: validateCaptcha,
    reset: resetCaptcha,
    getPayload: getCaptchaPayload,
    reportError: reportCaptchaError,
  } = useMathCaptcha(isOpen);

  const tabMeta = TAB_CONFIG[activeTab];

  useEffect(() => {
    if (!isOpen) return;
    queueMicrotask(() => {
      setActiveTab("agent");
      setForm({ ...initialForm, project: defaultProject || "" });
      setSubmitted(false);
      setErrors({});
    });
    if (skipAutofocus) return;
    const t = window.setTimeout(() => {
      document.getElementById("enquiry-name")?.focus({ preventScroll: true });
    }, 50);
    return () => window.clearTimeout(t);
  }, [isOpen, defaultProject, skipAutofocus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    if (activeTab === "site_visit" && !form.preferredDate) {
      nextErrors.preferredDate = "Please choose your preferred visit date.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldsOk = validate();
    const captchaOk = validateCaptcha();
    if (!fieldsOk || !captchaOk) return;

    const captchaPayload = getCaptchaPayload();
    if (!captchaPayload) return;

    const result = await submitLead({
      source: "enquiry_modal",
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      project: form.project,
      preferredDate: activeTab === "site_visit" ? form.preferredDate : "",
      pagePath: typeof window !== "undefined" ? window.location.pathname : "",
      ...captchaPayload,
    });
    if (!result.ok) {
      if (isCaptchaSubmitError(result.error)) {
        reportCaptchaError(result.error);
      } else {
        alert(result.error);
      }
      return;
    }
    setSubmitted(true);
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setForm(initialForm);
      setSubmitted(false);
      setActiveTab("agent");
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
        className="relative z-10 flex max-h-[min(92vh,680px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-stone-200/90 bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="shrink-0 border-b border-stone-100 bg-gradient-to-br from-lux-cream/80 to-white px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SiteBrandLogo
                src={logoSrc}
                alt={logoAlt}
                variant="onLight"
                asLink={false}
                width={100}
                height={28}
                className="!h-6 !w-auto max-w-[88px] object-contain object-left"
              />
              <h2 id={panelId} className="font-display mt-1.5 text-lg font-medium text-lux-navy sm:text-xl">
                {tabMeta.heading}
              </h2>
              <p className="mt-0.5 text-xs text-stone-600 sm:text-sm">{tabMeta.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 rounded-xl border border-stone-200/80 p-2 text-stone-500 outline-none transition hover:border-lux-gold/40 hover:bg-lux-cream hover:text-lux-navy focus-visible:ring-2 focus-visible:ring-lux-gold/50 focus-visible:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="mt-3 flex gap-1 rounded-lg bg-stone-100/90 p-1 ring-1 ring-stone-200/80"
            role="tablist"
            aria-label="Enquiry type"
          >
            {(Object.keys(TAB_CONFIG) as EnquiryTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "agent") {
                      setForm((prev) => ({ ...prev, preferredDate: "" }));
                      setErrors((prev) => ({ ...prev, preferredDate: undefined }));
                    }
                  }}
                  className={`flex-1 rounded-md px-2 py-2 text-center text-[11px] font-semibold leading-snug transition sm:px-2.5 sm:text-xs ${
                    isActive
                      ? "bg-white text-lux-navy shadow-sm ring-1 ring-stone-200/90"
                      : "text-stone-600 hover:text-lux-navy"
                  }`}
                >
                  {TAB_CONFIG[tab].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-lux-gold-dim" strokeWidth={1.25} />
              <p className="font-display mt-4 text-xl font-medium text-lux-navy">Thank you</p>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enquiry-name" className={labelClass}>
                    Name *
                  </label>
                  <input
                    id="enquiry-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={fieldClass}
                    autoComplete="name"
                  />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="enquiry-mobile" className={labelClass}>
                    Number *
                  </label>
                  <input
                    id="enquiry-mobile"
                    name="mobile"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    className={fieldClass}
                    autoComplete="tel"
                  />
                  {errors.mobile ? (
                    <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enquiry-email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    id="enquiry-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className={fieldClass}
                    autoComplete="email"
                  />
                  {errors.email ? (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="enquiry-project" className={labelClass}>
                    Project
                  </label>
                  <select
                    id="enquiry-project"
                    name="project"
                    value={form.project}
                    onChange={(e) => {
                      handleChange(e);
                      e.currentTarget.blur();
                    }}
                    className={fieldClass}
                  >
                    {projectOptions.map((o) => (
                      <option key={o.value || "any"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeTab === "site_visit" ? (
                <div>
                  <label htmlFor="enquiry-preferred-date" className={labelClass}>
                    Preferred visit date *
                  </label>
                  <input
                    id="enquiry-preferred-date"
                    name="preferredDate"
                    type="date"
                    required
                    min={todayIsoDate()}
                    value={form.preferredDate}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                  {errors.preferredDate ? (
                    <p className="mt-1 text-xs text-red-500">{errors.preferredDate}</p>
                  ) : null}
                </div>
              ) : null}

              <MathCaptchaField
                id="enquiry-math-captcha"
                prompt={captchaChallenge?.prompt ?? null}
                value={captchaAnswer}
                onChange={setCaptchaAnswer}
                error={captchaError}
                loading={captchaLoading}
                labelClassName={labelClass}
                inputClassName={fieldClass}
              />

              <button
                type="submit"
                disabled={loading || captchaLoading || !captchaChallenge}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-theme-bg py-3.5 text-sm font-semibold uppercase tracking-widest text-theme-on-bg transition hover:bg-theme-bg-muted disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {loading
                  ? "Sending…"
                  : activeTab === "site_visit"
                    ? "Book site visit"
                    : "Submit enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
