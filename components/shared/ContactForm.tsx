"use client";

import { useEffect, useState } from "react";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import type { SiteProjectInterestOption } from "@/lib/cms/types";

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
  const [loading, setLoading] = useState(false);

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
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact_page",
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          project: normalizedFixedProject || form.project,
          message: form.message.trim(),
          pagePath: typeof window !== "undefined" ? window.location.pathname : "/contact",
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(typeof j.error === "string" ? j.error : "Request failed");
      }
      setSubmitted(true);
    } catch {
      alert("We could not send your message. Please try again or use the phone number above.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = dark
    ? "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-300"
    : "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500";

  const inputClass = dark
    ? "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition placeholder:text-stone-300/80 focus:border-lux-gold/55 focus:ring-2 focus:ring-lux-gold/30"
    : "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-[#2b2b2b] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] outline-none transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2 focus:ring-lux-gold/25";

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
      </div>
      <div>
        <label className={labelClass}>Mobile Number *</label>
        <input
          type="tel"
          name="mobile"
          required
          placeholder="+91 98765 43210"
          value={form.mobile}
          onChange={handleChange}
          className={inputClass}
        />
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
