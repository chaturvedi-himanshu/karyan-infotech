"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  type Analytics,
} from "firebase/analytics";

/**
 * Named Firebase app instance reserved for Analytics. We use a distinct name
 * because `lib/firebase.ts` already owns the default app slot (Storage uploads
 * point at a different Firebase project).
 */
const ANALYTICS_APP_NAME = "analytics";

function readConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !appId || !projectId) return null;
  return {
    apiKey,
    appId,
    projectId,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

function getOrCreateAnalyticsApp(): FirebaseApp | null {
  const config = readConfig();
  if (!config) return null;
  const existing = getApps().find((a) => a.name === ANALYTICS_APP_NAME);
  return existing ?? initializeApp(config, ANALYTICS_APP_NAME);
}

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Resolve a Firebase Analytics instance for the configured web app.
 *
 * Returns `null` (without throwing) when:
 *   - executed during SSR / build,
 *   - the browser doesn't support Analytics (e.g. SSR, some webviews),
 *   - the public Firebase config env vars are missing.
 */
export function getAnalyticsClient(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (analyticsPromise) return analyticsPromise;
  analyticsPromise = (async () => {
    try {
      if (!(await isSupported())) return null;
      const app = getOrCreateAnalyticsApp();
      if (!app) return null;
      return getAnalytics(app);
    } catch {
      return null;
    }
  })();
  return analyticsPromise;
}
