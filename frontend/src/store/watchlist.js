import { create } from "zustand";
import api from "../utils/api";

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
    /* storage full or blocked */
  }
};

export const useWatchlistStore = create((set, get) => ({
  userId: null,
  items: [],
  isLoading: false,

  load: async (userId) => {
    if (!userId) return set({ userId: null, items: [], isLoading: false });

    // 1. Instant optimistic load from localStorage
    const local = read(userId);
    set({ userId, items: local, isLoading: true });

    // 2. Fetch durable source of truth from MongoDB
    try {
      const res = await api.get("/watchlist");
      if (res.data?.success && Array.isArray(res.data.watchlist)) {
        const dbItems = res.data.watchlist;

        // If local had items not yet in DB (e.g. created prior to backend sync), merge them
        const merged = [...dbItems];
        local.forEach((localItem) => {
          const inDb = merged.some(
            (m) =>
              (Number(m.id) === Number(localItem.id) || m.id === localItem.id) &&
              (m.media_type === (localItem.media_type || localItem.type) ||
                m.type === (localItem.media_type || localItem.type))
          );
          if (!inDb) {
            merged.push(localItem);
            // Sync missing local item to DB
            api.post("/watchlist/toggle", localItem).catch(() => {});
          }
        });

        set({ items: merged, isLoading: false });
        write(userId, merged);
      } else {
        set({ isLoading: false });
      }
    } catch {
      // Offline or network error: local items remain active
      set({ isLoading: false });
    }
  },

  has: (id, type) =>
    get().items.some(
      (i) =>
        (Number(i.id) === Number(id) || i.id === id) &&
        (i.media_type === type || i.type === type)
    ),

  toggle: async (entry) => {
    const { userId, items } = get();
    const targetType = entry.media_type || entry.type || "movie";
    const targetId = Number(entry.id) || entry.id;

    const exists = items.some(
      (i) =>
        (Number(i.id) === targetId || i.id === targetId) &&
        (i.media_type === targetType || i.type === targetType)
    );

    // 1. Optimistic UI update
    const next = exists
      ? items.filter(
          (i) =>
            !(
              (Number(i.id) === targetId || i.id === targetId) &&
              (i.media_type === targetType || i.type === targetType)
            )
        )
      : [{ ...entry, id: targetId, media_type: targetType, addedAt: Date.now() }, ...items];

    set({ items: next });
    if (userId) write(userId, next);

    // 2. Persist directly to MongoDB in the backend
    try {
      const res = await api.post("/watchlist/toggle", {
        ...entry,
        id: targetId,
        media_type: targetType,
      });
      if (res.data?.success && Array.isArray(res.data.watchlist)) {
        set({ items: res.data.watchlist });
        if (userId) write(userId, res.data.watchlist);
      }
    } catch (err) {
      console.error("Watchlist DB sync failed, cached locally:", err);
    }

    return !exists;
  },
}));
