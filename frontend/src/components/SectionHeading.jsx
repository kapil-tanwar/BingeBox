import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useReveal from "../hooks/useReveal";

const SectionHeading = ({ index, eyebrow, title, blurb, to, cta = "See all", className = "" }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div className="max-w-2xl">
        <p className="eyebrow mb-4 flex items-center gap-3">
          {index && <span className="text-mute">{index}</span>}
          {index && <span className="h-px w-8 bg-white/20" aria-hidden="true" />}
          {eyebrow}
        </p>
        <h2 className="display text-[clamp(2.2rem,5vw,4rem)]">{title}</h2>
        {blurb && <p className="mt-4 max-w-md text-[15px] text-mute">{blurb}</p>}
      </div>
      {to && (
        <Link to={to} className="btn-quiet shrink-0 self-start md:self-auto">
          {cta}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
