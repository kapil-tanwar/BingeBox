import { User } from "../model/user.model.js";

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("watchlist");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, watchlist: user.watchlist || [] });
  } catch (error) {
    console.error("Error in getWatchlist controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const toggleWatchlist = async (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ success: false, message: "Item with id is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const targetId = Number(item.id) || item.id;
    const targetType = item.media_type || item.type || "movie";

    const currentList = Array.isArray(user.watchlist) ? user.watchlist : [];
    const exists = currentList.some(
      (i) =>
        (Number(i.id) === targetId || i.id === targetId) &&
        (i.media_type === targetType || i.type === targetType)
    );

    let updatedWatchlist;
    if (exists) {
      updatedWatchlist = currentList.filter(
        (i) =>
          !(
            (Number(i.id) === targetId || i.id === targetId) &&
            (i.media_type === targetType || i.type === targetType)
          )
      );
    } else {
      const entry = {
        id: targetId,
        media_type: targetType,
        title: item.title || item.name || "",
        name: item.name || item.title || "",
        poster_path: item.poster_path || "",
        backdrop_path: item.backdrop_path || "",
        vote_average: item.vote_average || 0,
        release_date: item.release_date || item.first_air_date || "",
        first_air_date: item.first_air_date || item.release_date || "",
        overview: item.overview || "",
        genre_ids: item.genre_ids || [],
        addedAt: item.addedAt || Date.now(),
      };
      updatedWatchlist = [entry, ...currentList];
    }

    user.watchlist = updatedWatchlist;
    await user.save();

    res.status(200).json({
      success: true,
      added: !exists,
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Error in toggleWatchlist controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
