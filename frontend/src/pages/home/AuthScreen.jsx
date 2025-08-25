import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/signup?email=" + email);
  };
  return (
    <div>
      <div className=" min-w-screen hero-bg relative bg-gray-500 pb-64">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/50 z-0"></div>

        <header className="w-full md:px-16 px-8 md:py-8 py-5 mx-auto flex items-center justify-between  relative z-10">
          <Link to={"/"} className="flex items-center space-x-2 ">
            <img src="bingelog.png" alt="logo" className="md:w-12 w-8" />
            <h2 className="text-[#77B7FB] text-2xl font-bold hidden sm:block">
              BingeBox
            </h2>
          </Link>
          <Link to={"/login"}>
            <button className="text-white bg-[#6199d5]/80 hover:bg-[#77B7FB]/90 focus:ring-4 focus:outline-none focus:ring-[#77B7FB]/50 font-medium rounded-lg text-[12px] px-2 py-1 sm:text-[14px] sm:px-3 sm:py-1 md:text-sm md:px-5 md:py-2.5 text-center">
              Sign In
            </button>
          </Link>
        </header>

        <div className="flex  items-center mt-20 mx-3 relative z-10 flex-col top-8">
          <div className=" mb-10">
            <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold mb-4 text-center text-white/70 ">
              Igniting Your Passiom for Movies,
              <br /> Unleashing Wonder!
            </h1>
            <h3 className="text-sm md:text-1xl text-center text-white/80 ">
              Welcome to BingeBox, where the silver screen comes alive, offering
              a captivating web <br /> app experience that fuels your love for
              movies
            </h3>
          </div>

          <form
            className="flex flex-col md:flex-row  gap-4 w-4/5 md:w-1/2 items-center "
            onSubmit={handleFormSubmit}
          >
            <input
              type="email"
              placeholder="Email address ..."
              className="px-5 md:py-2 py-2 flex-1 w-4/5 text-gray-100/65 bg-black/80 border border-gray-700 rounded-xl "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-[#77B7FB]/80 sm:px-2 lg:px-4 sm:py-2 px-[4px] py-[2px]  md:py-1  flex justify-center items-center rounded-xl">
              <h3 className="text-[13px] md:text-sm">Get Started</h3>
              <ChevronRight className=" md:size-8 " />
            </button>
          </form>
        </div>
      </div>

      <div className="h-2 w-full bg-[#232323]" aria-hidden="true" />

      <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2">
          <div className="flex-1 text-center md:text-left px-12 md:px-6 lg-0">
            <h2 className="sm:text-4xl text-2xl md:text-5xl font-extrabold mb-4 text-[#6199d5]">
              Watch everywhere
            </h2>
            <p className="sm:text-md text-sm md:text-lg lg:text-xl">
              Stream unlimited movies and TV shows on your phone, tablet,
              laptop, and TV.
            </p>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <img
              src="/device-pile.png"
              alt="Device image"
              className="mt-4 z-20 relative"
            />
            <video
              className="absolute top-2 left-1/2 -translate-x-1/2  h-4/6 z-10
               max-w-[63%] 
              "
              playsInline
              autoPlay={true}
              muted
              loop
            >
              <source src="/video-devices.m4v" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
      <div className="h-2 w-full bg-[#232323]" aria-hidden="true" />

      <div className="py-10 bg-black text-white">
        <div
          className="flex max-w-6xl mx-auto items-center justify-center flex-col-reverse md:flex-row
           px-4 md:px-2
        "
        >
          <div className="flex-1 relative">
            <img src="/kids.png" alt="Enjoy on your TV" className="mt-4" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="sm:text-4xl text-2xl md:text-5xl font-extrabold mb-4 text-[#6199d5]">
              Create profiles for kids
            </h2>
            <p className="sm:text-md text-sm md:text-lg lg:text-xl">
              Send kids on adventures with their favorite characters in a space
              made just for them—free with your membership.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
