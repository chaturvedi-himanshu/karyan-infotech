"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "admin" }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(typeof j.error === "string" ? j.error : "Failed");
      return;
    }
    setMsg("Admin created.");
    setEmail("");
    setPassword("");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-3 rounded-lg border border-lux-gold/30 bg-white p-5 shadow-sm"
    >
      <h2 className="text-base font-semibold text-lux-navy">Create admin</h2>
      <p className="text-xs text-stone-600">
        New admins can sign in at <span className="font-mono text-stone-800">/admin/login</span>. Use a
        strong password (at least 8 characters).
      </p>
      <input
        type="email"
        required
        autoComplete="off"
        placeholder="Admin email"
        className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="Password"
        className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full rounded-md bg-theme-bg py-2.5 text-sm font-semibold text-theme-on-bg hover:bg-theme-bg-muted"
      >
        Create admin
      </button>
      {msg ? <p className="text-sm text-stone-700">{msg}</p> : null}
    </form>
  );
}
