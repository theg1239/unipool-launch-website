import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Ride share landing.
//
// Behaviour:
//   - On a phone (iOS/Android), the page jumps to the
//     `unipool://ride/<id>` scheme immediately on mount. If the app
//     is installed, iOS/Android resolves the universal link and
//     opens it directly — the user never sees this fallback page.
//     If the app isn't installed, the deep-link no-ops silently
//     and the user is left on this page after ~1s, where the install
//     CTA is the primary action.
//   - On desktop, no auto-redirect (there's no app to open). The
//     page shows the manual "Open in UniPool" button and the install
//     link, useful when the link was shared to Slack / DM / email.
export default function SharePage() {
  const { rideId } = useParams<{ rideId: string }>();
  const [isMobile] = useState(detectMobile);
  // While we wait to see if the OS handed off the URL to the app,
  // render a slim "Opening UniPool..." placeholder instead of the
  // full fallback. After 1.2s with no handoff, reveal the full page.
  const [revealed, setRevealed] = useState(!isMobile);

  useEffect(() => {
    if (!rideId) return;
    if (isMobile) {
      // Fire the scheme jump as soon as the route is known. On iOS
      // Safari this opens the app if installed; if it isn't, the
      // browser stays here and the fallback page reveals.
      window.location.assign(`unipool://ride/${rideId}`);
      const t = setTimeout(() => setRevealed(true), 1200);
      return () => clearTimeout(t);
    }
  }, [rideId, isMobile]);

  if (!revealed) {
    return <Opening />;
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-md text-center text-forest">
          <RouteHint />

          <h1 className="mt-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isMobile ? "Don't have UniPool yet?" : "Open this ride in UniPool"}
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-base text-forest/65">
            {isMobile
              ? "Install the app to open this ride. Already installed? Tap below to try again."
              : "Tap below to open the ride in the app. Don't have it yet? Install UniPool and try again."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.carpoolitapp&hl=en_IN"
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-xs rounded-full bg-forest px-7 py-3 text-center text-sm font-bold text-lime transition hover:bg-forest-700"
            >
              Get it on Google Play
            </a>
            <a
              href={`unipool://ride/${rideId ?? ""}`}
              className="w-full max-w-xs text-center text-sm font-semibold text-forest/65 hover:text-forest"
            >
              Open in UniPool
            </a>
          </div>

          <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-forest/5 px-3 py-1 text-xs font-semibold text-forest/55">
            Ride
            <span className="font-mono">{shortId(rideId)}</span>
          </p>

          <div className="mt-10">
            <Link
              to="/"
              className="text-sm font-semibold text-forest/55 hover:text-forest"
            >
              Back to UniPool
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Slim "Opening..." placeholder shown while the OS decides whether
// to hand the URL off to the installed app. Avoids a jarring flash
// of the full fallback page before the app pops up.
function Opening() {
  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center py-16">
      <div className="container-x">
        <div className="mx-auto flex max-w-xs flex-col items-center gap-4 text-center text-forest">
          <Spinner />
          <p className="text-base font-semibold text-forest">
            Opening UniPool…
          </p>
          <p className="text-xs text-forest/55">
            If nothing happens, the app may not be installed.
          </p>
        </div>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-forest/15 border-t-forest"
    />
  );
}

// Simple forest card with the app's two-dot route motif.
function RouteHint() {
  return (
    <div className="mx-auto inline-block rounded-2xl bg-forest px-6 py-4 text-left text-cream shadow-[0_18px_40px_-24px_rgba(38,59,51,0.45)]">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-cream">
          <span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-lime" />
          Pickup point
        </div>
        <div className="ml-[2px] h-2 w-[1.5px] bg-lime/40" />
        <div className="flex items-center gap-2 text-[12px] font-semibold text-cream">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          Drop-off
        </div>
      </div>
    </div>
  );
}

// SSR-safe mobile detection. Reads the user-agent string + (where
// available) the user-agent client hints platform. Treats iPad as
// mobile too — Safari on iPadOS ships a desktop UA by default, so
// fall back to a touch-points check for that case.
function detectMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod|Android|Mobile/i.test(ua)) return true;
  // iPadOS desktop UA workaround.
  const isTouchMac =
    /Mac/.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
  return isTouchMac;
}

function shortId(id?: string) {
  if (!id) return "unknown";
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}…${id.slice(-6)}`;
}
