import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import Navbar from "../../components/Navbar";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { useContentStore } from "../../store/content";
import MovieSlider from "../../components/MovieSlider";
import { Link } from "react-router-dom";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../../utils/constants";

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);
  const [charLimit, setCharLimit] = useState(200);

  const bigImageUrl = `${ORIGINAL_IMG_BASE_URL}${trendingContent?.backdrop_path}`;

  useEffect(() => {
    const updateCharLimit = () => {
      const width = window.innerWidth;
      if (width < 640) setCharLimit(110);
      else setCharLimit(270);
    };

    updateCharLimit();
    window.addEventListener("resize", updateCharLimit);

    return () => {
      window.removeEventListener("resize", updateCharLimit);
    };
  }, []);

  if (!trendingContent)
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
      </div>
    );

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute w-full z-50">
          <Navbar />
        </div>

        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
        )}

        <img
          src={bigImageUrl}
          alt="Hero img"
          className="base absolute top-0 left-0 w-full h-full object-cover -z-50 "
          onLoad={() => {
            setImgLoading(false);
          }}
        />

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50"
          aria-hidden="true"
        />

        <div className="homeImage relative flex items-end pb-20 justify-between h-[65vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh] bg-black text-white overflow-hidden">
          <div className="absolute inset-0 h-full bg-gradient-to-r from-black/95 via-black/5 to-black/ z-0"></div>

          <div className="relative w-[90%] sm:w-[80%] lg:w-[60%] px-5 pl-8 md:pl-12 space-y-4 md:space-y-6 z-10  md:text-left sm:mb-14">
            <div>
              <h1 className="lg:text-6xl sm:text-3xl text-[18px] md:text-5xl font-bold">
                {trendingContent?.title || trendingContent?.name}
              </h1>
              <p className="mt-2 md:text-lg text-sm">
                {trendingContent?.release_date?.split("-")[0] ||
                  trendingContent?.first_air_date.split("-")[0]}{" "}
                | {trendingContent?.adult ? "18+" : "PG-13"}
              </p>
            </div>
            <p className="lg:text-lg md:text-[15px] text-[12px] text-gray-400 ">
              {trendingContent?.overview.length > charLimit
                ? trendingContent?.overview.slice(0, charLimit) + "..."
                : trendingContent?.overview}
            </p>

            <div className="flex space-x-4 lg:h-12 h-2">
              <button className="flex items-center px-2 md:px-4 py-4 lg:px-6  lg:py-3 hover:bg-[#7eb7f3] text-black font-medium rounded-3xl  bg-gray-200 md:gap-2 gap-1 text-gray-800/85">
                <Link
                  to={`/watch/${trendingContent?.id}`}
                  className="flex items-center  rounded-3xl  md:gap-2 gap-1"
                >
                  <Play className="md:size-4 size-3 text-gray-800/85" />
                  <h2 className="lg:font-semibold  font-medium md:text-[15px] lg:text-[17px] text-[10px] sm:text-[12px] hover:text-gray-800/85">
                    {" "}
                    Watch Movie
                  </h2>
                </Link>
              </button>
              <button className="flex items-center px-2 md:px-4 py-4 lg:px-6  lg:py-3 border border-gray-400 hover:border-[#77B7FB] text-gray-400 font-semibold rounded-3xl  hover:text-[#77B7FB] md:gap-2 gap-1 justify-center">
                <Link
                  to={`/watch/${trendingContent?.id}`}
                  className="flex items-center  rounded-3xl   md:gap-2 gap-1"
                >
                  <h2 className="lg:font-semibold  font-medium md:text-[15px] lg:text-[17px] text-[10px] sm:text-[12px]">
                    More Info
                  </h2>
                  <ArrowRight className="size-4" />
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10 ">
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
      </div>
    </div>
  );
};

export default HomeScreen;
