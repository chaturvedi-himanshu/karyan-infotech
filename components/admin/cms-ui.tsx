"use client";

import { ChevronDown } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<T> | null | undefined
): T {
  if (!patch) return { ...base };
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(patch)) {
    const p = patch[key as keyof T];
    if (p === undefined) continue;
    const b = base[key as keyof T];
    if (
      p &&
      typeof p === "object" &&
      !Array.isArray(p) &&
      b &&
      typeof b === "object" &&
      !Array.isArray(b)
    ) {
      out[key] = deepMerge(b as Record<string, unknown>, p as Record<string, unknown>);
    } else {
      out[key] = p;
    }
  }
  return out as T;
}

export type CmsBreadcrumb = { label: string; href?: string };

export function CmsBreadcrumbs({ items }: { items: CmsBreadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-stone-300">/</span> : null}
          {item.href ? (
            <a
              href={item.href}
              className="font-medium text-stone-500 transition hover:text-lux-navy"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-lux-navy">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function CmsOnSiteBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex max-w-full items-start gap-2 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 px-3 py-2 text-xs text-amber-950 shadow-sm">
      <span
        className="mt-0.5 shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 font-bold uppercase tracking-wider text-amber-800"
        title="Where visitors see this"
      >
        On your website
      </span>
      <span className="leading-snug text-amber-950/90">{text}</span>
    </div>
  );
}

export function CmsPageIntro({
  title,
  children,
  where,
}: {
  title: string;
  children?: ReactNode;
  where: string;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white to-stone-50/80 p-5 shadow-sm">
      <div>
        <h2 className="font-display text-lg font-semibold text-lux-navy">{title}</h2>
        {children ? <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{children}</p> : null}
      </div>
      <CmsOnSiteBadge text={where} />
    </div>
  );
}

export function CmsSection({
  title,
  description,
  where,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  where: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-stone-200/90 bg-white/95 shadow-sm ring-1 ring-black/[0.02] transition hover:shadow-md"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-2xl px-5 py-4 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold text-lux-navy">{title}</h3>
            <ChevronDown className="h-4 w-4 shrink-0 text-stone-400 transition group-open:rotate-180" />
          </div>
          {description ? <p className="text-sm text-stone-600">{description}</p> : null}
          <CmsOnSiteBadge text={where} />
        </div>
      </summary>
      <div className="space-y-4 border-t border-stone-100 px-5 pb-5 pt-2">{children}</div>
    </details>
  );
}

export function CmsField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <p className="text-sm font-semibold text-stone-900">{label}</p>
        {hint ? <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-inner outline-none transition placeholder:text-stone-400 focus:border-lux-gold focus:ring-2 focus:ring-lux-gold/25";

export function CmsInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${className}`} />;
}

export function CmsTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-[88px] resize-y ${className}`} />;
}

export function CmsItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4 shadow-inner">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{title}</span>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
          >
            Remove
          </button>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function CmsButtonRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

export function CmsPrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-theme-bg to-theme-bg-soft px-5 py-2.5 text-sm font-semibold text-theme-on-bg shadow-md transition hover:brightness-110 disabled:opacity-50 ${className}`}
    />
  );
}

export function CmsGhostButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 ${className}`}
    />
  );
}

export function CmsSaveStatus({ message }: { message: string }) {
  if (!message) return null;
  const ok = message.toLowerCase().includes("saved");
  const fail = message.toLowerCase().includes("fail");
  return (
    <span
      className={`text-sm font-medium ${ok ? "text-emerald-700" : ""} ${fail ? "text-red-700" : ""} ${!ok && !fail ? "text-stone-600" : ""}`}
      role="status"
    >
      {message}
    </span>
  );
}
