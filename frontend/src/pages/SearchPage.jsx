import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import Shell from "../components/Shell";
import PosterCard from "../components/PosterCard";
import Empty from "../components/Empty";
import { useCatalog } from "../hooks/useCatalog";
import { useContentStore } from "../store/content";
import api from "../utils/api";
import { dateOf } from "../utils/media";

const SORTS = {
  relevance: ["Relevance", null],
  rating: ["Highest rated", (a, b) => (b.vote_average || 0) - (a.vote_average || 0)],
  newest: ["Newest first", (a, b) => dateOf(b).localeCompare(dateOf(a))],
};

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") || "";
  const [text, setText] = useState(urlQuery);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error | noauth
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("relevance");
  const inputRef = useRef(null);
  const { contentType } = useContentStore();
  const suggestions = useCatalog(contentType);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the URL in step with what's typed (debounced) so results are linkable.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = text.trim();
      if (q !== urlQuery) {
        const next = new URLSearchParams(params);
        if (q) next.set("q", q);
        else next.delete("q");
        setParams(next, { replace: true });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const q = urlQuery.trim();
    if (!q) {
      setStatus("idle");
      setResults([]);
      return undefined;
    }
    let alive = true;
    setStatus("loading");
    api
      .get("/search/multi", { params: { query: q } })
      .then((res) => {
        if (!alive) return;
        const list = (res.data.results || []).filter(
          (r) => (r.media_type === "movie" || r.media_type === "tv") && (r.poster_path || r.backdrop_path)
        );
        setResults(list);
        setStatus("ready");
      })
      .catch((err) => {
        if (!alive) return;
        console.error("Error fetching data:", err);
        setStatus(err?.response?.status === 401 ? "noauth" : "error");
      });
    return () => {
      alive = false;
    };
  }, [urlQuery]);

  const visible = useMemo(() => {
    const filtered = results.filter((r) => filter === "all" || r.media_type === filter);
    const cmp = SORTS[sort][1];
    return cmp ? [...filtered].sort(cmp) : filtered;
  }, [results, filter, sort]);

  const popular =
    suggestions.status === "ready" ? (suggestions.data.lists.popular || []).filter((i) => i.poster_path).slice(0, 6) : [];

  return (
    <Shell>
      <div className="page-enter frame pb-10 pt-14 sm:pt-20">
        <p className="eyebrow mb-5">Search</p>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const next = new URLSearchParams(params);
            if (text.trim()) next.set("q", text.trim());
            setParams(next, { replace: true });
          }}
          className="relative"
        >
          <label htmlFor="q" className="sr-only">Search films and series</label>
          <Search className="pointer-events-none absolute left-0 top-1/2 size-7 -translate-y-1/2 text-champagne sm:size-8" aria-hidden="true" />
          <input
            id="q"
            ref={inputRef}
            type="search"
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search films and series"
            className="w-full border-0 border-b border-white/20 bg-transparent py-5 pl-11 pr-12 font-display text-[clamp(2rem,6vw,4.5rem)] leading-tight text-ivory placeholder:text-mute/50 transition-colors focus:border-champagne focus:outline-none sm:pl-14 [&::-webkit-search-cancel-button]:hidden"
          />
          {text && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setText("");
                inputRef.current?.focus();
              }}
              className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-mute hover:text-ivory"
            >
              <X className="size-5" />
            </button>
          )}
        </form>

        {status === "ready" && results.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label="Type" className="flex gap-2">
              {[["all", "All"], ["movie", "Films"], ["tv", "Series"]].map(([v, label]) => (
                <button key={v} type="button" className="chip" aria-pressed={filter === v} onClick={() => setFilter(v)}>
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-mute">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="min-h-[40px] border border-white/15 bg-night px-3 text-[12px] normal-case tracking-normal text-ivory focus:border-champagne focus:outline-none"
              >
                {Object.entries(SORTS).map(([key, [label]]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="mt-12" aria-live="polite">
          {status === "idle" && popular.length > 0 && (
            <section aria-label="Suggestions">
              <p className="label mb-6">Popular right now</p>
              <div className="fade-in grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {popular.map((item) => (
                  <PosterCard key={item.id} item={item} type={contentType} />
                ))}
              </div>
            </section>
          )}

          {status === "loading" && (
            <div aria-busy="true" className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3]" />
              ))}
            </div>
          )}

          {status === "ready" && (
            visible.length === 0 ? (
              <Empty
                title={`No results for “${urlQuery}”.`}
                text="Check the spelling, or try a shorter title."
              />
            ) : (
              <>
                <p className="label mb-8">{visible.length} {visible.length === 1 ? "result" : "results"}</p>
                <div key={`${filter}-${sort}-${urlQuery}`} className="fade-in grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                  {visible.map((item) => (
                    <PosterCard key={`${item.media_type}-${item.id}`} item={item} type={item.media_type} />
                  ))}
                </div>
              </>
            )
          )}

          {status === "noauth" && (
            <Empty
              title="Search isn't configured."
              text="Ensure the backend is running and the TMDB_API_KEY is set in the backend .env file."
            />
          )}
          {status === "error" && (
            <Empty title="Search hit a snag." text="Please check your connection and try again." />
          )}
        </div>
      </div>
    </Shell>
  );
};

export default SearchPage;
