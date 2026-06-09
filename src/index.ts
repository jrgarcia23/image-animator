// Componente principal
export { ImageAnimator } from "./ImageAnimator";
export type { ImageAnimatorProps } from "./ImageAnimator";

// Componente Counter standalone (por si alguien quiere usarlo aparte)
export { Counter } from "./Counter";
export type { CounterProps } from "./Counter";

// Editor (por si alguien quiere montar su propio wrapper)
export { Editor } from "./Editor";

// Tipos públicos
export type {
  ElementCfg,
  OverlayCfg,
  CounterCfg,
  AnimationType,
  BaseCfg,
} from "./types";

export { ANIM_LABELS } from "./types";

// Utilidades reutilizables
export { animationStyle, formatNumber } from "./animations";
export { useInView } from "./hooks";
