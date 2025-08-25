import { ChevronLeft, ChevronRight } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { useContentStore } from "../store/content";
import ReactPlayer from "react-player";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

function formatReleaseDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();

  const sliderRef = useRef(null);

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await api.get(`/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };

    getTrailers();
  }, [contentType, id]);

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await api.get(`/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
      }
    };

    getSimilarContent();
  }, [contentType, id]);

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await api.get(`/${contentType}/${id}/details`);

        setContent(res.data.details);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getContentDetails();
  }, [contentType, id]);

  const handleNext = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1);
  };
  const handlePrev = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
  };

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white w-full">
      <div className="mb-7">
        <Navbar />
      </div>
      <div className="mx-auto container px-4 py-8 h-full w-full">
        {trailers.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`
							bg-[#77B7FB]/80 hover:bg-[#77B7FB]/50 text-white py-2 px-4 rounded ${
                currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed " : ""
              }}
							`}
              disabled={currentTrailerIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`
							bg-[#77B7FB]/80 hover:bg-[#77B7FB]/50 text-white py-2 px-4 rounded ${
                currentTrailerIdx === trailers.length - 1
                  ? "opacity-50 cursor-not-allowed "
                  : ""
              }}
							`}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32 ">
          {trailers.length > 0 && (
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"70vh"}
              className="mx-auto overflow-hidden rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
            />
          )}

          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold text-[#77B7FB]">
                {content?.title || content?.name}
              </span>{" "}
            </h2>
          )}
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto"
        >
          <div className="mb-4 md:mb-0">
            <h2 className="sm:text-5xl text-4xl font-bold text-balance text-[#5c9ee5]">
              {content?.title || content?.name || content?.original_title}
            </h2>

            <p className="mt-2 text-sm sm:text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-[#77B7FB]">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}{" "}
            </p>
            <p className="mt-4 text-sm sm:text-lg">{content?.overview}</p>
          </div>

          <div className="mx-auto  w-68 relative bg-blue">
            <div className="w-full h-full bg-black/25  absolute rounded-md "></div>
            <img
              src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
              alt="Poster image"
              className="max-h-[600px] rounded-md"
            />
          </div>
        </div>

        {similarContent.length > 0 && (
          <div className="mt-12  mx-auto relative ">
            <h3 className="text-3xl font-bold mb-4 text-[#5c9ee5]">
              Similar Movies/Tv Show
            </h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group  py-12 "
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className="w-52  flex-none hover:scale-105 bg-black  transition-transform duration-300 ease-in-out"
                  >
                    <div className="rounded-lg overflow-hidden relative w-max">
                      <img
                        src={SMALL_IMG_BASE_URL + content.poster_path}
                        alt="Poster path"
                        className="sm:w-full w-[180px] h-[250px] sm:h-[300px] rounded-md hover:scale-110 transition-transform duration-300 ease-in-out"
                      />
                      <div className="absolute inset-0  bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                    <h4 className="mt-2 text-sm sm:text-lg font-semibold text-[#87b0db] text-center">
                      {content.title || content.name}
                    </h4>
                  </Link>
                );
              })}

              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-[#3c72ab] text-white rounded-full"
                onClick={scrollRight}
              />
              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-[#3c72ab] 
								text-white rounded-full"
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default WatchPage;
