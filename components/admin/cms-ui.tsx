"use client";

import {
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  ImageIcon,
  Loader2,
  MapPin,
  UploadCloud,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
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
      out[key] = deepMerge(
        b as Record<string, unknown>,
        p as Record<string, unknown>
      );
    } else {
      out[key] = p;
    }
  }
  return out as T;
}

export type CmsBreadcrumb = { label: string; href?: string };

export function CmsBreadcrumbs({ items }: { items: CmsBreadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-xs">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 ? <span className="text-slate-300">/</span> : null}
          {item.href ? (
            <a href={item.href} className="text-slate-500 transition hover:text-slate-800">
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-slate-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function CmsOnSiteBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
      <MapPin className="h-3 w-3 shrink-0 text-amber-500" />
      {text}
    </span>
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {children ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{children}</p>
          ) : null}
        </div>
        <div className="shrink-0">
          <CmsOnSiteBadge text={where} />
        </div>
      </div>
    </div>
  );
}

/**
 * CmsGroup — visual group header that organises related CmsSections.
 * Not collapsible itself; sections inside remain independently collapsible.
 */
export function CmsGroup({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {/* Group header */}
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-[#F7B90F]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <div className="ml-4 h-px flex-1 bg-slate-200" />
      </div>
      {/* Sections */}
      <div className="space-y-3 pl-3 border-l-2 border-slate-100">{children}</div>
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
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Section
          </p>
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
          {description ? (
            <p className="text-sm text-slate-500">{description}</p>
          ) : null}
          <div className="pt-0.5">
            <CmsOnSiteBadge text={where} />
          </div>
        </div>
        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        </span>
      </button>

      {open ? (
        <div className="border-t border-slate-100 bg-slate-50/40 px-5 pb-6 pt-4">
          <div className="space-y-4">{children}</div>
        </div>
      ) : null}
    </div>
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
        <p className="text-[13px] font-semibold text-slate-800">{label}</p>
        {hint ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{hint}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#F7B90F] focus:ring-2 focus:ring-[#F7B90F]/20";

export function CmsInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${className}`} />;
}

export function CmsTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-[88px] resize-y ${className}`}
    />
  );
}

export function CmsSelect({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputBase} cursor-pointer appearance-none pr-9 ${className}`}
    >
      {children}
    </select>
  );
}

export function CmsCheckbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-slate-300 accent-[#F7B90F]"
      />
      <span className="text-sm text-slate-800">{label}</span>
    </label>
  );
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100"
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7B90F] px-5 py-2.5 text-sm font-bold text-[#0f172a] shadow-sm transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50 ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] ${className}`}
    />
  );
}

export function CmsSaveStatus({ message }: { message: string }) {
  if (!message) return null;
  const ok = message.toLowerCase().includes("saved");
  const fail =
    message.toLowerCase().includes("fail") ||
    message.toLowerCase().includes("could not");
  const saving = message.toLowerCase().includes("saving");
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
        ok
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : fail
            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
            : saving
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
      }`}
      role="status"
    >
      {ok && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {fail && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
      {saving && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />}
      {message}
    </span>
  );
}

/**
 * CmsSaveBar — sticky save bar shown at the bottom of every portal form.
 */
export function CmsSaveBar({
  onSave,
  status,
  label = "Save changes",
}: {
  onSave: () => void;
  status: string;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 z-30">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/60">
        <CmsPrimaryButton onClick={onSave}>{label}</CmsPrimaryButton>
        <CmsSaveStatus message={status} />
        <p className="ml-auto text-xs text-slate-400">Saves update the live website immediately</p>
      </div>
    </div>
  );
}

/**
 * CmsLoadingSkeleton — animated placeholder shown while form data loads.
 */
export function CmsLoadingSkeleton({ label = "Loading content…" }: { label?: string }) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-2 h-4 w-1/3 rounded-md bg-slate-200" />
        <div className="h-3 w-2/3 rounded-md bg-slate-100" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100" />
            <div>
              <div className="mb-1 h-3.5 w-24 rounded-md bg-slate-200" />
              <div className="h-2.5 w-36 rounded-md bg-slate-100" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-8 rounded-lg bg-slate-100" />
            <div className="h-8 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
      <p className="text-center text-xs text-slate-400">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CmsImageUpload
   A drop-zone + URL input that uploads files to Firebase Storage.
   Props:
     value     — current URL stored in CMS (shown as preview)
     onChange  — called with the final public URL after upload (or on manual edit)
     folder    — Storage folder path, e.g. "home/slides"
     label     — optional field label (rendered inside CmsField externally)
───────────────────────────────────────────────────────────────────────────── */
type UploadState =
  | { phase: "idle" }
  | { phase: "uploading"; progress: number }
  | { phase: "done" }
  | { phase: "error"; message: string };

export function CmsImageUpload({
  value,
  onChange,
  folder = "cms-uploads",
  accept = "image/*",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
}) {
  const [upload, setUpload] = useState<UploadState>({ phase: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file) return;
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);
      setUpload({ phase: "uploading", progress: 0 });

      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUpload({ phase: "uploading", progress: pct });
        },
        (err) => {
          setUpload({ phase: "error", message: err.message });
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          onChange(url);
          setUpload({ phase: "done" });
          setTimeout(() => setUpload({ phase: "idle" }), 2500);
        }
      );
    },
    [folder, onChange]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isUploading = upload.phase === "uploading";
  const isDone = upload.phase === "done";
  const isError = upload.phase === "error";

  return (
    <div className="space-y-2">
      {/* ── URL text input ─────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://firebasestorage.googleapis.com/…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#b08d57] focus:outline-none focus:ring-2 focus:ring-[#b08d57]/20"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#b08d57] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#9a7a49] disabled:opacity-60"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* ── Drop zone ─────────────────────────────────────────────────── */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 transition-colors ${
          dragging
            ? "border-[#b08d57] bg-[#b08d57]/5"
            : "border-slate-200 bg-slate-50 hover:border-[#b08d57]/50 hover:bg-[#b08d57]/5"
        } ${isUploading ? "pointer-events-none" : ""}`}
      >
        {/* Upload idle / dragging state */}
        {upload.phase === "idle" && (
          <>
            <CloudUpload
              className={`h-7 w-7 transition-colors ${dragging ? "text-[#b08d57]" : "text-slate-400"}`}
            />
            <p className="text-center text-xs text-slate-500">
              <span className="font-semibold text-[#b08d57]">Click to browse</span> or drag &amp; drop an image
            </p>
            <p className="text-[10px] text-slate-400">PNG, JPG, WebP, SVG · max 10 MB</p>
          </>
        )}

        {/* Uploading */}
        {isUploading && (
          <div className="w-full space-y-2 px-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#b08d57]" />
                Uploading…
              </span>
              <span>{upload.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#b08d57] transition-all duration-200"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Done */}
        {isDone && (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Uploaded successfully
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <X className="h-4 w-4" />
            {(upload as { phase: "error"; message: string }).message}
          </div>
        )}
      </div>

      {/* ── Image preview ─────────────────────────────────────────────── */}
      {value && (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="max-h-48 w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/40 px-3 py-1.5">
            <span className="flex items-center gap-1 text-[10px] text-white/80">
              <ImageIcon className="h-3 w-3" />
              Preview
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="rounded p-0.5 text-white/60 transition hover:bg-white/20 hover:text-white"
              title="Clear image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
