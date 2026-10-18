import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Play, Star } from "lucide-react";
import Shell from "../components/Shell";
import Artwork from "../components/Artwork";
import PosterCard from "../components/PosterCard";
import Scroller from "../components/Scroller";
import SectionHeading from "../components/SectionHeading";
import WatchlistButton from "../components/WatchlistButton";
import api from "../utils/api";
import { useContentStore } from "../store/content";
import { formatReleaseDate } from "../utils/dateFunction";
import { formatRuntime, languageName, rating, titleOf, typeOf, yearOf } from "../utils/media";

const WatchPage = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const { contentType, setContentType } = useContentStore();

  // Links carry ?type= so a TV id can't be mistaken for a film id.
  const paramType = params.get("type");
  const type = paramType === "tv" || paramType === "movie" ? paramType : contentType;

  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    if (type !== contentType) setContentType(type);
  }, [type, contentType, setContentType]);

  useEffect(() => {
    let alive = true;
    setTrailers([]);
    setCurrentTrailerIdx(0);
    api
      .get(`/${type}/${id}/trailers`)
      .then((res) => alive && setTrailers(res.data.trailers || []))
      .catch(() => alive && setTrailers([]));
    return () => {
      alive = false;
    };
  }, [type, id]);

  useEffect(() => {
    let alive = true;
    setSimilarContent([]);
    api
      .get(`/${type}/${id}/similar`)
      .then((res) => alive && setSimilarContent(res.data.similar || []))
      .catch(() => alive && setSimilarContent([]));
    return () => {
      alive = false;
    };
  }, [type, id]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/${type}/${id}/details`)
      .then((res) => alive && setContent(res.data.details))
      .catch(() => alive && setContent(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [type, id]);

  // Cast & crew are derived directly from content.credits or state.
  useEffect(() => {
    if (content?.credits) {
      setCredits(content.credits);
    }
  }, [content]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [type, id]);

  const videos = useMemo(
    () =>
      trailers
        .filter((t) => t.site === "YouTube")
        .sort((a, b) => Number(b.type === "Trailer") - Number(a.type === "Trailer")),
    [trailers]
  );

  if (loading) return <WatchSkeleton />;

  if (!content) {
    return (
      <Shell>
        <div className="frame grid min-h-[70vh] place-items-center text-center">
          <div>
            <p className="eyebrow">Reel missing</p>
            <h1 className="display mt-4 text-5xl sm:text-7xl">We couldn't find that title.</h1>
            <Link to="/" className="btn-ghost mt-8">Back to the programme</Link>
          </div>
        </div>
      </Shell>
    );
  }

  const title = titleOf(content);
  const mediaType = typeOf(content, type);
  const original = content.original_title || content.original_name;
  const runtime = formatRuntime(content.runtime || content.episode_run_time?.[0]);
  const score = rating(content);
  const directors = (content?.credits?.crew || credits?.crew || []).filter((c) => c.job === "Director");
  const makers =
    mediaType === "tv" ? content.created_by || [] : directors;
  const cast = (content?.credits?.cast || credits?.cast || []).slice(0, 10);
  const seasons = (content.seasons || []).filter((s) => s.season_number > 0 || content.seasons.length === 1);
  const current = videos[Math.min(currentTrailerIdx, videos.length - 1)];

  const facts = [
    [mediaType === "tv" ? "Created by" : "Directed by", makers.map((m) => m.name).join(", ")],
    ["Released", formatReleaseDate(content.release_date || content.first_air_date)],
    ["Language", languageName(content.original_language)],
    ["Status", content.status],
    mediaType === "tv"
      ? ["Scale", content.number_of_seasons ? `${content.number_of_seasons} seasons · ${content.number_of_episodes} episodes` : ""]
      : ["Runtime", runtime],
    ["Studios", (content.production_companies || []).slice(0, 3).map((c) => c.name).join(", ")],
    ["Countries", (content.production_countries || []).map((c) => c.name).slice(0, 3).join(", ")],
  ].filter(([, v]) => v);

  return (
    <Shell flush>
      <div className="page-enter">
        {/* Opening frame */}
        <section className="relative isolate overflow-hidden min-h-[560px] lg:min-h-[680px]">
          {/* Large background backdrop poster */}
          <div className="fade-in absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {(content.backdrop_path || content.poster_path) && (
              <img
                src={`https://image.tmdb.org/t/p/original${content.backdrop_path || content.poster_path}`}
                alt={title}
                className="hero-drift absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-50 scale-105"
                loading="eager"
                decoding="async"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />
          </div>

          <div className="frame relative z-10 grid gap-10 pb-16 pt-[calc(var(--nav-h)+120px)] md:grid-cols-[minmax(0,260px)_1fr] md:items-end md:gap-14 lg:pt-[calc(var(--nav-h)+180px)]">
            <div className="rise block w-[160px] sm:w-[220px] md:w-[min(260px,100%)]">
              <Artwork
                path={content.poster_path}
                title={title}
                kind="poster"
                priority
                sizes="260px"
                className="shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10"
              />
            </div>

            <div>
              <p className="rise eyebrow mb-5">{mediaType === "tv" ? "Series" : "Film"}</p>
              <h1
                className="rise display text-balance break-words text-[clamp(3rem,8vw,7.5rem)]"
                style={{ "--d": "100ms" }}
              >
                {title}
              </h1>
              {original && original !== title && (
                <p className="rise mt-3 font-display text-xl italic text-mute" style={{ "--d": "160ms" }}>
                  {original}
                </p>
              )}
              {content.tagline && (
                <p className="rise mt-5 font-display text-2xl italic text-champagne/90" style={{ "--d": "200ms" }}>
                  “{content.tagline}”
                </p>
              )}

              <ul className="rise mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ivory/80" style={{ "--d": "260ms" }}>
                {yearOf(content) && <li>{yearOf(content)}</li>}
                {runtime && <li>{runtime}</li>}
                {content.adult && <li>18+</li>}
                {score && (
                  <li className="flex items-center gap-1.5 text-champagne">
                    <Star className="size-3.5 fill-current" aria-hidden="true" />
                    {score}
                    <span className="text-mute">/ 10</span>
                  </li>
                )}
                {(content.genres || []).map((g) => (
                  <li key={g.id} className="border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                    {g.name}
                  </li>
                ))}
              </ul>

              <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "340ms" }}>
                {videos.length > 0 && (
                  <a
                    href="#screening"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("screening")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="btn-primary"
                  >
                    <Play className="size-4 fill-current" /> Watch trailer
                  </a>
                )}
                <WatchlistButton item={content} type={mediaType} />
              </div>
            </div>
          </div>
        </section>

        {/* Synopsis + fact sheet */}
        <section className="frame grid gap-14 pt-6 lg:grid-cols-[1.5fr_1fr] lg:gap-24" aria-label="About">
          <div>
            <p className="label mb-5">Synopsis</p>
            <p className="max-w-2xl text-[19px] leading-[1.75] text-ivory/85 sm:text-[21px]">
              {content.overview || "No synopsis is available for this title yet."}
            </p>
          </div>
          {facts.length > 0 && (
            <dl className="divide-y divide-white/10 border-y border-white/10">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3.5 text-sm">
                  <dt className="label pt-0.5">{k}</dt>
                  <dd className="text-ivory/85">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="frame pt-24" aria-label="Cast">
            <p className="label mb-6">Cast</p>
            <Scroller label="Cast members">
              {cast.map((c) => (
                <div key={c.id} className="w-[120px] shrink-0 sm:w-[140px]">
                  <Artwork path={c.profile_path} title={c.name} kind="poster" sizes="140px" />
                  <p className="mt-3 line-clamp-1 font-display text-lg leading-tight">{c.name}</p>
                  <p className="line-clamp-1 text-xs text-mute">{c.character}</p>
                </div>
              ))}
            </Scroller>
          </section>
        )}

        {/* Screening room */}
        <section id="screening" className="frame scroll-mt-24 pt-24 sm:pt-32" aria-label="Trailers">
          <SectionHeading
            eyebrow="The screening room"
            title={<>Press <em className="text-champagne">play</em></>}
          />
          {current ? (
            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="aspect-video w-full overflow-hidden bg-black ring-1 ring-white/10">
                <ReactPlayer
                  key={current.key}
                  controls
                  width="100%"
                  height="100%"
                  url={`https://www.youtube.com/watch?v=${current.key}`}
                />
              </div>
              <ol className="flex max-h-[420px] flex-col overflow-y-auto border-t border-white/10 lg:max-h-none">
                {videos.slice(0, 8).map((v, i) => (
                  <li key={v.key}>
                    <button
                      type="button"
                      onClick={() => setCurrentTrailerIdx(i)}
                      aria-current={i === currentTrailerIdx}
                      className={`flex w-full items-baseline gap-4 border-b border-white/10 py-4 text-left transition-colors duration-300 ${
                        i === currentTrailerIdx ? "text-champagne" : "text-ivory/70 hover:text-ivory"
                      }`}
                    >
                      <span className="font-display text-lg italic">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{v.name}</span>
                        <span className="label">{v.type}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="mt-12 border border-dashed border-white/15 px-6 py-16 text-center">
              <p className="font-display text-3xl">No trailers yet for {title}.</p>
              <p className="mt-2 text-sm text-mute">Check back closer to release.</p>
            </div>
          )}
        </section>

        {/* Seasons */}
        {mediaType === "tv" && seasons.length > 0 && (
          <section className="frame pt-24 sm:pt-32" aria-label="Seasons">
            <SectionHeading eyebrow="Seasons" title={<>The <em className="text-champagne">full run</em></>} />
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {seasons.map((s) => (
                <div key={s.id}>
                  <Artwork path={s.poster_path || content.poster_path} title={s.name} kind="poster" sizes="(min-width:1024px) 15vw, 40vw" />
                  <h3 className="mt-3 font-display text-xl leading-tight">{s.name}</h3>
                  <p className="text-xs text-mute">
                    {s.episode_count} episodes{s.air_date ? ` · ${s.air_date.slice(0, 4)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {similarContent.filter((s) => s.poster_path).length > 0 && (
          <section className="frame pt-24 sm:pt-32" aria-label="Related titles">
            <SectionHeading eyebrow="Related" title={<>If you liked <em className="text-champagne">this</em></>} />
            <Scroller label="Related titles" className="mt-12">
              {similarContent
                .filter((s) => s.poster_path)
                .map((s) => (
                  <div key={s.id} className="w-[46vw] shrink-0 sm:w-[210px]">
                    <PosterCard item={s} type={mediaType} sizes="210px" />
                  </div>
                ))}
            </Scroller>
          </section>
        )}
      </div>
    </Shell>
  );
};

const WatchSkeleton = () => (
  <Shell flush footer={false}>
    <div aria-busy="true" aria-label="Loading">
      <div className="skeleton h-[70vh] min-h-[480px]">
        <div className="frame flex h-full flex-col justify-end gap-5 pb-16">
          <div className="h-3 w-24 bg-white/10" />
          <div className="h-20 w-[min(80%,520px)] bg-white/10" />
          <div className="h-4 w-[min(60%,360px)] bg-white/10" />
        </div>
      </div>
      <div className="frame mt-10 space-y-3">
        <div className="skeleton h-4 w-full max-w-2xl" />
        <div className="skeleton h-4 w-full max-w-xl" />
        <div className="skeleton h-4 w-full max-w-lg" />
      </div>
    </div>
  </Shell>
);

export default WatchPage;
