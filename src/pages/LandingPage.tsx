import { Link } from "react-router-dom";

// Landing page modelled on the original launch site: split-screen
// hero (text + CTA on the left, illustration on the right), forest
// download band below.
//
// Mobile hero: locked to the viewport (`100svh - nav`) so the whole
// hero fits in one screen. `svh` over `dvh` because `dvh` expands
// when the browser's address bar collapses and causes layout to
// reflow as the user scrolls — `svh` stays stable.
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Download />
    </>
  );
}

function Hero() {
  return (
    <section className="flex h-[calc(100svh-4rem)] min-h-[600px] flex-col md:h-[calc(100dvh-4rem)] md:min-h-[640px] md:flex-row">
      {/* Left half — text + CTA on cream. flex-1 on mobile so it
          shares the viewport with the lime illustration half. */}
      <div className="flex w-full flex-1 flex-col items-start justify-center px-6 py-6 md:w-1/2 md:flex-none md:px-14 md:py-20 lg:px-20">
        <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-forest sm:text-6xl lg:text-7xl">
          UniPool
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-forest/75 sm:mt-5 sm:text-lg">
          A carpooling app by university students, for university
          students.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
          <a
            href="#download"
            className="rounded-full bg-forest px-7 py-3 text-sm font-bold text-lime transition hover:bg-forest-700"
          >
            Download
          </a>
          <Link
            to="/about"
            className="rounded-full border border-forest/20 px-7 py-3 text-sm font-bold text-forest transition hover:border-forest/40"
          >
            Learn more
          </Link>
        </div>
        <p className="mt-6 text-sm font-semibold text-forest/55 sm:mt-10">
          Made with care by ACM-VIT.
        </p>
      </div>

      {/* Right half — illustration on soft lime. flex-1 on mobile so
          it gets the remaining viewport space; the image uses
          `max-h-full object-contain` so it scales down to whatever
          space is available instead of overflowing. */}
      <div className="flex w-full flex-1 items-center justify-center overflow-hidden bg-lime/25 px-8 py-6 md:w-1/2 md:flex-none md:px-14 md:py-16">
        <img
          src="/unipool-main-logo.svg"
          alt="UniPool"
          className="h-full max-h-full w-auto max-w-md object-contain"
        />
      </div>
    </section>
  );
}

function Download() {
  return (
    <section
      id="download"
      className="border-t border-forest/10 bg-forest px-8 py-20 text-cream md:px-14"
    >
      <div className="container-x text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
          Download the app
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-cream/70">
          Available on Google Play. Coming soon to iOS.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://play.google.com/store/apps/details?id=com.carpoolitapp&hl=en_IN"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-lime px-7 py-3 text-sm font-bold text-forest transition hover:bg-lime-500"
          >
            Google Play Store
          </a>
          <span className="rounded-full border border-cream/20 px-7 py-3 text-sm font-bold text-cream/60">
            iOS coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
