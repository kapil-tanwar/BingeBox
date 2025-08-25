import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ email, password });
  };

  return (
    <div className="h-screen w-screen hero-bg relative bg-gray-500">
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/50 z-0"></div>

      <header className="w-full md:px-16 px-8 md:py-8 py-5 mx-auto flex items-center justify-between relative z-10">
        <Link to={"/"} className="flex items-center space-x-2">
          <img src="bingelog.png" alt="logo" className="md:w-12 w-8" />
          <h2 className="text-[#77B7FB] md:text-2xl text-[20px] font-bold hidden sm:block">
            BingeBox
          </h2>
        </Link>
      </header>

      <div className="flex justify-center items-center mt-20 mx-3 relative z-10 flex-col -top-10">
        <div className=" mb-10 ">
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold mb-3 text-center text-white/70 ">
            Unlock a world of endless entertainment
          </h1>
          <h3 className="md:text-1xl text-sm text-center text-white/80 ">
            Log In for a personalized experience
          </h3>
        </div>
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
          <h1 className="text-center text-[#77B7FB] text-2xl font-bold mb-4">
            Log In
          </h1>

          <form className="space-y-4 " onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="xyz@example.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="********"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full py-2 bg-[#77B7FB] text-white font-semibold rounded-md hover:bg-[#77B7FB]/80">
              Log In
            </button>
          </form>
          <div className="text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to={"/signup"} className="text-[#77B7FB] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
