"use client";

import { useState } from "react";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import type { SiteProjectInterestOption } from "@/lib/cms/types";

interface ContactFormProps {
  dark?: boolean;
}

const PROJECT_OPTIONS_FALLBACK: SiteProjectInterestOption[] = [
  { value: "", label: "Select a project" },
  { value: "trevana", label: "Karyan Trevana" },
  { value: "citywalk", label: "Karyan CityWalk" },
  { value: "avenue-iv", label: "Karyan Avenue IV" },
  { value: "square", label: "Karyan Square" },
  { value: "other", label: "Other / General" },
];

export default function ContactForm({ dark = false }: ContactFormProps) {
  const { projectOptions } = useEnquiry();
  const options = projectOptions.length ? projectOptions : PROJECT_OPTIONS_FALLBACK;
  const [form, setForm] = useState({ name: "", email: "", mobile: "", project: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
          project: form.project,
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #ddd",
    padding: "10px 14px",
    fontSize: "14px",
    color: dark ? "#fff" : "#292929",
    background: dark ? "rgba(255,255,255,0.08)" : "#fff",
    outline: "none",
    marginBottom: "2px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "4px",
    color: dark ? "#ccc" : "#5e646a",
  };

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label style={labelStyle}>Your Name *</label>
        <input type="text" name="name" required placeholder="Your name" value={form.name} onChange={handleChange} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Mobile Number *</label>
        <input type="tel" name="mobile" required placeholder="+91 98765 43210" value={form.mobile} onChange={handleChange} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email Address *</label>
        <input type="email" name="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Project of Interest</label>
        <select
          name="project"
          value={form.project}
          onChange={(e) => {
            handleChange(e);
            e.currentTarget.blur();
          }}
          style={inputStyle}
        >
          {options.map((o) => (
            <option key={o.value || "any"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          name="message"
          rows={3}
          placeholder="Your message..."
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, resize: "none" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 font-semibold uppercase tracking-wider text-sm text-white transition-opacity"
        style={{ background: "#F7B90F", border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
