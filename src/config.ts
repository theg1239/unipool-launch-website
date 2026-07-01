// Runtime configuration, driven by Vite env vars (VITE_*) with safe
// production defaults so the site works even without a .env file.
//
// None of these are secrets — they're public hosts the browser talks
// to directly — so committing the defaults is fine and keeps the build
// reproducible.

// Public API host. Same backend the mobile app talks to. Despite the
// "unidev" name this is the Cloudflare-proxied production VM
// (165.22.218.217), matching config/urlconfig.ts in the app.
export const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "https://unidev.acmvit.in";

// Canonical host for the main app + where ride share links resolve.
// Ride cards on the satellite domains link to `${SHARE_HOST}/r/:id`,
// which serves the boarding-pass SharePage.
export const SHARE_HOST =
  import.meta.env.VITE_SHARE_HOST?.replace(/\/$/, "") || "https://unipool.in";

// Store + download links.
export const APP_STORE_URL =
  import.meta.env.VITE_APP_STORE_URL || "https://apps.apple.com/app/id6756426249";
export const PLAY_STORE_URL =
  import.meta.env.VITE_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=com.carpoolitapp&hl=en_IN";

// The functional web app — where people find and post rides in the
// browser (the expo react-native-web build). Mounted under /app on this
// same Pages project, so it shares the origin with the marketing site
// (one Google OAuth origin per domain, no subdomain sprawl). Relative so
// it resolves on whatever domain the page is served from; overridable
// via env if it ever moves.
export const WEBAPP_URL = import.meta.env.VITE_WEBAPP_URL || "/app";

// Canonical download landing (platform-aware redirect lives there).
export const DOWNLOAD_URL = `${SHARE_HOST}/download`;

// Ride share link for a given ride id.
export function rideLink(id: string): string {
  return `${SHARE_HOST}/r/${id}`;
}

export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS 13+ reports a Mac UA; treat touch-Macs as iOS so they get
  // the App Store, not the desktop web app.
  if (/Mac/.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1) {
    return "ios";
  }
  return "desktop";
}

// Store URL for the visitor's platform (Play Store for desktop as a
// neutral default, since desktop CTAs usually route to the web app).
export function storeUrlForPlatform(): string {
  return detectPlatform() === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
}
