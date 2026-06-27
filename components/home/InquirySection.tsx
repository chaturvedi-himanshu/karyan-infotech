"use client";

import { useEffect, useState } from "react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { isCaptchaSubmitError, useLeadSubmission } from "@/hooks/useLeadSubmission";
import { useMathCaptcha } from "@/hooks/useMathCaptcha";
import MathCaptchaField from "@/components/shared/MathCaptchaField";

export default function InquirySection() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
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
  } = useMathCaptcha();

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", mobile: "" });
      void resetCaptcha();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [submitted, resetCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm({ ...form, [name]: nextValue });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof typeof form, string>> = {};
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
    const fieldsOk = validate();
    const captchaOk = validateCaptcha();
    if (!fieldsOk || !captchaOk) return;
    const captchaPayload = getCaptchaPayload();
    if (!captchaPayload) return;
    const result = await submitLead({
      source: "about_page",
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      project: "",
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/about",
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

  return (
    <section className="bg-lux-cream py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: heading */}
          <div>
            <div className="mb-6 flex justify-start">
              <SiteBrandLogo
                variant="onLight"
                asLink={false}
                className="h-10 w-auto max-w-[200px] sm:h-11"
              />
            </div>
            <h4
              className="mb-2 text-xs font-bold uppercase tracking-widest text-theme-fg-muted"
            >
              QUICK INQUIRY
            </h4>
            <h2
              className="mb-4 font-bold leading-tight text-theme-fg"
              style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
            >
              To stay updated with our projects and more
            </h2>
            <div className="h-0.5 w-10 bg-lux-gold" />
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="p-6 text-center">
                <div
                  className="mb-2 text-3xl font-bold text-lux-gold"
                >
                  ✓
                </div>
                <p className="font-semibold text-theme-fg">
                  Thank you! We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-theme-fg-muted">
                    Your name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-stone-300 bg-white px-[14px] py-[10px] text-sm text-theme-fg outline-none transition focus:border-lux-gold/60 focus:ring-2 focus:ring-lux-gold/25"
                    placeholder="Your name"
                  />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-theme-fg-muted">
                    Your email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-stone-300 bg-white px-[14px] py-[10px] text-sm text-theme-fg outline-none transition focus:border-lux-gold/60 focus:ring-2 focus:ring-lux-gold/25"
                    placeholder="Your email"
                  />
                  {errors.email ? (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-theme-fg-muted">
                    Your Mobile*
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full border border-stone-300 bg-white px-[14px] py-[10px] text-sm text-theme-fg outline-none transition focus:border-lux-gold/60 focus:ring-2 focus:ring-lux-gold/25"
                    placeholder="Your mobile number"
                  />
                  {errors.mobile ? (
                    <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                  ) : null}
                </div>
                <MathCaptchaField
                  prompt={captchaChallenge?.prompt ?? null}
                  value={captchaAnswer}
                  onChange={setCaptchaAnswer}
                  error={captchaError}
                  loading={captchaLoading}
                  labelClassName="mb-1 block text-xs font-semibold uppercase tracking-wide text-theme-fg-muted"
                  inputClassName="w-full border border-stone-300 bg-white px-[14px] py-[10px] text-sm text-theme-fg outline-none transition focus:border-lux-gold/60 focus:ring-2 focus:ring-lux-gold/25"
                />
                <button
                  type="submit"
                  disabled={loading || captchaLoading || !captchaChallenge}
                  className="w-full bg-lux-gold py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-lux-gold-dim disabled:cursor-wait disabled:opacity-80"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
