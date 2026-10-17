import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="mt-32 border-t border-white/10">
    <div className="frame grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <Logo />
        <p className="mt-5 max-w-xs text-sm text-mute">
          A quiet, cinematic place to find what to watch next.
        </p>
      </div>
      <nav aria-label="Footer" className="flex flex-col gap-3 text-sm text-mute">
        <span className="label mb-1">Explore</span>
        <Link className="hover:text-ivory" to="/discover?type=movie">Films</Link>
        <Link className="hover:text-ivory" to="/discover?type=tv">Series</Link>
        <Link className="hover:text-ivory" to="/search">Search</Link>
        <Link className="hover:text-ivory" to="/watchlist">Watchlist</Link>
      </nav>
      <p className="self-end text-xs leading-relaxed text-mute/80 md:text-right">
        Film and series data and artwork provided by TMDB.
        <br />
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  </footer>
);

export default Footer;
