"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [configErr, setConfigErr] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("err=config")) {
      setConfigErr(true);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(typeof j.error === "string" ? j.error : "Login failed");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-200 px-4">
      <div className="w-full max-w-md rounded-xl border border-stone-300 bg-white p-8 shadow-lg">
        <h1 className="font-display text-xl font-semibold text-lux-navy">Admin sign in</h1>
        {configErr ? (
          <p className="mt-2 text-sm text-red-600">
            Set AUTH_SECRET (16+ characters) in <code className="text-xs">.env</code> to use the admin
            area.
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-stone-600">
              Email
            </label>
            <input
              type="email"
              autoComplete="username"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-stone-600">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-md bg-theme-bg py-2.5 text-sm font-semibold text-theme-on-bg"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
