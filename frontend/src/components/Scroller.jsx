import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal scroller with discrete, keyboard-reachable previous/next controls. */
const Scroller = ({ children, label, className = "", trackClassName = "", bleed = "both" }) => {
  const ref = useRef(null);

  const move = (dir) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={`min-w-0 ${className}`}>
      <div className="mb-5 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label={`Scroll ${label} back`}
          className="grid size-11 place-items-center border border-white/20 text-ivory transition-colors hover:border-champagne hover:text-champagne"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label={`Scroll ${label} forward`}
          className="grid size-11 place-items-center border border-white/20 text-ivory transition-colors hover:border-champagne hover:text-champagne"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`scroller flex gap-5 overflow-x-auto pb-2 ${
          bleed === "both"
            ? "-mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14"
            : "-mr-5 pr-5 sm:-mr-8 sm:pr-8 lg:-mr-14 lg:pr-14"
        } ${trackClassName}`}
        data-bleed={bleed}
      >
        {children}
      </div>
    </div>
  );
};

export default Scroller;
