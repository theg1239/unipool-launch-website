import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import type { DomainRole } from "@/utils/domain";
import { DOWNLOAD_URL } from "@/config";

// Shared chrome for the satellite domains (unipool.to, .today, .best,
// etc). Matches the main launch site's navbar + footer so every UniPool
// surface wears the same head and tail, while each domain owns its body.
export default function SatelliteLayout({ domain: _domain }: { domain: DomainRole }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-forest">
      <header className="border-b border-forest/10 bg-cream">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" aria-label="UniPool home">
            <span className="text-xl font-extrabold tracking-tight text-forest">
              UniPool
            </span>
          </Link>
          <a
            href={DOWNLOAD_URL}
            className="inline-flex items-center justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-lime transition hover:bg-forest-700"
          >
            Get the app
          </a>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-forest/10 bg-forest text-cream">
        <div className="container-x flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
          <span className="text-lg font-extrabold tracking-tight text-lime">UniPool</span>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/70">
            <a href="https://unipool.in/about" className="hover:text-lime">About</a>
            <a href="https://unipool.in/faq" className="hover:text-lime">FAQ</a>
            <a href="https://unipool.in/privacy" className="hover:text-lime">Privacy</a>
            <a href="https://unipool.in/terms" className="hover:text-lime">Terms</a>
            <a href="mailto:hello@unipool.acmvit.in" className="hover:text-lime">Contact</a>
          </nav>
          <p className="text-xs text-cream/55">
            Made with love by{" "}
            <a href="https://acmvit.in" target="_blank" rel="noreferrer" className="font-semibold text-lime hover:underline">
              ACM-VIT
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
