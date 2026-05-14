// Returns a ref + inView boolean from IntersectionObserver — perfect for triggering Framer Motion animations once a section enters the viewport.
import { useEffect, useRef, useState } from "react";

const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Trigger only once unless { once: false } is explicitly passed
          if (options.once !== false) observer.unobserve(el);
        } else if (options.once === false) {
          setInView(false);
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? "0px 0px -50px 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.once, options.threshold, options.rootMargin]);

  return { ref, inView };
};

export default useScrollAnimation;
