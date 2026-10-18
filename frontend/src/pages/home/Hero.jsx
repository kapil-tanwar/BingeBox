import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star } from "lucide-react";
import Artwork from "../../components/Artwork";
import WatchlistButton from "../../components/WatchlistButton";
import api from "../../utils/api";
import {
  formatRuntime,
  genreNames,
  rating,
  titleOf,
  trimText,
  typeOf,
  yearOf,
} from "../../utils/media";

/**
 * The opening frame: an asymmetric composition — oversized serif title on the
 * left, a cinematic crop bleeding off the right edge, numbered selectors below.
 */
const Hero = ({ items, type }) => {
  const [index, setIndex] = useState(0);
  const [details, setDetails] = useState({});

  const item = items[Math.min(index, items.length - 1)];
  const key = `${type}:${item?.id}`;

  // Reset the selection if the list changes underneath us (e.g. films ⇄ series).
  useEffect(() => setIndex(0), [type]);

  useEffect(() => {
    if (!item || details[key]) return undefined;
    let alive = true;
    api
      .get(`/${type}/${item.id}/details`)
      .then((res) => {
        if (alive && res.data?.details) {
          setDetails((d) => ({ ...d, [key]: res.data.details }));
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [item, key, type, details]);

  if (!item) return null;

  const extra = details[key];
  const title = titleOf(item);
  const mediaType = typeOf(item, type);
  const genres = genreNames(extra || item, mediaType).slice(0, 3);
  const runtime = extra?.runtime
    ? formatRuntime(extra.runtime)
    : extra?.number_of_seasons
    ? `${extra.number_of_seasons} season${extra.number_of_seasons > 1 ? "s" : ""}`
    : "";
  const score = rating(item);
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const big = title.length > 22 || longest > 9;

  return (
    <section
      aria-label="Featured"
      className="relative isolate min-h-[640px] overflow-hidden lg:h-[min(100svh,920px)]"
    >
      {/* Artwork — crossfades whenever the featured title changes */}
      <div key={`art-${key}`} className="fade-in absolute inset-y-0 right-0 w-full lg:w-[76%]">
        <div className="hero-drift grain absolute inset-0">
          <Artwork
            path={item.backdrop_path}
            title={title}
            kind="backdrop"
            ratio="none"
            priority
            sizes="100vw"
            position="62% 28%"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="vignette absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent max-lg:hidden" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10 lg:via-transparent lg:to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />
      </div>

      <div className="frame relative z-10 flex h-full min-h-[640px] flex-col justify-end pb-24 pt-[calc(var(--nav-h)+120px)] lg:justify-center lg:pb-32 lg:pt-[calc(var(--nav-h)+40px)]">
        <div key={`copy-${key}`} className="max-w-[min(100%,760px)]">
          <p className="rise eyebrow mb-6 flex items-center gap-3" style={{ "--d": "80ms" }}>
            <span>Now showing</span>
            <span className="h-px w-10 bg-champagne/60" aria-hidden="true" />
            <span className="text-mute">{mediaType === "tv" ? "Series" : "Film"}</span>
          </p>

          <h1
            className={`rise display text-balance [overflow-wrap:break-word] ${
              big
                ? "text-[clamp(2.6rem,6.2vw,5.8rem)]"
                : "text-[clamp(3.2rem,9vw,8.4rem)]"
            }`}
            style={{ "--d": "160ms" }}
          >
            {title}
          </h1>

          {extra?.tagline && (
            <p className="rise mt-5 font-display text-2xl italic text-champagne/90" style={{ "--d": "240ms" }}>
              “{extra.tagline}”
            </p>
          )}

          <p
            className="rise mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ivory/80"
            style={{ "--d": "300ms" }}
          >
            {yearOf(item) && <span>{yearOf(item)}</span>}
            {runtime && <Dot>{runtime}</Dot>}
            {genres.length > 0 && <Dot>{genres.join(" / ")}</Dot>}
            {item.adult && <Dot>18+</Dot>}
            {score && (
              <Dot>
                <span className="inline-flex items-center gap-1 text-champagne">
                  <Star className="size-3 fill-current" aria-hidden="true" /> {score}
                </span>
              </Dot>
            )}
          </p>

          <p className="rise mt-6 max-w-[34rem] text-[15px] leading-relaxed text-ivory/70 sm:text-base" style={{ "--d": "360ms" }}>
            {trimText(item.overview, 230)}
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "440ms" }}>
            <Link to={`/watch/${item.id}?type=${mediaType}`} className="btn-primary">
              <Play className="size-4 fill-current" /> Watch trailer
            </Link>
            <Link to={`/watch/${item.id}?type=${mediaType}`} className="btn-ghost">
              Explore details <ArrowRight className="size-4" />
            </Link>
            <WatchlistButton item={item} type={mediaType} variant="icon" />
          </div>
        </div>
      </div>

      {/* Numbered selectors */}
      {items.length > 1 && (
        <div className="frame absolute inset-x-0 bottom-7 z-20">
          <div role="tablist" aria-label="Featured titles" className="flex items-end gap-3 sm:gap-5">
            {items.map((it, i) => (
              <button
                key={it.id}
                role="tab"
                type="button"
                aria-selected={i === index}
                aria-label={`Feature ${i + 1}: ${titleOf(it)}`}
                onClick={() => setIndex(i)}
                className="group flex min-h-[44px] flex-col justify-end gap-2 text-left"
              >
                <span
                  className={`font-display text-xl italic leading-none transition-colors duration-300 ${
                    i === index ? "text-champagne" : "text-mute group-hover:text-ivory"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`block h-px transition-[width,background-color] duration-700 ease-cine ${
                    i === index ? "w-14 bg-champagne sm:w-20" : "w-7 bg-white/25 group-hover:bg-white/60 sm:w-10"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const Dot = ({ children }) => (
  <>
    <span className="text-white/30" aria-hidden="true">•</span>
    <span>{children}</span>
  </>
);

export default Hero;
