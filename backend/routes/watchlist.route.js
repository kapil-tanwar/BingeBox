import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getWatchlist,
  toggleWatchlist,
} from "../controller/watchlist.control.js";

const router = express.Router();

router.get("/", protectRoute, getWatchlist);
router.post("/toggle", protectRoute, toggleWatchlist);

export default router;
