import { Link } from "react-router-dom";

export const LogoMark = ({ className = "size-6" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" fill="none" stroke="rgb(var(--champagne))" strokeWidth="1.5" />
    <path d="M13 10.5v11l9-5.5z" fill="rgb(var(--ivory))" />
  </svg>
);

const Logo = ({ to = "/", className = "" }) => (
  <Link
    to={to}
    aria-label="BingeBox — home"
    className={`group inline-flex items-center gap-3 ${className}`}
  >
    <LogoMark className="size-6 transition-transform duration-500 ease-cine group-hover:rotate-90" />
    <span className="font-display text-[26px] leading-none tracking-tight text-ivory">
      Binge<span className="italic text-champagne">Box</span>
    </span>
  </Link>
);

export default Logo;
