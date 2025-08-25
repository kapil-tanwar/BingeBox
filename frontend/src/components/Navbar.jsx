import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  LogOut, Menu, SearchIcon } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";
import instance from "../utils/axios";
import { RxCross1 } from "react-icons/rx";
import { franc } from "franc-min";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuthStore();
  const { setContentType } = useContentStore();
  const [query, setQuery] = useState("");
  const [searches, setSearches] = useState([]);
  const [clicked, setClicked] = useState(false);
  const inputContainerRef = useRef(null);

  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearch = () => setClicked(!clicked);

  const getApi = async () => {
    try {
      const res = await instance.get(`search/multi`, {
        params: {
          query: query,
        },
      });
      setSearches(res.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (query) {
      getApi();
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target)
      ) {
        setClicked(false);
      }
    };

    if (clicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clicked]);

  useEffect(() => {
    setClicked(false);
  }, [location.pathname]);

  return (
    <header className="mx-auto sm:flex block flex-wrap items-center justify-between py-8 h-20 lg:px-20 px-4 text-gray-300/80">
      <div className="flex items-center md:gap-7 gap-5 z-50 text-sm md:text-[12px] lg:text-[18px]">
        <Link to="/" className="text-2xl">
          <img src="/bingelog.png" alt="log" className="md:w-8 w-8" />
        </Link>
        <div className="hidden sm:flex gap-5 md:gap-7 items-center ">
          <Link to="/" className="hidden sm:flex items-center hover:underline">
            Home
          </Link>
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("tv")}
          >
            TV Shows
          </Link>
        </div>
      </div>

      <div className="flex gap-3 lg:gap-6 items-center justify-end sm:justify-center ">
        {clicked ? (
          <div
            ref={inputContainerRef}
            className="items-center justify-end relative md:w-[30vw] lg:w-[26vw] sm:w-[46vw] w-[75vw] mt-2"
          >
            <div className="relative">
              <div className="flex items-center bg-[#507aa7]/40 rounded-full shadow-lg overflow-hidden px-4 h-[25px] md:h-[28px] lg:h-[30px]">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  className="xl:w-[350px] md:w-[240px] w-[70vw] sm:py-4 px-2 text-[11px] xl:text-sm text-white bg-transparent focus:outline-none placeholder-slate-300"
                  placeholder="Search for movies, TV shows..."
                />
                <RxCross1
                  onClick={() => {
                    setQuery("");
                    setSearches([]);
                  }}
                  className="size-6 md:size-5 cursor-pointer text-gray/60"
                />
              </div>

              {query.length !== 0 && (
                <div className="result absolute z-50 w-full bg-[#4dbde986]/20 rounded-b-lg shadow-lg max-h-[30vh] overflow-auto mt-2">
                  {searches
                    .filter((elem) => {
                      const text =
                        elem.name || elem.original_title || elem.title;
                      const detectedLanguage = franc(text || "");
                      return detectedLanguage === "eng";
                    })
                    .map((elem, index) => {
                      if (elem.backdrop_path || elem.profile_path) {
                        return (
                          <Link
                            key={index}
                            to={`/watch/${elem.id}`}
                            className="flex items-center gap-4 p-3 hover:bg-[#4dbde998]/80 transition duration-300 backdrop-blur-3xl"
                          >
                            <img
                              className="w-12 h-12 rounded-lg object-cover"
                              src={`https://image.tmdb.org/t/p/original/${
                                elem.backdrop_path || elem.profile_path
                              }`}
                              alt={
                                elem.name || elem.original_title || elem.title
                              }
                            />
                            <span className="text-white text-[12px] md:text-[12px] lg:text-md">
                              {elem.name || elem.original_title || elem.title}
                            </span>
                          </Link>
                        );
                      }
                      return null;
                    })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <SearchIcon
            onClick={handleSearch}
            className="size-4 lg:size-6 cursor-pointer text-[#77B7FB]"
          />
        )}

       
        <LogOut
          className="size-4 lg:size-6 cursor-pointer text-[#77B7FB] sm:flex hidden"
          onClick={logout}
        />
        <div className="sm:hidden">
          <Menu
            className="size-4 text-[#77B7FB] cursor-pointer"
            onClick={toggleMobileMenu}
          />
          {isMobileMenuOpen && (
            <div className="absolute top-[70px] right-4 bg-[#1a1a1a] rounded-lg shadow-lg z-50 p flex flex-col  w-32 mt-10 text-center">
              <div className="hover:bg-gray-600/30 py-2">
                <Link
                  to="/"
                  onClick={() => {
                    toggleMobileMenu();
                    setContentType("movie");
                  }}
                >
                  Movies
                </Link>
              </div>
              <div className="hover:bg-gray-600/30 py-2">
                <Link
                  to="/"
                  onClick={() => {
                    toggleMobileMenu();
                    setContentType("tv");
                  }}
                >
                  TV Shows
                </Link>
              </div>
              <div className="hover:bg-gray-600/30 py-2">
                <Link to="/" onClick={toggleMobileMenu}>
                  Home
                </Link>
              </div>
              <div className="hover:bg-gray-600/30 py-2">
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    logout();
                  }}
                  className=" text-[#77B7FB]"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

