import { useEffect, useRef, useState } from "react";

/**
 * Adds a fade/slide-up reveal animation to a section when it scrolls into view.
 * Usage: const [ref, isIn] = useReveal();  <div ref={ref} className={`reveal ${isIn ? "in" : ""}`}>
 */
export default function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isIn];
}
