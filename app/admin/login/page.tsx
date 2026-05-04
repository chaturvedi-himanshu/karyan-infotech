"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [configErr, setConfigErr] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("err=config")) {
      setConfigErr(true);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(typeof j.error === "string" ? j.error : "Login failed. Check your credentials.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7B90F]">
            <span className="text-xl font-black text-[#0f172a]">K</span>
          </div>
          <h1 className="text-xl font-bold text-white">Karyan Content Studio</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your website</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
          {configErr ? (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3">
              <p className="text-sm text-red-400">
                Set <code className="rounded bg-red-500/20 px-1 text-xs">AUTH_SECRET</code>{" "}
                (16+ characters) in your <code className="text-xs">.env</code> file to enable
                admin access.
              </p>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email address
              </label>
              <input
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#F7B90F]/60 focus:ring-2 focus:ring-[#F7B90F]/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#F7B90F]/60 focus:ring-2 focus:ring-[#F7B90F]/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3.5 py-2.5">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-[#F7B90F] py-2.5 text-sm font-bold text-[#0f172a] transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          Karyan Infratech — Content Studio
        </p>
      </div>
    </div>
  );
}
