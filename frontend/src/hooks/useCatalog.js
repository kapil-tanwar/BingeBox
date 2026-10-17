import { useEffect, useState } from "react";
import api from "../utils/api";
import { MOVIE_CATEGORIES, TV_CATEGORIES } from "../utils/constants";

// Module-level cache so moving between pages doesn't refetch the catalogue.
const cache = new Map();
const inflight = new Map();

async function load(type) {
  const categories = type === "movie" ? MOVIE_CATEGORIES : TV_CATEGORIES;
  const key = type === "movie" ? "movies" : "tvs";

  const settled = await Promise.allSettled(
    categories.map((category) => api.get(`/${type}/${category}`))
  );

  const lists = {};
  const seen = new Set();
  const all = [];
  let ok = 0;

  settled.forEach((res, i) => {
    if (res.status !== "fulfilled") {
      lists[categories[i]] = [];
      return;
    }
    ok += 1;
    const items = (res.value.data?.[key] || []).map((item) => ({
      ...item,
      media_type: type,
    }));
    lists[categories[i]] = items;
    items.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        all.push(item);
      }
    });
  });

  if (!ok) throw new Error("catalogue unavailable");
  return { lists, all };
}

/** Whole catalogue (every category) for a content type, de-duplicated. */
export function useCatalog(type) {
  const [state, setState] = useState(() =>
    cache.has(type)
      ? { status: "ready", data: cache.get(type) }
      : { status: "loading", data: null }
  );

  useEffect(() => {
    let alive = true;
    if (cache.has(type)) {
      setState({ status: "ready", data: cache.get(type) });
      return undefined;
    }
    setState({ status: "loading", data: null });

    if (!inflight.has(type)) {
      inflight.set(
        type,
        load(type)
          .then((data) => {
            cache.set(type, data);
            return data;
          })
          .finally(() => inflight.delete(type))
      );
    }
    inflight
      .get(type)
      .then((data) => alive && setState({ status: "ready", data }))
      .catch(() => alive && setState({ status: "error", data: null }));

    return () => {
      alive = false;
    };
  }, [type]);

  return state;
}
