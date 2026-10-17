import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Artwork from "../../components/Artwork";
import PosterCard from "../../components/PosterCard";
import Scroller from "../../components/Scroller";
import SectionHeading from "../../components/SectionHeading";
import WatchlistButton from "../../components/WatchlistButton";
import useReveal from "../../hooks/useReveal";
import {
  daysUntil,
  genreNames,
  languageName,
  rating,
  titleOf,
  trimText,
  typeOf,
  watchPath,
  yearOf,
} from "../../utils/media";

const Reveal = ({ children, delay = 0, className = "", as: Tag = "div" }) => {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--d": `${delay}ms` }}>
      {children}
    </Tag>
  );
};

/* 01 — Tonight's Programme: an asymmetric poster gallery ---------------- */
const SLOTS = [
  "lg:col-span-3 lg:mt-0",
  "lg:col-span-2 lg:mt-24",
  "lg:col-span-3 lg:mt-8",
  "lg:col-span-2 lg:mt-32",
  "lg:col-span-2 lg:mt-12",
];

export const Programme = ({ items, type }) => {
  if (items.length < 3) return null;
  return (
    <section className="frame pt-24 sm:pt-32" aria-label="Tonight's programme">
      <SectionHeading
        index="01"
        eyebrow="Tonight's programme"
        title={<>What the world is <em className="text-champagne">watching</em></>}
        blurb="The titles drawing the largest audiences right now, arranged like a festival wall."
        to={`/discover?type=${type}`}
        cta="Browse everything"
      />
      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-12 lg:gap-x-8">
        {items.slice(0, 5).map((item, i) => (
          <Reveal key={item.id} delay={i * 90} className={`min-w-0 ${SLOTS[i]} ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
            <PosterCard
              item={item}
              type={type}
              number={String(i + 1).padStart(2, "0")}
              sizes={i % 2 === 0 ? "(min-width:1024px) 26vw, 50vw" : "(min-width:1024px) 17vw, 50vw"}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* 02 — Curator's Selection: alternating editorial features -------------- */
export const Curators = ({ items, type }) => {
  if (!items.length) return null;
  return (
    <section className="frame pt-28 sm:pt-40" aria-label="Curator's selection">
      <SectionHeading
        index="02"
        eyebrow="Curator's selection"
        title={<>Three films, <em className="text-champagne">considered</em></>}
        blurb="Handpicked from the highest-rated titles in the catalogue."
      />
      <div className="mt-16 flex flex-col gap-24 sm:gap-32">
        {items.slice(0, 3).map((item, i) => {
          const mediaType = typeOf(item, type);
          const flip = i % 2 === 1;
          const genres = genreNames(item, mediaType).slice(0, 2).join(" / ");
          return (
            <article key={item.id} className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-0">
              <Reveal className={`${flip ? "lg:order-2 lg:col-span-7 lg:col-start-6" : "lg:col-span-7"}`}>
                <Link to={watchPath(item, type)} className="poster on-art block" aria-label={`${titleOf(item)} — details`}>
                  <Artwork
                    path={item.backdrop_path || item.poster_path}
                    title={titleOf(item)}
                    kind={item.backdrop_path ? "backdrop" : "poster"}
                    ratio="backdrop"
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]"
                  />
                </Link>
              </Reveal>
              <Reveal
                delay={160}
                className={`relative lg:col-span-5 ${
                  flip ? "lg:order-1 lg:col-start-1 lg:row-start-1 lg:pr-14" : "lg:pl-14"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 right-0 select-none font-display text-[9rem] italic leading-none text-white/[0.05] sm:text-[12rem]"
                >
                  {i + 1}
                </span>
                <p className="eyebrow relative">Nº {i + 1} · {rating(item) && `${rating(item)} rating`}</p>
                <h3 className="display relative mt-4 text-[clamp(2.4rem,4.4vw,4.2rem)]">{titleOf(item)}</h3>
                <p className="label relative mt-4">
                  {[yearOf(item), genres].filter(Boolean).join("  ·  ")}
                </p>
                <p className="relative mt-5 max-w-md text-[15px] leading-relaxed text-ivory/70">
                  {trimText(item.overview, 240)}
                </p>
                <div className="relative mt-8 flex items-center gap-3">
                  <Link to={watchPath(item, type)} className="btn-ghost">
                    Explore details <ArrowRight className="size-4" />
                  </Link>
                  <WatchlistButton item={item} type={mediaType} variant="icon" />
                </div>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
};

/* 03 — After Dark: a moody full-bleed band ------------------------------- */
export const AfterDark = ({ items, type }) => {
  if (items.length < 3) return null;
  return (
    <section
      aria-label="After dark"
      className="relative mt-28 overflow-hidden py-24 sm:mt-40 sm:py-32"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 80% 0%, rgb(var(--champagne) / 0.07), transparent 70%), linear-gradient(180deg, rgb(var(--ink)) 0%, rgb(3 4 7) 22%, rgb(var(--night)) 100%)",
      }}
    >
      <div className="frame">
        <SectionHeading
          index="03"
          eyebrow="After dark"
          title={<>For the <em className="text-champagne">late hours</em></>}
          blurb="Mystery, crime and nerves — best watched with the lights low."
        />
        <Scroller label="After dark titles" className="mt-14">
          {items.map((item) => {
            const mediaType = typeOf(item, type);
            return (
              <Link
                key={item.id}
                to={watchPath(item, type)}
                className="poster on-art group w-[80vw] shrink-0 sm:w-[430px]"
              >
                <Artwork
                  path={item.backdrop_path}
                  title={titleOf(item)}
                  kind="backdrop"
                  sizes="(min-width:640px) 430px, 80vw"
                  imgClassName="brightness-[0.72] saturate-[0.8] transition-[filter] duration-700 group-hover:brightness-95 group-hover:saturate-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="label !text-champagne">{genreNames(item, mediaType)[0]}</p>
                    <h3 className="mt-1 font-display text-[28px] leading-tight">{titleOf(item)}</h3>
                  </div>
                </Artwork>
              </Link>
            );
          })}
        </Scroller>
      </div>
    </section>
  );
};

/* 04 — A World in Frames: international cinema --------------------------- */
export const WorldInFrames = ({ items, type }) => {
  if (items.length < 3) return null;
  return (
    <section className="frame pt-28 sm:pt-40" aria-label="A world in frames">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            index="04"
            eyebrow="A world in frames"
            title={<>Beyond the <em className="text-champagne">mainstream</em></>}
            blurb="Stories told in other languages, from other places. Subtitles are a small price."
          />
        </div>
        <Scroller label="International titles" bleed="right">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 60} className="w-[58vw] shrink-0 sm:w-[240px]">
              <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-champagne">
                <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
                {languageName(item.original_language)}
              </p>
              <PosterCard item={item} type={type} sizes="240px" />
            </Reveal>
          ))}
        </Scroller>
      </div>
    </section>
  );
};

