import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, LogOut, Menu, Search, User, X } from "lucide-react";
import Logo from "./Logo";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";
import { useWatchlistStore } from "../store/watchlist";

const initialOf = (user) => (user?.username || user?.email || "?").charAt(0).toUpperCase();

/**
 * Quiet editorial navigation. Transparent over artwork, hairline-ruled and
 * softly blurred once the page scrolls. On phones it becomes a full-screen index.
 */
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { contentType, setContentType } = useContentStore();
  const savedCount = useWatchlistStore((s) => s.items.length);
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setSheetOpen(false);
  }, [location.pathname, location.search]);

  // Dropdown: click-outside + Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Mobile sheet: lock scroll + Escape.
  useEffect(() => {
    if (!sheetOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  // "/" jumps to search, like a command palette.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      e.preventDefault();
      navigate("/search");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  const onDiscover = location.pathname === "/discover";
  const links = [
    { label: "Home", to: "/", active: location.pathname === "/" },
    {
      label: "Films",
      to: "/discover?type=movie",
      active: onDiscover && contentType === "movie",
      onClick: () => setContentType("movie"),
    },
    {
      label: "Series",
      to: "/discover?type=tv",
      active: onDiscover && contentType === "tv",
      onClick: () => setContentType("tv"),
    },
    { label: "Watchlist", to: "/watchlist", active: location.pathname === "/watchlist", count: savedCount },
  ];

  const solid = scrolled || sheetOpen;

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[70] -translate-y-20 bg-ivory px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-cine ${
          solid
            ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent"
        }`}
      >
        <div className="frame flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={l.onClick}
                aria-current={l.active ? "page" : undefined}
                className={`link-rule py-2 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  l.active ? "text-ivory" : "text-mute hover:text-ivory"
                }`}
              >
                {l.label}
                {l.count > 0 && (
                  <sup className="ml-1 text-[10px] tracking-normal text-champagne">{l.count}</sup>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/search"
              aria-label="Search (press /)"
              className="grid size-11 place-items-center text-ivory/80 transition-colors hover:text-champagne"
            >
              <Search className="size-[18px]" />
            </Link>

            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
                className="grid size-10 place-items-center rounded-full border border-white/25 font-display text-lg text-ivory transition-colors hover:border-champagne hover:text-champagne"
              >
                {initialOf(user)}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="fade-in absolute right-0 top-[calc(100%+12px)] w-56 border border-white/10 bg-night/95 py-2 shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-white/10 px-5 pb-3 pt-2">
                    <p className="label">Signed in</p>
                    <p className="mt-1 truncate font-display text-xl">{user?.username}</p>
                  </div>
                  <NavLink role="menuitem" to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm text-ivory/80 transition-colors hover:bg-white/5 hover:text-champagne">
                    <User className="size-4" /> Profile
                  </NavLink>
                  <NavLink role="menuitem" to="/watchlist" className="flex items-center gap-3 px-5 py-3 text-sm text-ivory/80 transition-colors hover:bg-white/5 hover:text-champagne">
                    <Bookmark className="size-4" /> Watchlist
                  </NavLink>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-ivory/80 transition-colors hover:bg-white/5 hover:text-champagne"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSheetOpen((o) => !o)}
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              aria-expanded={sheetOpen}
              aria-controls="mobile-index"
              className="grid size-11 place-items-center text-ivory md:hidden"
            >
              {sheetOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile index */}
      <div
        id="mobile-index"
        hidden={!sheetOpen}
        className="fade-in fixed inset-0 z-40 overflow-y-auto bg-ink px-5 pb-10 pt-[calc(var(--nav-h)+24px)] md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {[...links, { label: "Search", to: "/search" }, { label: "Profile", to: "/profile" }].map((l, i) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={l.onClick}
              style={{ "--d": `${i * 50}ms` }}
              className="rise flex items-baseline justify-between border-b border-white/10 py-5"
            >
              <span className={`font-display text-[44px] leading-none ${l.active ? "text-champagne" : "text-ivory"}`}>
                {l.label}
              </span>
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-10 flex items-center justify-between">
          <div>
            <p className="label">Signed in as</p>
            <p className="font-display text-2xl">{user?.username}</p>
          </div>
          <button type="button" onClick={logout} className="btn-ghost">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
