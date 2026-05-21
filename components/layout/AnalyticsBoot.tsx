"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { getAnalyticsClient } from "@/lib/firebase/analytics";

/**
 * Boots Firebase Analytics on the client and emits a `page_view` for every
 * App Router navigation. Safe to render unconditionally — it no-ops on
 * unsupported browsers or when public config env vars are missing.
 */
export default function AnalyticsBoot() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const search = searchParams?.toString() ?? "";
    const fullPath = search ? `${pathname}?${search}` : pathname;
    getAnalyticsClient().then((analytics) => {
      if (cancelled || !analytics) return;
      logEvent(analytics, "page_view", {
        page_path: fullPath,
        page_location: window.location.href,
        page_title: document.title,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}
