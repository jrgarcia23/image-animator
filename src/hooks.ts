import { useEffect, useRef, useState } from "react";

/**
 * Hook que detecta cuándo el elemento referenciado entra en viewport.
 * Una sola activación: una vez inView=true, ya no vuelve a false.
 */
export function useInView<T extends Element>(threshold = 0.2, enabled = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!enabled || !ref.current || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, threshold, enabled]);
  return { ref, inView };
}
