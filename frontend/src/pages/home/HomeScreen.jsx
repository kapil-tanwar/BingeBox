import { useMemo } from "react";
import Shell from "../../components/Shell";
import Hero from "./Hero";
import { AfterDark, Curators, Gems, Ledger, Programme, WorldInFrames } from "./sections";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { useCatalog } from "../../hooks/useCatalog";
import { useContentStore } from "../../store/content";
import { DARK_GENRE_IDS } from "../../utils/constants";
import { daysUntil } from "../../utils/media";

const byRating = (a, b) => (b.vote_average || 0) - (a.vote_average || 0);

/** Pull `n` items passing `ok`, skipping ones already on the page. */
const take = (list, n, used, ok = () => true) => {
  const out = [];
  for (const item of list) {
    if (out.length >= n) break;
    if (used.has(item.id) || !ok(item)) continue;
    used.add(item.id);
    out.push(item);
  }
  return out;
};

const HomeScreen = () => {
  const { contentType, setContentType } = useContentStore();
  const { trendingContent } = useGetTrendingContent();
  const catalog = useCatalog(contentType);

  const sections = useMemo(() => {
    if (catalog.status !== "ready") return null;
    const { lists, all } = catalog.data;
    const used = new Set();
    const popular = lists.popular || [];

    const featured = [];
    if (trendingContent?.backdrop_path) {
      featured.push({ ...trendingContent, media_type: contentType });
      used.add(trendingContent.id);
    }
    featured.push(...take(popular, 5 - featured.length, used, (i) => i.backdrop_path));

    const programme = take(popular, 5, used, (i) => i.poster_path);
    const curators = take([...(lists.top_rated || [])].sort(byRating), 3, used, (i) => i.backdrop_path && i.overview);

    const afterDark = take(
      [...all].sort(byRating),
      10,
      new Set(),
      (i) => i.backdrop_path && i.genre_ids?.some((g) => DARK_GENRE_IDS.includes(g))
    );

    const world = take(
      all.filter((i) => i.original_language && i.original_language !== "en").sort(byRating),
      8,
      new Set(),
      (i) => i.poster_path
    );

    const ledgerSource =
      contentType === "movie"
        ? (lists.upcoming || [])
            .filter((i) => i.release_date && daysUntil(i.release_date) >= 0)
            .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
        : lists.airing_today || [];
    const ledger = take(ledgerSource, 6, new Set(), (i) => i.backdrop_path || i.poster_path);

    const gems = take(
      all
        .filter((i) => (i.vote_average || 0) >= 7 && (i.vote_count || 0) >= 50)
        .sort((a, b) => (a.popularity || 0) - (b.popularity || 0)),
      6,
      used,
      (i) => i.poster_path
    );

    return { featured, programme, curators, afterDark, world, ledger, gems };
  }, [catalog, trendingContent, contentType]);

  return (
    <Shell flush>
      {sections ? (
        <div className="page-enter">
          <Hero items={sections.featured} type={contentType} />

          <div className="frame -mt-2 flex items-center justify-between border-y border-white/10 py-3">
            <p className="label hidden sm:block">The programme</p>
            <div role="group" aria-label="Catalogue" className="flex gap-2">
              <button type="button" className="chip" aria-pressed={contentType === "movie"} onClick={() => setContentType("movie")}>
                Films
              </button>
              <button type="button" className="chip" aria-pressed={contentType === "tv"} onClick={() => setContentType("tv")}>
                Series
              </button>
            </div>
          </div>

          <Programme items={sections.programme} type={contentType} />
          <Curators items={sections.curators} type={contentType} />
          <AfterDark items={sections.afterDark} type={contentType} />
          <WorldInFrames items={sections.world} type={contentType} />
          <Ledger items={sections.ledger} type={contentType} />
          <Gems items={sections.gems} type={contentType} />
        </div>
      ) : catalog.status === "error" ? (
        <div className="frame grid min-h-[80vh] place-items-center text-center">
          <div>
            <p className="eyebrow">Intermission</p>
            <h1 className="display mt-4 text-5xl sm:text-7xl">The projector stalled.</h1>
            <p className="mx-auto mt-5 max-w-md text-mute">
              We couldn't reach the catalogue. Check that the API server is running, then try again.
            </p>
            <button type="button" className="btn-ghost mt-8" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      ) : (
        <HomeSkeleton />
      )}
    </Shell>
  );
};

const HomeSkeleton = () => (
  <div aria-busy="true" aria-label="Loading">
    <div className="skeleton relative h-[min(100svh,780px)] min-h-[560px]">
      <div className="frame flex h-full flex-col justify-end gap-5 pb-24">
        <div className="h-3 w-32 bg-white/10" />
        <div className="h-24 w-[min(80%,560px)] bg-white/10" />
        <div className="h-4 w-[min(70%,420px)] bg-white/10" />
      </div>
    </div>
    <div className="frame mt-24 grid grid-cols-2 gap-6 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton aspect-[2/3]" />
      ))}
    </div>
  </div>
);

export default HomeScreen;
