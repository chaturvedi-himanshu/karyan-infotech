"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type JsonEditorVariant = "home" | "site" | "projectPayload" | "blog" | "sitePage";

function extractForEdit(json: Record<string, unknown>, variant: JsonEditorVariant): unknown {
  switch (variant) {
    case "home":
      return json.data ?? {};
    case "site":
      return { nav: json.nav ?? {}, footer: json.footer ?? {} };
    case "projectPayload":
      return json.payload ?? {};
    case "blog":
      return { posts: json.posts ?? [] };
    case "sitePage":
      return {
        metaTitle: json.metaTitle ?? "",
        metaDescription: json.metaDescription ?? "",
        payload: json.payload ?? {},
      };
    default:
      return json;
  }
}

function prepareForSave(value: unknown, variant: JsonEditorVariant): unknown {
  switch (variant) {
    case "home":
      return value;
    case "site":
      return value;
    case "projectPayload":
      return value;
    case "blog":
      return value;
    case "sitePage":
      return value;
    default:
      return value;
  }
}

type Primitive = string | number | boolean | null;

function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function humanize(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type Props = {
  endpoint: string;
  label?: string;
  variant: JsonEditorVariant;
};

export function JsonEditorForm({ endpoint, label = "JSON", variant }: Props) {
  const [formData, setFormData] = useState<unknown>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(endpoint, { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const initial = extractForEdit(j as Record<string, unknown>, variant);
        setFormData(initial);
      })
      .catch(() => {
        if (!cancelled) setFormData({});
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, variant]);

  const save = useCallback(async () => {
    setStatus("Saving…");
    try {
      const parsed = prepareForSave(formData, variant);
      const res = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const t = await res.text();
        setStatus(`Error ${res.status}: ${t}`);
        return;
      }
      setStatus("Saved.");
    } catch (e) {
      setStatus(String(e));
    }
  }, [endpoint, formData, variant]);

  const updateAtPath = useCallback((path: (string | number)[], nextValue: unknown) => {
    setFormData((prev: unknown) => {
      const clone = structuredClone(prev ?? {});
      let cursor: unknown = clone;
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        if (typeof key === "number") {
          if (!Array.isArray(cursor)) return prev;
          cursor = cursor[key];
        } else {
          if (!cursor || typeof cursor !== "object") return prev;
          cursor = (cursor as Record<string, unknown>)[key];
        }
      }
      const last = path[path.length - 1];
      if (typeof last === "number") {
        if (!Array.isArray(cursor)) return prev;
        cursor[last] = nextValue;
      } else {
        if (!cursor || typeof cursor !== "object") return prev;
        (cursor as Record<string, unknown>)[last] = nextValue;
      }
      return clone;
    });
  }, []);

  const removeFromArray = useCallback((path: (string | number)[], index: number) => {
    setFormData((prev: unknown) => {
      const clone = structuredClone(prev ?? {});
      let cursor: unknown = clone;
      for (const key of path) {
        if (typeof key === "number") {
          if (!Array.isArray(cursor)) return prev;
          cursor = cursor[key];
        } else {
          if (!cursor || typeof cursor !== "object") return prev;
          cursor = (cursor as Record<string, unknown>)[key];
        }
      }
      if (!Array.isArray(cursor)) return prev;
      cursor.splice(index, 1);
      return clone;
    });
  }, []);

  const addToArray = useCallback((path: (string | number)[], template: unknown) => {
    setFormData((prev: unknown) => {
      const clone = structuredClone(prev ?? {});
      let cursor: unknown = clone;
      for (const key of path) {
        if (typeof key === "number") {
          if (!Array.isArray(cursor)) return prev;
          cursor = cursor[key];
        } else {
          if (!cursor || typeof cursor !== "object") return prev;
          cursor = (cursor as Record<string, unknown>)[key];
        }
      }
      if (!Array.isArray(cursor)) return prev;
      cursor.push(template);
      return clone;
    });
  }, []);

  const renderNode = (value: unknown, path: (string | number)[], nodeLabel: string): ReactNode => {
    if (isPrimitive(value)) {
      const id = path.join(".");
      if (typeof value === "boolean") {
        return (
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateAtPath(path, e.target.checked)}
            />
            {nodeLabel}
          </label>
        );
      }
      const isLongText = typeof value === "string" && value.length > 120;
      return (
        <div className="space-y-1">
          <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-stone-600">
            {nodeLabel}
          </label>
          {isLongText ? (
            <textarea
              id={id}
              className="min-h-[110px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
              value={value ?? ""}
              onChange={(e) => updateAtPath(path, e.target.value)}
            />
          ) : (
            <input
              id={id}
              type={typeof value === "number" ? "number" : "text"}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
              value={value === null ? "" : String(value)}
              onChange={(e) =>
                updateAtPath(path, typeof value === "number" ? Number(e.target.value || "0") : e.target.value)
              }
            />
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      const template = value[0]
        ? structuredClone(value[0])
        : "";
      return (
        <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
          <p className="text-sm font-semibold text-stone-800">{nodeLabel}</p>
          {value.map((item, index) => (
            <div key={index} className="space-y-2 rounded-md border border-stone-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Item {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeFromArray(path, index)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
              {renderNode(item, [...path, index], `${nodeLabel} Item`)}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addToArray(path, template)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
          >
            Add Item
          </button>
        </div>
      );
    }

    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <div className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
          {path.length ? (
            <p className="text-sm font-semibold text-lux-navy">{nodeLabel}</p>
          ) : null}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {entries.map(([key, child]) => (
              <div key={key} className={Array.isArray(child) || (child && typeof child === "object") ? "md:col-span-2" : ""}>
                {renderNode(child, [...path, key], humanize(key))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      {formData === null ? <p className="text-sm text-stone-500">Loading…</p> : renderNode(formData, [], label)}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-md bg-theme-bg px-4 py-2 text-sm font-semibold text-theme-on-bg"
        >
          Save
        </button>
        <span className="text-sm text-stone-600">{status}</span>
      </div>
    </div>
  );
}
