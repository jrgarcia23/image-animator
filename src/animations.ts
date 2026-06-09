import type { AnimationType } from "./types";

/**
 * Convierte un tipo de animación + estado de visibilidad + delay en estilo
 * CSS animable. Se aplica al overlay para que pase de "tapando" → "fuera".
 */
export function animationStyle(
  anim: AnimationType,
  inView: boolean,
  delay: number,
  durationMs = 1600,
  easing = "cubic-bezier(0.65, 0, 0.35, 1)"
): React.CSSProperties {
  const t = (prop: string) => `${prop} ${durationMs}ms ${easing} ${delay}ms`;
  switch (anim) {
    case "wipe-right":
      return { clipPath: inView ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)", transition: t("clip-path") };
    case "wipe-left":
      return { clipPath: inView ? "inset(0 100% 0 0)" : "inset(0 0 0 0%)", transition: t("clip-path") };
    case "wipe-down":
      return { clipPath: inView ? "inset(100% 0 0 0)" : "inset(0 0 0 0%)", transition: t("clip-path") };
    case "wipe-up":
      return { clipPath: inView ? "inset(0 0 100% 0)" : "inset(0 0 0 0%)", transition: t("clip-path") };
    case "fade":
      return { opacity: inView ? 0 : 1, transition: t("opacity") };
    case "scale-out":
      return { transform: inView ? "scale(0)" : "scale(1)", transformOrigin: "center", transition: t("transform") };
    case "slide-right":
      return { transform: inView ? "translateX(100%)" : "translateX(0)", transition: t("transform") };
    case "slide-left":
      return { transform: inView ? "translateX(-100%)" : "translateX(0)", transition: t("transform") };
    case "slide-up":
      return { transform: inView ? "translateY(-100%)" : "translateY(0)", transition: t("transform") };
    case "slide-down":
      return { transform: inView ? "translateY(100%)" : "translateY(0)", transition: t("transform") };
  }
}

/** Formatea un número con decimales + separador de miles configurables */
export function formatNumber(v: number, decimals: number, sep: "," | "." | "") {
  const fixed = v.toFixed(decimals);
  if (!sep) return fixed;
  const [intPart, fracPart] = fixed.split(".");
  const decSep = sep === "," ? "." : ",";
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return fracPart ? `${withSep}${decSep}${fracPart}` : withSep;
}
