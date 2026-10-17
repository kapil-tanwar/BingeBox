import { MOVIE_GENRES, TV_GENRES } from "./constants";

export const titleOf = (item) =>
  item?.title ||
  item?.name ||
  item?.original_title ||
  item?.original_name ||
  "Untitled";

export const dateOf = (item) => item?.release_date || item?.first_air_date || "";

export const yearOf = (item) => dateOf(item).slice(0, 4);

/** movie | tv — list responses from our API don't carry media_type, so infer it. */
export const typeOf = (item, fallback = "movie") => {
  if (item?.media_type === "movie" || item?.media_type === "tv") {
    return item.media_type;
  }
  if (item?.first_air_date !== undefined && item?.release_date === undefined) {
    return "tv";
  }
  if (item?.release_date !== undefined) return "movie";
  return fallback;
};

export const watchPath = (item, fallback = "movie") =>
  `/watch/${item.id}?type=${typeOf(item, fallback)}`;

export const genreNames = (item, type) => {
  if (Array.isArray(item?.genres) && item.genres.length) {
    return item.genres.map((g) => g.name);
  }
  const map = (type || typeOf(item)) === "tv" ? TV_GENRES : MOVIE_GENRES;
  return (item?.genre_ids || []).map((id) => map[id]).filter(Boolean);
};

export const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const rating = (item) =>
  item?.vote_average && item.vote_count !== 0
    ? Number(item.vote_average).toFixed(1)
    : "";

let languageNames;
export const languageName = (code) => {
  if (!code) return "";
  try {
    languageNames =
      languageNames || new Intl.DisplayNames(["en"], { type: "language" });
    return languageNames.of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

export const daysUntil = (date) => {
  if (!date) return null;
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
};

export const hasArt = (item) => Boolean(item?.poster_path || item?.backdrop_path);

export const trimText = (text, max) => {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "") + "…";
};
