"use client";

import { useId } from "react";

type MathCaptchaFieldProps = {
  prompt: string | null;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  loading?: boolean;
  id?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
};

export default function MathCaptchaField({
  prompt,
  value,
  onChange,
  error,
  loading = false,
  id,
  labelClassName = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500",
  inputClassName = "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition placeholder:text-stone-400 focus:border-lux-gold/50 focus:ring-2 focus:ring-lux-gold/25",
  errorClassName = "mt-1 text-xs text-red-500",
}: MathCaptchaFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId} className={labelClassName}>
        Security check *{loading ? "" : prompt ? ` — What is ${prompt}?` : ""}
      </label>
      <input
        id={inputId}
        name="math-captcha"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        disabled={loading || !prompt}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder={loading ? "Loading…" : "Your answer"}
        className={`${inputClassName}${
          error
            ? " border-red-500 focus:border-red-500 focus:ring-red-200/80"
            : ""
        }`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} className={errorClassName} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
