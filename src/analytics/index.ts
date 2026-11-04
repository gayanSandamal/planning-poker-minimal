/**
 * Google Analytics (via Firebase Analytics), loaded only after consent.
 *
 * - Nothing is loaded and no cookies are set until the visitor accepts.
 * - Game IDs are stripped from page paths: a game ID is its access link.
 * - In development, events are logged to the console instead of sent.
 */
import { ref } from "vue";
import type { Analytics } from "firebase/analytics";

export type ConsentState = "granted" | "denied" | "unset";

const CONSENT_KEY = "ppm.analyticsConsent";
const IS_PROD = process.env.NODE_ENV === "production";

function readConsent(): ConsentState {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

/** Reactive so the banner and privacy page update together. */
export const consent = ref<ConsentState>(readConsent());

let analytics: Analytics | null = null;
let loading: Promise<Analytics | null> | null = null;

async function loadAnalytics(): Promise<Analytics | null> {
  if (analytics) return analytics;
  if (loading) return loading;
  loading = (async () => {
    if (!IS_PROD) return null;
    const [{ firebaseApp }, mod] = await Promise.all([
      import("@/firebase/fb.appdata"),
      import("firebase/analytics"),
    ]);
    if (!(await mod.isSupported())) return null;
    analytics = mod.initializeAnalytics(firebaseApp, {
      // Page views are sent manually so game IDs can be removed first.
      config: { send_page_view: false },
    });
    mod.setAnalyticsCollectionEnabled(analytics, true);
    return analytics;
  })().catch(() => null);
  return loading;
}

/** Route path with game IDs replaced, e.g. "/AbC123" → "/game". */
export function sanitizePath(path: string, routeName?: string | null): string {
  return routeName === "game" ? "/game" : path;
}

export async function trackPageView(
  path: string,
  title: string,
  routeName?: string | null
): Promise<void> {
  const page_path = sanitizePath(path, routeName);
  const search = routeName === "game" ? "" : window.location.search;
  await track("page_view", {
    page_path,
    page_title: title,
    page_location: window.location.origin + page_path + search,
  });
}

export async function track(
  event: string,
  params: Record<string, string | number | boolean> = {}
): Promise<void> {
  if (consent.value !== "granted") return;
  if (!IS_PROD) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
    return;
  }
  const a = await loadAnalytics();
  if (!a) return;
  const { logEvent } = await import("firebase/analytics");
  logEvent(a, event, params);
}

export async function setConsent(value: "granted" | "denied"): Promise<void> {
  consent.value = value;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  if (value === "granted") {
    await loadAnalytics();
    return;
  }
  // Turning it off after it was on: stop collection and clear GA cookies.
  if (analytics) {
    const { setAnalyticsCollectionEnabled } = await import(
      "firebase/analytics"
    );
    setAnalyticsCollectionEnabled(analytics, false);
  }
  clearGaCookies();
}

function clearGaCookies(): void {
  const host = window.location.hostname;
  const domains = ["", host, "." + host];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_")) {
      for (const d of domains) {
        document.cookie =
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
          (d ? `; domain=${d}` : "");
      }
    }
  }
}

/** Start analytics on load for visitors who already accepted. */
export function initAnalytics(): void {
  if (consent.value === "granted") void loadAnalytics();
}
