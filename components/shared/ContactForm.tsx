"use client";

import { useEffect, useState } from "react";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import type { SiteProjectInterestOption } from "@/lib/cms/types";
import { useLeadSubmission } from "@/hooks/useLeadSubmission";

interface ContactFormProps {
  dark?: boolean;
  fixedProject?: string;
}

const PROJECT_OPTIONS_FALLBACK: SiteProjectInterestOption[] = [
  { value: "", label: "Select a project" },
  { value: "trevana", label: "Karyan Trevana" },
  { value: "citywalk", label: "Karyan CityWalk" },
  { value: "avenue-iv", label: "Karyan Avenue IV" },
  { value: "square", label: "Karyan Square" },
  { value: "other", label: "Other / General" },
];

export default function ContactForm({ dark = false, fixedProject }: ContactFormProps) {
  const { projectOptions } = useEnquiry();
  const options = projectOptions.length ? projectOptions : PROJECT_OPTIONS_FALLBACK;
  const normalizedFixedProject = fixedProject?.trim() || "";
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    project: normalizedFixedProject,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const { submitLead, loading } = useLeadSubmission();

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: "",
        email: "",
        mobile: "",
        project: normalizedFixedProject,
        message: "",
      });
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [submitted, normalizedFixedProject]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    if (!validate()) return;
    try {
      const pagePath = typeof window !== "undefined" ? window.location.pathname : "/contact";
      const source = normalizedFixedProject ? "property_details" : "contact_page";
      const ok = await submitLead({
        source,
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        project: normalizedFixedProject || form.project,
        message: form.message.trim(),
        pagePath,
      });
      if (!ok) throw new Error("Request failed");
      setSubmitted(true);
      setErrors({});
    } catch {
      alert("We could not send your message. Please try again or use the phone number above.");
    }
  };

  const labelClass = dark
    ? "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-300"
    : "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500";

  const inputClass = dark
    ? "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition placeholder:text-stone-300/80 focus:border-lux-gold/55 focus:ring-2 focus:ring-lux-gold/30"
    : "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-[#2b2b2b] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] outline-none transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2 focus:ring-lux-gold/25";
  const errorClass = "mt-1 text-xs text-red-500";

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="text-4xl mb-3" style={{ color: "#F7B90F" }}>✓</div>
        <p className="font-semibold" style={{ color: dark ? "#fff" : "#292929" }}>
          Thank you! We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* {normalizedFixedProject ? (
        <div className="rounded-xl border border-lux-gold/30 bg-lux-cream/65 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-lux-gold-dim">
            Enquiry For
          </p>
          <p className="mt-1 text-sm font-semibold text-lux-navy">{normalizedFixedProject}</p>
        </div>
      ) : null} */}
      <div>
        <label className={labelClass}>Your Name *</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.name ? <p className={errorClass}>{errors.name}</p> : null}
      </div>
      <div>
        <label className={labelClass}>Mobile Number *</label>
        <input
          type="tel"
          name="mobile"
          required
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          placeholder="+91 98765 43210"
          value={form.mobile}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.mobile ? <p className={errorClass}>{errors.mobile}</p> : null}
      </div>
      <div>
        <label className={labelClass}>Email Address *</label>
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>
      {!normalizedFixedProject ? (
        <div>
          <label className={labelClass}>Project of Interest</label>
          <select
            name="project"
            value={form.project}
            onChange={(e) => {
              handleChange(e);
              e.currentTarget.blur();
            }}
            className={inputClass}
          >
            {options.map((o) => (
              <option key={o.value || "any"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <label className={labelClass}>Message</label>
        <textarea
          name="message"
          rows={3}
          placeholder="Your message..."
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
        {errors.message ? <p className={errorClass}>{errors.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[linear-gradient(135deg,#a07c3a,#c6a96a)] py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_26px_-14px_rgba(160,124,58,0.8)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
