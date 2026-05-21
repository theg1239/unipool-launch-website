import { Link } from "react-router-dom";

// Footer. Single forest band with the wordmark + a small set of
// links. Same simplicity as the original launch site's footer area
// (a single "Made with love by ACM-VIT" sign-off below the hero).
export default function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-forest text-cream">
      <div className="container-x flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <span className="text-lg font-extrabold tracking-tight text-lime">
          UniPool
        </span>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/70">
          <Link to="/about" className="hover:text-lime">About</Link>
          <Link to="/faq" className="hover:text-lime">FAQ</Link>
          <Link to="/privacy" className="hover:text-lime">Privacy</Link>
          <Link to="/terms" className="hover:text-lime">Terms</Link>
          <a
            href="mailto:hello@unipool.acmvit.in"
            className="hover:text-lime"
          >
            Contact
          </a>
        </nav>

        <p className="text-xs text-cream/55">
          Made with love by{" "}
          <a
            href="https://acmvit.in"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-lime hover:underline"
          >
            ACM-VIT
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
