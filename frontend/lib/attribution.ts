/**
 * Lightweight attribution capture for lead-gen.
 *
 * Goals:
 * - Persist first-touch + last-touch UTM/click IDs.
 * - Keep it privacy-safe (no PII), small, and resilient.
 * - Make it easy to attach to lead payloads + analytics events.
 */
export type AttributionTouch = {
  ts: number; // epoch ms
  path: string; // pathname only
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  msclkid?: string;
  fbclid?: string;
  partner?: string;
};

export type StoredAttribution = {
  v: 1;
  sessionId: string;
  first: AttributionTouch;
  last: AttributionTouch;
};

const STORAGE_KEY = "gg_attribution_v1";
const SESSION_COOKIE = "gg_session_id";

function safeString(input: unknown): string | undefined {
  const v = String(input || "").trim();
  return v ? v : undefined;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  if (!match) return undefined;
  try {
    return decodeURIComponent(match.split("=").slice(1).join("="));
  } catch {
    return undefined;
  }
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function randomId(): string {
  // Short, non-PII session identifier.
  // crypto.randomUUID exists in modern browsers; fallback for older.
  try {
    const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
    if (c?.randomUUID) return c.randomUUID();
  } catch {
    // ignore
  }
  return `sess_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function parseTouchFromUrl(url: URL): Omit<AttributionTouch, "ts" | "path"> {
  const sp = url.searchParams;
  return {
    referrer: safeString(document?.referrer),
    utm_source: safeString(sp.get("utm_source")),
    utm_medium: safeString(sp.get("utm_medium")),
    utm_campaign: safeString(sp.get("utm_campaign")),
    utm_term: safeString(sp.get("utm_term")),
    utm_content: safeString(sp.get("utm_content")),
    gclid: safeString(sp.get("gclid")),
    msclkid: safeString(sp.get("msclkid")),
    fbclid: safeString(sp.get("fbclid")),
    partner: safeString(sp.get("partner")) || safeString(sp.get("affiliate")) || safeString(sp.get("ref")),
  };
}

function hasAnyAttributionFields(touch: Partial<AttributionTouch>): boolean {
  return Boolean(
    touch.utm_source ||
      touch.utm_medium ||
      touch.utm_campaign ||
      touch.utm_term ||
      touch.utm_content ||
      touch.gclid ||
      touch.msclkid ||
      touch.fbclid ||
      touch.partner
  );
}

export function loadAttribution(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== 1 || !parsed.first || !parsed.last || !parsed.sessionId) return null;
    return parsed as StoredAttribution;
  } catch {
    return null;
  }
}

export function captureAttribution(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(window.location.href);
    const now = Date.now();
    const path = url.pathname;

    // Ensure we have a stable sessionId (cookie is readable by both app + API routes).
    const existingSessionId = safeString(getCookie(SESSION_COOKIE));
    const sessionId = existingSessionId || randomId();
    if (!existingSessionId) setCookie(SESSION_COOKIE, sessionId, 30);

    const existing = loadAttribution();
    const fromUrl = parseTouchFromUrl(url);

    const baseTouch: AttributionTouch = {
      ts: now,
      path,
      ...fromUrl,
    };

    if (!existing) {
      const stored: StoredAttribution = {
        v: 1,
        sessionId,
        first: baseTouch,
        last: baseTouch,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      return stored;
    }

    // Update last-touch only when URL contains an attribution signal.
    // (Avoid overwriting last-touch on internal navigation.)
    const nextLast: AttributionTouch = hasAnyAttributionFields(baseTouch)
      ? baseTouch
      : {
          ...existing.last,
          // Still keep the latest path + timestamp for context
          ts: now,
          path,
        };

    const next: StoredAttribution = {
      v: 1,
      sessionId,
      first: existing.first,
      last: nextLast,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

/**
 * Data you can safely attach to a lead payload.
 */
export function getLeadAttribution(): StoredAttribution | null {
  // Ensure we capture once per session in case caller runs before provider effect.
  return loadAttribution() || captureAttribution();
}

