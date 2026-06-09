import { useEffect, useState } from "react";
import { formatNumber } from "./animations";

export type CounterProps = {
  to: number;
  decimals: number;
  sep: "," | "." | "";
  prefix: string;
  suffix: string;
  active: boolean;
  delay: number;
  duration: number;
};

/**
 * Animates a number from 0 to `to` using requestAnimationFrame with
 * ease-out cubic. Renders `<span>{prefix}{formattedValue}{suffix}</span>`.
 */
export function Counter({
  to, decimals, sep, prefix, suffix,
  active, delay, duration,
}: CounterProps) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let timer = 0;
    const start = (t0: number) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setVal(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    timer = window.setTimeout(() => start(performance.now()), delay);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [active, to, delay, duration]);

  return (
    <span>
      {prefix}
      {formatNumber(val, decimals, sep)}
      {suffix}
    </span>
  );
}
