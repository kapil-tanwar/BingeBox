import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Shell from "../components/Shell";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";
import { useWatchlistStore } from "../store/watchlist";

const ProfilePage = () => {
  const { user, logout, isLoggingOut } = useAuthStore();
  const { contentType, setContentType } = useContentStore();
  const items = useWatchlistStore((s) => s.items);
  const films = items.filter((i) => i.media_type === "movie").length;
  const series = items.length - films;

  return (
    <Shell>
      <div className="page-enter frame pb-10 pt-14 sm:pt-20">
        <p className="eyebrow mb-8">Profile</p>
        <div className="flex items-center gap-6 sm:gap-8">
          <span
            aria-hidden="true"
            className="grid size-24 shrink-0 place-items-center rounded-full border border-champagne/60 font-display text-6xl text-champagne sm:size-32 sm:text-7xl"
          >
            {(user?.username || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="display break-words text-[clamp(2.6rem,7vw,6rem)]">{user?.username}</h1>
            <p className="mt-2 truncate text-mute">{user?.email}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <section aria-label="Your shelf">
            <p className="label mb-5">Your shelf</p>
            <dl className="grid grid-cols-2 border-y border-white/10">
              <div className="border-r border-white/10 py-6 pr-6">
                <dt className="label">Films saved</dt>
                <dd className="mt-2 font-display text-6xl">{films}</dd>
              </div>
              <div className="py-6 pl-6">
                <dt className="label">Series saved</dt>
                <dd className="mt-2 font-display text-6xl">{series}</dd>
              </div>
            </dl>
            <Link to="/watchlist" className="btn-ghost mt-6">Open watchlist</Link>
          </section>

          <section aria-label="Preferences">
            <p className="label mb-5">Preferences</p>
            <div className="border-y border-white/10 py-6">
              <p className="font-display text-2xl">Home programme</p>
              <p className="mt-1 text-sm text-mute">Choose what the home page curates for you.</p>
              <div role="group" aria-label="Home programme" className="mt-5 flex gap-2">
                <button type="button" className="chip" aria-pressed={contentType === "movie"} onClick={() => setContentType("movie")}>Films</button>
                <button type="button" className="chip" aria-pressed={contentType === "tv"} onClick={() => setContentType("tv")}>Series</button>
              </div>
            </div>
            <button type="button" onClick={logout} disabled={isLoggingOut} className="btn-ghost mt-6">
              <LogOut className="size-4" /> {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </section>
        </div>
      </div>
    </Shell>
  );
};

export default ProfilePage;
