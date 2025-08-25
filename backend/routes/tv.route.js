import { Router } from "express";
import {
  getSimilarTvs,
  getTrendingTvShows,
  getTvDetails,
  gettvsByCategory,
  getTvTrailers,
} from "../controller/tv.control.js";
const router = Router();

router.get("/trending", getTrendingTvShows);
router.get("/:id/trailers", getTvTrailers);
router.get("/:id/details", getTvDetails);
router.get("/:id/similar", getSimilarTvs);
router.get("/:category", gettvsByCategory);

export default router;
