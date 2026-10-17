import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Film, Search, Clapperboard, Bookmark, Github, Twitter, Instagram } from "lucide-react";
import Logo from "../../components/Logo";
import Artwork from "../../components/Artwork";
import useSmoothScroll from "../../hooks/useSmoothScroll";
import api from "../../utils/api";
import { titleOf } from "../../utils/media";

const FEATURES = [
  { icon: Clapperboard, title: "Trailers", text: "Watch official trailers and teasers without leaving the page." },
  { icon: Film, title: "Discover", text: "Filter the catalogue by genre, rating and release year." },
  { icon: Search, title: "Search", text: "Find any film or series in a keystroke — press / from anywhere." },
  { icon: Bookmark, title: "Watchlist", text: "Keep a private shortlist of everything you mean to see." },
];

/** Split an array into N roughly-equal columns (round-robin). */
const splitCols = (arr, n) => {
  const cols = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => cols[i % n].push(item));
  return cols;
};

/* Each column scrolls at a different speed for organic motion */
const COL_SPEEDS = [38, 28, 34, 24];
const COL_DIRECTIONS = ["up", "down", "up", "down"];

/* ─── Feature Card Component ─── */
const FeatureCard = ({ icon: Icon, title, text, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    // Spotlight effect
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="feature-card group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 sm:p-8 backdrop-blur-sm"
      style={{
        "--d": `${200 + index * 120}ms`,
        transition: "transform 0.4s cubic-bezier(0.22, 0.8, 0.24, 1), box-shadow 0.4s ease",
        willChange: "transform",
      }}
    >
      {/* Spotlight glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--champagne) / 0.08), transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Top shine line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, transparent, rgb(var(--champagne) / 0.4), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
          <Icon className="size-5 text-champagne" />
        </div>
        <dt className="font-display text-2xl text-ivory">{title}</dt>
        <dd className="mt-3 text-[15px] leading-relaxed text-mute">{text}</dd>
      </div>
      <span className="absolute right-6 top-6 font-display text-sm italic text-champagne/40">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
};

/** Public landing page — real artwork from the catalogue, never stock imagery. */
const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [posters, setPosters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { scrollRef } = useSmoothScroll();

  useEffect(() => {
    let alive = true;
    api
      .get("/movie/popular")
      .then((res) => {
        const list = (res.data?.movies || []).filter((m) => m.poster_path).slice(0, 16);
        if (alive) {
          setPosters(list);
          requestAnimationFrame(() => setTimeout(() => setLoaded(true), 80));
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/signup?email=" + encodeURIComponent(email));
  };

  const columns = splitCols(posters, 4);

  return (
    <div ref={scrollRef} data-scroll-container className="relative min-h-screen overflow-hidden bg-ink">
      {/* Collage & card animations */}
      <style>{`
        @keyframes collage-up {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes collage-down {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
        @keyframes collage-fade-in {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.55; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .collage-wrapper {
          opacity: 0;
          transition: opacity 0.1s;
        }
        .collage-wrapper.is-loaded {
          animation: collage-fade-in 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .collage-glow {
          animation: glow-pulse 6s ease-in-out infinite;
        }
        .collage-poster {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
        }
        .collage-poster:hover {
          transform: scale(1.05);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.9), 0 0 30px rgba(var(--champagne), 0.08);
        }
        .feature-card {
          animation: card-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--d, 0ms);
        }
        .feature-card:hover {
          border-color: rgb(var(--champagne) / 0.25);
          box-shadow: 0 20px 60px -20px rgba(0,0,0,0.6), 0 0 40px rgba(var(--champagne), 0.05);
        }
      `}</style>

      <header className="frame relative z-20 flex h-[var(--nav-h)] items-center justify-between">
        <Logo />
        <Link to="/login" className="btn-ghost !min-h-[40px] !px-5">
          Sign in
        </Link>
      </header>

      <main id="main" className="page-enter">
        {/* ─── Hero Section ─── */}
        <section data-scroll-section className="relative overflow-hidden pb-24 pt-8 lg:min-h-[calc(100svh-var(--nav-h))] lg:pb-16 flex items-center">
          {/* Ambient glow behind collage */}
          <div
            className="collage-glow pointer-events-none absolute right-0 top-1/4 size-[800px] rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, rgb(var(--champagne) / 0.12), transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="w-full grid items-center gap-10 lg:grid-cols-[1.1fr_1.35fr] pl-5 sm:pl-8 lg:pl-16 xl:pl-24 pr-0">
            {/* Hero Copy */}
            <div className="relative z-20 max-w-xl py-6">
              <p className="rise eyebrow mb-6">Cinema, curated</p>
              <h1 className="rise display text-balance text-[clamp(3.4rem,8.5vw,7.5rem)] leading-[0.98]" style={{ "--d": "100ms" }}>
                Find the film you'll <em className="text-champagne">remember.</em>
              </h1>
              <p className="rise mt-8 max-w-md text-base leading-relaxed text-ivory/70" style={{ "--d": "220ms" }}>
                BingeBox is a quieter way to discover films and series — thoughtfully arranged,
                beautifully presented, and free of endless scrolling.
              </p>

              <form onSubmit={onSubmit} className="rise mt-10 flex max-w-lg flex-col gap-3 sm:flex-row" style={{ "--d": "320ms" }}>
                <label htmlFor="landing-email" className="sr-only">Email address</label>
                <input
                  id="landing-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="field flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  Get started <ArrowRight className="size-4" />
                </button>
              </form>
            </div>

            {/* Seamless Bleeding Collage Image */}
            <div className="relative w-full overflow-hidden select-none pr-5">
              {/* Left-edge smooth fade gradient: blends black background smoothly into the image */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-44 sm:w-64 lg:w-80 z-10"
                style={{
                  background: "linear-gradient(to right, rgb(var(--ink)) 0%, rgb(var(--ink) / 0.95) 20%, rgb(var(--ink) / 0.6) 55%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              {/* Top soft blend */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-ink via-ink/60 to-transparent"
                aria-hidden="true"
              />

              {/* Bottom soft blend */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 z-10 bg-gradient-to-t from-ink via-ink/60 to-transparent"
                aria-hidden="true"
              />

              {/* Right edge soft fade */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-ink/70 to-transparent"
                aria-hidden="true"
              />

              <img
                src="/hero-collage.jpg"
                alt="Cinema collage preview"
                className="w-full h-auto min-h-[460px] sm:min-h-[580px] lg:min-h-[680px] max-h-[85vh] object-cover object-left xl:object-center"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section data-scroll-section className="frame border-t border-white/10 py-20 sm:py-28" aria-label="Features">
          <div className="mb-16 max-w-2xl">
            <h2 className="display text-[clamp(2.2rem,4.5vw,3.8rem)]">
              Made for the <em className="text-champagne">watching</em>, not the scrolling.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mute">
              Every feature is built to get you closer to the next great film — fast, focused, and beautiful.
            </p>
          </div>
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </dl>
        </section>

        {/* ─── CTA Band ─── */}
        <section data-scroll-section className="frame py-20 sm:py-28">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] px-8 py-16 text-center sm:px-16 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgb(var(--champagne) / 0.08), transparent 65%)",
              }}
              aria-hidden="true"
            />
            <h2 className="display relative z-10 mx-auto max-w-xl text-[clamp(2rem,4vw,3.2rem)]">
              Start watching <em className="text-champagne">tonight.</em>
            </h2>
            <p className="relative z-10 mx-auto mt-4 max-w-md text-base text-mute">
              Create a free account and build your watchlist in seconds.
            </p>
            <Link to="/signup" className="btn-primary relative z-10 mt-8 inline-flex">
              Get started free <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer data-scroll-section className="border-t border-white/[0.06]">
          <div className="frame py-16 sm:py-20">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Logo />
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute/80">
                  Cinema, curated — discover films and series that are worth your time.
                </p>
                <div className="mt-6 flex gap-4">
                  <a href="#" aria-label="GitHub" className="text-mute/50 transition-colors hover:text-champagne">
                    <Github className="size-5" />
                  </a>
                  <a href="#" aria-label="Twitter" className="text-mute/50 transition-colors hover:text-champagne">
                    <Twitter className="size-5" />
                  </a>
                  <a href="#" aria-label="Instagram" className="text-mute/50 transition-colors hover:text-champagne">
                    <Instagram className="size-5" />
                  </a>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne/70">Navigate</h3>
                <ul className="space-y-3 text-sm text-mute/80">
                  <li><Link to="/" className="transition-colors hover:text-ivory">Home</Link></li>
                  <li><Link to="/login" className="transition-colors hover:text-ivory">Sign In</Link></li>
                  <li><Link to="/signup" className="transition-colors hover:text-ivory">Sign Up</Link></li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne/70">Features</h3>
                <ul className="space-y-3 text-sm text-mute/80">
                  <li className="transition-colors hover:text-ivory">Trailers &amp; Teasers</li>
                  <li className="transition-colors hover:text-ivory">Discover &amp; Filter</li>
                  <li className="transition-colors hover:text-ivory">Search</li>
                  <li className="transition-colors hover:text-ivory">Watchlist</li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne/70">Legal</h3>
                <ul className="space-y-3 text-sm text-mute/80">
                  <li className="transition-colors hover:text-ivory">Privacy Policy</li>
                  <li className="transition-colors hover:text-ivory">Terms of Service</li>
                  <li className="transition-colors hover:text-ivory">Cookie Policy</li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
              <p className="text-xs text-mute/50">
                &copy; {new Date().getFullYear()} BingeBox. All rights reserved.
              </p>
              <p className="text-xs text-mute/50">
                Film and series data provided by{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-champagne/60 transition-colors hover:text-champagne"
                >
                  TMDB
                </a>
                . Not endorsed or certified by TMDB.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AuthScreen;
