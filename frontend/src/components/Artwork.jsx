import { useEffect, useState } from "react";
import { IMG_BASE } from "../utils/constants";

const WIDTHS = {
  poster: [185, 342, 500, 780],
  backdrop: [300, 780, 1280],
};
const RATIO = {
  poster: "aspect-[2/3]",
  backdrop: "aspect-video",
  none: "",
};

const TONES = [
  ["#1b2230", "#0d1118"],
  ["#2a2118", "#100d09"],
  ["#1d2a2a", "#0b1111"],
  ["#2a1d24", "#110b0f"],
  ["#222233", "#0c0c14"],
];

const hash = (text) => {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * Responsive TMDB artwork with lazy loading, a loading placeholder and a
 * typographic fallback — never a broken-image icon.
 */
const Artwork = ({
  path,
  title = "",
  kind = "poster",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  ratio,
  priority = false,
  position = "center",
  className = "",
  imgClassName = "",
  children,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [path]);

  const widths = WIDTHS[kind] || WIDTHS.poster;
  const showImage = path && !failed;
  const aspect = RATIO[ratio ?? kind] ?? "";
  const [from, to] = TONES[hash(title || "x") % TONES.length];

  return (
    <div
      className={`relative overflow-hidden bg-panel ${aspect} ${className}`}
      style={{ contain: "paint" }}
    >
      {showImage ? (
        <>
          {!loaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}
          <img
            src={`${IMG_BASE}/w${widths[Math.min(1, widths.length - 1)]}${path}`}
            srcSet={widths.map((w) => `${IMG_BASE}/w${w}${path} ${w}w`).join(", ")}
            sizes={sizes}
            alt={title ? `${title} — ${kind === "poster" ? "poster" : "still"}` : ""}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable="false"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={{ objectPosition: position }}
            className={`poster-img absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-cine ${
              loaded ? "opacity-100" : "opacity-0"
            } ${imgClassName}`}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 flex flex-col justify-between p-4"
          style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
        >
          <span className="h-px w-8 bg-champagne/60" aria-hidden="true" />
          <span className="font-display text-xl leading-tight text-ivory/80 sm:text-2xl">
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
};

export default Artwork;
