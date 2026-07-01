import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// Canonical store URLs. Centralised here (and not pulled from a
// shared module) because the Share page, Landing page, and Download
// page each independently want a different mix of these — keeping
// the literal here means a store-link change is a one-file grep.
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.carpoolitapp&hl=en_IN";
const APP_STORE_URL = "https://apps.apple.com/app/id6756426249";

/**
 * /download — the platform-aware landing page that every in-app
 * share message ("New to UniPool? Download it: …/download") points
 * to. Three behaviours:
 *
 *   Android: auto-redirects to the Play Store as soon as the page
 *            mounts. The visible page content is the fallback for
 *            the brief flash before the redirect lands, plus the
 *            graceful path for users on Android browsers that
 *            block window.location reassignment.
 *
 *   iOS:     auto-redirects to the App Store, symmetric to Android.
 *            UniPool shipped to the App Store (v2.0.10), so the old
 *            "coming soon" card is gone.
 *
 *   Desktop: shows both store buttons side-by-side. The visitor
 *            is probably someone who got a share link in WhatsApp
 *            Web / email and needs to open it on their phone —
 *            the explicit buttons let them pick the right store
 *            for the device they'll actually install on.
 */
export default function DownloadPage() {
  // SSR-safe platform sniff. The router renders this on the client,
  // but useMemo + the `typeof window` guard keeps the hook idiom
  // identical across any future SSR experiment.
  const platform = useMemo<"android" | "ios" | "desktop">(() => {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua)) return "android";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    return "desktop";
  }, []);

  useEffect(() => {
    // Replace, not assign — the user shouldn't be able to back-
    // arrow out of the store back onto this redirect page and
    // bounce again.
    if (platform === "android") {
      window.location.replace(PLAY_STORE_URL);
    } else if (platform === "ios") {
      window.location.replace(APP_STORE_URL);
    }
  }, [platform]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-forest px-6 py-20 text-cream sm:py-28">
      <div className="w-full max-w-md text-center">
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
          Download the app
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-base text-cream/65">
          {platform === "android"
            ? "Opening Google Play. If nothing happens in a few seconds, tap below."
            : platform === "ios"
            ? "Opening the App Store. If nothing happens in a few seconds, tap below."
            : "Available on the App Store and Google Play."}
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-lime px-7 py-3 text-sm font-bold text-forest transition hover:bg-lime-500"
          >
            Download on the App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-cream/20 px-7 py-3 text-sm font-bold text-cream transition hover:bg-cream/10"
          >
            Get it on Google Play
          </a>
        </div>

        <p className="mt-12 text-xs text-cream/40">
          Got a ride link from a friend?{" "}
          <Link to="/" className="text-cream/70 underline-offset-2 hover:underline">
            Learn what UniPool is first
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
