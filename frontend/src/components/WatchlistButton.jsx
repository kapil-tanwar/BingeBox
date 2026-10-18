import { useState } from "react";
import { Bookmark, Check, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useWatchlistStore } from "../store/watchlist";
import { titleOf, typeOf, yearOf } from "../utils/media";

/** Add / remove a title from the viewer's watchlist. variant: "full" | "icon" */
const WatchlistButton = ({ item, type, variant = "full", className = "" }) => {
  const mediaType = type || typeOf(item);
  const saved = useWatchlistStore((s) =>
    s.items.some(
      (i) =>
        (Number(i.id) === Number(item.id) || i.id === item.id) &&
        (i.media_type === mediaType || i.type === mediaType)
    )
  );
  const toggle = useWatchlistStore((s) => s.toggle);
  const [burst, setBurst] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wasSaved = saved;
    toggle({
      id: item.id,
      media_type: mediaType,
      title: titleOf(item),
      name: item.name || item.title || "",
      poster_path: item.poster_path || null,
      backdrop_path: item.backdrop_path || null,
      year: yearOf(item),
      vote_average: item.vote_average || 0,
    });
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
    toast(!wasSaved ? "Added to your watchlist" : "Removed from your watchlist", {
      style: toastStyle,
    });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${titleOf(item)} from watchlist` : `Add ${titleOf(item)} to watchlist`}
        className={`grid size-11 place-items-center border border-white/25 bg-ink/60 text-ivory backdrop-blur-sm transition-colors duration-300 hover:border-champagne hover:text-champagne ${className}`}
      >
        <Bookmark
          className={`size-[18px] ${saved ? "fill-champagne text-champagne" : ""} ${burst ? "pop" : ""}`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      className={`btn-ghost ${saved ? "!border-champagne !text-champagne" : ""} ${className}`}
    >
      {saved ? (
        <Check className={`size-4 ${burst ? "pop" : ""}`} />
      ) : (
        <Plus className={`size-4 ${burst ? "pop" : ""}`} />
      )}
      {saved ? "On your watchlist" : "Add to watchlist"}
    </button>
  );
};

export const toastStyle = {
  background: "rgb(25 30 40)",
  color: "rgb(241 235 221)",
  border: "1px solid rgb(255 255 255 / 0.12)",
  borderRadius: 0,
  fontSize: "13px",
};

export default WatchlistButton;
