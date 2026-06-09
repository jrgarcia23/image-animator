/**
 * Tipos del image-animator.
 */

export type AnimationType =
  | "wipe-right"   // cortina se descorre de izq → der
  | "wipe-left"    // cortina se descorre de der → izq
  | "wipe-down"    // cortina se descorre de arriba → abajo
  | "wipe-up"      // cortina se descorre de abajo → arriba
  | "fade"         // fade out (opacity 1 → 0)
  | "scale-out"    // encoge desde el centro
  | "slide-right"  // sale por la derecha
  | "slide-left"   // sale por la izquierda
  | "slide-up"     // sale por arriba
  | "slide-down";  // sale por abajo

/** Posición y tiempos comunes a todos los elementos */
export type BaseCfg = {
  /** Identificador único */
  id: string;
  /** Nombre descriptivo (para el editor) */
  label: string;
  /** Distancia desde el borde izquierdo del wrapper en % (0-100) */
  left: number;
  /** Distancia desde el borde superior en % */
  top: number;
  /** Distancia desde el borde derecho en % */
  right: number;
  /** Distancia desde el borde inferior en % */
  bottom: number;
  /** Milisegundos a esperar tras entrar en viewport antes de animar */
  delay: number;
};

/**
 * Overlay: caja del color de fondo (white por defecto) que TAPA una zona
 * de la imagen al inicio y se descorre/desvanece para revelar lo de debajo.
 */
export type OverlayCfg = BaseCfg & {
  kind: "overlay";
  /** Tipo de animación de salida */
  animation: AnimationType;
  /** Color de fondo del overlay. Por defecto "#fff" */
  background?: string;
};

/**
 * Counter: caja con un número que cuenta de 0 al valor final con
 * requestAnimationFrame + ease-out cubic. Tapa el número original de
 * la imagen y lo sustituye por la versión animada.
 */
export type CounterCfg = BaseCfg & {
  kind: "counter";
  /** Valor final del contador (ej. 11337) */
  value: number;
  /** Decimales a mostrar (0 para enteros) */
  decimals: number;
  /** Separador de miles. "" para no usar */
  thousandsSep: "," | "." | "";
  /** Texto antes del número (ej. "+", "$") */
  prefix: string;
  /** Texto después del número (ej. "%", " visitas") */
  suffix: string;
  /** Font-size en px */
  fontSize: number;
  /** Peso de la fuente (400-700) */
  fontWeight: number;
  /** Color del texto (hex / rgb / var) */
  color: string;
  /** Alineación horizontal del número dentro de la caja */
  align: "left" | "center" | "right";
  /** Milisegundos que dura la animación del contador */
  duration: number;
  /** Color de fondo del counter. Por defecto "#fff" */
  background?: string;
  /** Familia tipográfica. Por defecto inherit */
  fontFamily?: string;
};

/** Unión: cualquier elemento configurable */
export type ElementCfg = OverlayCfg | CounterCfg;

/** Etiquetas legibles para cada tipo de animación */
export const ANIM_LABELS: Record<AnimationType, string> = {
  "wipe-right":  "Cortina → der",
  "wipe-left":   "Cortina → izq",
  "wipe-down":   "Cortina ↓",
  "wipe-up":     "Cortina ↑",
  "fade":        "Fade out",
  "scale-out":   "Encoge al centro",
  "slide-right": "Sale por la der",
  "slide-left":  "Sale por la izq",
  "slide-up":    "Sale por arriba",
  "slide-down":  "Sale por abajo",
};
