import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";

/**
 * Initialises Locomotive Scroll on the given container ref.
 * Destroys the instance on unmount / route change.
 */
const useSmoothScroll = () => {
  const scrollRef = useRef(null);
  const locoRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    // Small delay so the DOM is fully painted before init
    const timer = setTimeout(() => {
      locoRef.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.07,
        multiplier: 0.9,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      locoRef.current?.destroy();
      locoRef.current = null;
    };
  }, []);

  return { scrollRef, locoInstance: locoRef };
};

export default useSmoothScroll;
