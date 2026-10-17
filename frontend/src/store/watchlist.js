import { create } from "zustand";

/*
 * Client-side watchlist, stored per signed-in user in localStorage.
 * (The backend has no watchlist endpoints; this keeps the redesign purely
 * front-end. Every storage access is guarded — storage can be unavailable.)
 */
const keyFor = (userId) => `bingebox:watchlist:${userId}`;

const read = (userId) => {
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (userId, items) => {
  try {
    window.localStorage.setItem(keyFor(userId), JSON.stringify(items));
  } catch {
    /* storage full or blocked — the in-memory list still works */
  }
};

export const useWatchlistStore = create((set, get) => ({
  userId: null,
  items: [],

  load: (userId) => {
    if (!userId) return set({ userId: null, items: [] });
    set({ userId, items: read(userId) });
  },

  has: (id, type) =>
    get().items.some((i) => i.id === id && i.media_type === type),

  toggle: (entry) => {
    const { userId, items } = get();
    const exists = items.some(
      (i) => i.id === entry.id && i.media_type === entry.media_type
    );
    const next = exists
      ? items.filter(
          (i) => !(i.id === entry.id && i.media_type === entry.media_type)
        )
      : [{ ...entry, addedAt: Date.now() }, ...items];
    set({ items: next });
    if (userId) write(userId, next);
    return !exists;
  },
}));
