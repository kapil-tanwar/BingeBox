import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WatchPage from "./pages/WatchPage";
import DiscoverPage from "./pages/DiscoverPage";
import SearchPage from "./pages/SearchPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { LogoMark } from "./components/Logo";
import { useAuthStore } from "./store/authUser";
import { useWatchlistStore } from "./store/watchlist";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();
  const loadWatchlist = useWatchlistStore((s) => s.load);
  const { pathname } = useLocation();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  // Each signed-in user gets their own watchlist.
  useEffect(() => {
    loadWatchlist(user?._id || user?.id || user?.username || null);
  }, [user, loadWatchlist]);

  // Always scroll to top upon navigating to any new page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  if (isCheckingAuth) {
    return (
      <div className="grid h-screen place-items-center bg-ink" role="status" aria-label="Loading">
        <LogoMark className="fade-in size-10 animate-pulse" />
      </div>
    );
  }

  const guard = (element) => (user ? element : <Navigate to="/login" />);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/watch/:id" element={guard(<WatchPage />)} />
        <Route path="/discover" element={guard(<DiscoverPage />)} />
        <Route path="/search" element={guard(<SearchPage />)} />
        <Route path="/watchlist" element={guard(<WatchlistPage />)} />
        <Route path="/profile" element={guard(<ProfilePage />)} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgb(25 30 40)",
            color: "rgb(241 235 221)",
            border: "1px solid rgb(255 255 255 / 0.12)",
            borderRadius: 0,
            fontSize: "13px",
          },
        }}
      />
    </>
  );
}

export default App;
