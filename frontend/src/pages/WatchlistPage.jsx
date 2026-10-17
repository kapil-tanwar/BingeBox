import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, X } from "lucide-react";
import Shell from "../components/Shell";
import Artwork from "../components/Artwork";
import Empty from "../components/Empty";
import { toastStyle } from "../components/WatchlistButton";
import toast from "react-hot-toast";
import { useWatchlistStore } from "../store/watchlist";

const WatchlistPage = () => {
  const items = useWatchlistStore((s) => s.items);
  const toggle = useWatchlistStore((s) => s.toggle);
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => items.filter((i) => filter === "all" || i.media_type === filter),
    [items, filter]
  );

  const remove = (item) => {
    toggle(item);
    toast("Removed from your watchlist", { style: toastStyle });
  };

  return (
    <Shell>
      <div className="page-enter frame pb-10 pt-14 sm:pt-20">
        <p className="eyebrow mb-5">Your shelf</p>
        <h1 className="display text-[clamp(3rem,8vw,7rem)]">
          Watch<em className="text-champagne">list</em>
        </h1>
        <p className="mt-5 max-w-md text-mute">
          Everything you've set aside for later. Saved on this device for your account.
        </p>

        {items.length > 0 && (
          <div role="group" aria-label="Filter" className="mt-8 flex gap-2">
            {[["all", "All"], ["movie", "Films"], ["tv", "Series"]].map(([v, label]) => (
              <button key={v} type="button" className="chip" aria-pressed={filter === v} onClick={() => setFilter(v)}>
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12" aria-live="polite">
          {items.length === 0 ? (
            <Empty
              title="Your shelf is empty."
              text="Tap the bookmark on any poster to keep it here."
              action={<Link to="/discover" className="btn-primary mt-8">Discover something</Link>}
            />
          ) : visible.length === 0 ? (
            <Empty title="Nothing in this filter." text="Try another view." />
          ) : (
            <ul className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {visible.map((item) => (
                <li key={`${item.media_type}-${item.id}`} className="group relative">
                  <Link
                    to={`/watch/${item.id}?type=${item.media_type}`}
                    className="poster on-art block"
                    aria-label={`${item.title} — view details`}
                  >
                    <Artwork path={item.poster_path} title={item.title} kind="poster" sizes="(min-width:1024px) 16vw, 44vw" />
                    <h2 className="mt-3.5 line-clamp-1 font-display text-[22px] leading-tight">{item.title}</h2>
                    <p className="mt-1 flex items-center gap-2 text-[12px] text-mute">
                      <span>{item.media_type === "tv" ? "Series" : "Film"}</span>
                      {item.year && <><span aria-hidden="true">·</span><span>{item.year}</span></>}
                      {item.vote_average > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-champagne">
                          <Star className="size-3 fill-current" aria-hidden="true" />
                          {Number(item.vote_average).toFixed(1)}
                        </span>
                      )}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label={`Remove ${item.title} from watchlist`}
                    className="absolute right-2 top-2 grid size-10 place-items-center border border-white/25 bg-ink/70 text-ivory backdrop-blur-sm transition-colors hover:border-ember hover:text-ember"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default WatchlistPage;
