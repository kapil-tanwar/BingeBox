import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Artwork from "./Artwork";
import WatchlistButton from "./WatchlistButton";
import { genreNames, rating, titleOf, typeOf, watchPath, yearOf } from "../utils/media";

/** Portrait poster with a quiet caption. The standard card for grids. */
const PosterCard = ({ item, type, caption = "meta", sizes, className = "", showSave = true, number }) => {
  const mediaType = type || typeOf(item);
  const title = titleOf(item);
  const score = rating(item);
  const genre = genreNames(item, mediaType)[0];

  return (
    <div className={`group relative ${className}`}>
      <Link
        to={watchPath(item, mediaType)}
        className="poster on-art block"
        aria-label={`${title}${yearOf(item) ? `, ${yearOf(item)}` : ""}`}
      >
        <Artwork
          path={item.poster_path}
          title={title}
          kind="poster"
          sizes={sizes || "(min-width:1280px) 16vw, (min-width:768px) 22vw, 44vw"}
          className="shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)]"
        >
          {number && (
            <span className="absolute left-3 top-3 font-display text-2xl italic text-ivory/90 drop-shadow">
              {number}
            </span>
          )}
        </Artwork>
        {caption !== "none" && (
          <div className="mt-3.5">
            <h3 className="line-clamp-1 font-display text-[22px] leading-tight text-ivory">{title}</h3>
            <p className="mt-1 flex items-center gap-2 text-[12px] text-mute">
              {yearOf(item) && <span>{yearOf(item)}</span>}
              {genre && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="line-clamp-1">{genre}</span>
                </>
              )}
              {score && (
                <span className="ml-auto flex items-center gap-1 text-champagne">
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  {score}
                </span>
              )}
            </p>
          </div>
        )}
      </Link>
      {showSave && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
          <WatchlistButton item={item} type={mediaType} variant="icon" className="!size-10" />
        </div>
      )}
    </div>
  );
};

export default PosterCard;