/* 05 — Coming soon: a release ledger ------------------------------------- */
const MONTH = { month: "short" };

export const Ledger = ({ items, type }) => {
  if (!items.length) return null;
  const upcoming = type === "movie";
  return (
    <section className="frame pt-28 sm:pt-40" aria-label={upcoming ? "Coming soon" : "On air"}>
      <SectionHeading
        index="05"
        eyebrow={upcoming ? "Coming soon" : "On air today"}
        title={upcoming ? <>Mark your <em className="text-champagne">calendar</em></> : <>Airing <em className="text-champagne">today</em></>}
        blurb={upcoming ? "Releases still ahead, in order of arrival." : "Series with new episodes on the schedule today."}
      />
      <ol className="mt-12 border-t border-white/10">
        {items.map((item, i) => {
          const date = upcoming && item.release_date ? new Date(item.release_date) : null;
          const days = upcoming ? daysUntil(item.release_date) : null;
          return (
            <Reveal as="li" key={item.id} delay={i * 50} className="border-b border-white/10">
              <Link
                to={watchPath(item, type)}
                className="group grid grid-cols-[72px_1fr_auto] items-center gap-5 py-6 transition-[padding] duration-500 ease-cine hover:pl-3 sm:grid-cols-[110px_1fr_160px_auto] sm:gap-8"
              >
                <span className="text-center sm:text-left">
                  {date ? (
                    <>
                      <span className="block font-display text-[44px] leading-none text-ivory sm:text-6xl">
                        {String(date.getDate()).padStart(2, "0")}
                      </span>
                      <span className="label">{date.toLocaleDateString("en-US", MONTH)}</span>
                    </>
                  ) : (
                    <span className="font-display text-4xl italic text-champagne sm:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[26px] leading-tight sm:text-4xl">
                    {titleOf(item)}
                  </span>
                  <span className="label mt-1 block truncate">
                    {genreNames(item, type).slice(0, 3).join("  ·  ")}
                  </span>
                </span>
                <span className="hidden sm:block">
                  <Artwork
                    path={item.backdrop_path}
                    title={titleOf(item)}
                    kind="backdrop"
                    sizes="160px"
                    className="w-40 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </span>
                <span className="flex flex-col items-end gap-1 text-right">
                  {days !== null && (
                    <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-champagne">
                      {days <= 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
                    </span>
                  )}
                  <ArrowRight className="size-5 text-mute transition-transform duration-500 ease-cine group-hover:translate-x-1 group-hover:text-champagne" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
};

/* 06 — Hidden Gems -------------------------------------------------------- */
export const Gems = ({ items, type }) => {
  if (items.length < 4) return null;
  return (
    <section className="frame pt-28 sm:pt-40" aria-label="Hidden gems">
      <SectionHeading
        index="06"
        eyebrow="Hidden gems"
        title={<>Loved by <em className="text-champagne">few</em>, deserved by more</>}
        blurb="Well-rated titles that haven't found their crowd yet."
        to={`/discover?type=${type}`}
      />
      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {items.slice(0, 6).map((item, i) => (
          <Reveal key={item.id} delay={(i % 6) * 70}>
            <PosterCard item={item} type={type} sizes="(min-width:1024px) 15vw, 30vw" />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

