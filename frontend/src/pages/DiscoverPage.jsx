import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Shell from "../components/Shell";
import PosterCard from "../components/PosterCard";
import Empty from "../components/Empty";
import { useCatalog } from "../hooks/useCatalog";
import { useContentStore } from "../store/content";
import { MOVIE_GENRES, TV_GENRES } from "../utils/constants";
import { dateOf } from "../utils/media";

const CATEGORY_LABELS = {
  now_playing: "In cinemas",
  top_rated: "Top rated",
  popular: "Popular",
  upcoming: "Upcoming",
  airing_today: "On air today",
};

const SORTS = {
  popular: ["Most popular", (a, b) => (b.popularity || 0) - (a.popularity || 0)],
  rating: ["Highest rated", (a, b) => (b.vote_average || 0) - (a.vote_average || 0)],
  newest: ["Newest first", (a, b) => dateOf(b).localeCompare(dateOf(a))],
  az: ["A – Z", (a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || "")],
};

const DiscoverPage = () => {
  const [params, setParams] = useSearchParams();
  const { contentType, setContentType } = useContentStore();

  const paramType = params.get("type");
  const type = paramType === "tv" || paramType === "movie" ? paramType : contentType;
  const category = params.get("category") || "all";
  const genre = params.get("genre") || "all";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "popular";

  useEffect(() => {
    if (type !== contentType) setContentType(type);
  }, [type, contentType, setContentType]);

  const catalog = useCatalog(type);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    next.set("type", patch.type || type);
    Object.entries(patch).forEach(([k, v]) => {
      if (k === "type") return;
      if (!v || v === "all" || (k === "sort" && v === "popular")) next.delete(k);
      else next.set(k, v);
    });
    setParams(next, { replace: true });
  };

  const genreMap = type === "tv" ? TV_GENRES : MOVIE_GENRES;

  const { results, genres, categories } = useMemo(() => {
    if (catalog.status !== "ready") return { results: [], genres: [], categories: [] };
    const { lists, all } = catalog.data;
    const base = category !== "all" && lists[category] ? lists[category] : all;

    const counts = {};
    base.forEach((i) => (i.genre_ids || []).forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
    const genres = Object.keys(counts)
      .filter((g) => genreMap[g])
      .sort((a, b) => counts[b] - counts[a])
      .map((g) => ({ id: g, name: genreMap[g], count: counts[g] }));

    const filtered = base
      .filter((i) => i.poster_path)
      .filter((i) => genre === "all" || (i.genre_ids || []).includes(Number(genre)));

    return {
      results: [...filtered].sort(SORTS[sort][1]),
      genres,
      categories: Object.keys(lists).filter((c) => lists[c].length),
    };
  }, [catalog, category, genre, sort, genreMap]);

  const signature = `${type}|${category}|${genre}|${sort}`;

  return (
    <Shell>
      <div className="page-enter">
        <header className="frame pb-10 pt-14 sm:pt-20">
          <p className="eyebrow mb-5">Discover</p>
          <h1 className="display text-[clamp(3rem,8vw,7rem)]">
            {type === "tv" ? <>Every <em className="text-champagne">series</em></> : <>Every <em className="text-champagne">film</em></>}
          </h1>
          <div role="group" aria-label="Catalogue" className="mt-8 flex gap-2">
            <button type="button" className="chip" aria-pressed={type === "movie"} onClick={() => update({ type: "movie", category: "all", genre: "all" })}>
              Films
            </button>
            <button type="button" className="chip" aria-pressed={type === "tv"} onClick={() => update({ type: "tv", category: "all", genre: "all" })}>
              Series
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="sticky top-[var(--nav-h)] z-30 border-y border-white/10 bg-ink/85 backdrop-blur-xl">
          <div className="frame flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Collection" className="scroller -mx-5 flex gap-2 overflow-x-auto px-5 scroll-px-5 sm:mx-0 sm:px-0">
              <button type="button" className="chip shrink-0" aria-pressed={category === "all"} onClick={() => update({ category: "all", genre: "all" })}>
                All
              </button>
              {categories.map((c) => (
                <button key={c} type="button" className="chip shrink-0" aria-pressed={category === c} onClick={() => update({ category: c, genre: "all" })}>
                  {CATEGORY_LABELS[c] || c}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-mute">
              Sort
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="min-h-[40px] border border-white/15 bg-night px-3 text-[12px] normal-case tracking-normal text-ivory focus:border-champagne focus:outline-none"
              >
                {Object.entries(SORTS).map(([key, [label]]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          {genres.length > 0 && (
            <div className="frame pb-4">
              <div role="group" aria-label="Genre" className="scroller -mx-5 flex gap-2 overflow-x-auto px-5 scroll-px-5 sm:mx-0 sm:px-0">
                <button type="button" className="chip shrink-0" aria-pressed={genre === "all"} onClick={() => update({ genre: "all" })}>
                  Any genre
                </button>
                {genres.map((g) => (
                  <button key={g.id} type="button" className="chip shrink-0" aria-pressed={String(genre) === String(g.id)} onClick={() => update({ genre: g.id })}>
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="frame pt-10" aria-live="polite">
          {catalog.status === "loading" && (
            <div aria-busy="true" className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3]" />
              ))}
            </div>
          )}

          {catalog.status === "error" && (
            <Empty title="The catalogue is out of reach." text="Check that the API server is running and try again." />
          )}

          {catalog.status === "ready" && (
            <>
              <p className="label mb-8">
                {results.length} {results.length === 1 ? "title" : "titles"}
              </p>
              {results.length === 0 ? (
                <Empty
                  title="Nothing matches those filters."
                  text="Try a different genre or collection."
                  action={<button type="button" className="btn-ghost mt-8" onClick={() => update({ category: "all", genre: "all" })}>Clear filters</button>}
                />
              ) : (
                <div
                  key={signature}
                  className="fade-in grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
                >
                  {results.map((item) => (
                    <PosterCard key={item.id} item={item} type={type} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Shell>
  );
};

export default DiscoverPage;
