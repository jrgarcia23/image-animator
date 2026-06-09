"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ElementCfg } from "./types";
import { animationStyle } from "./animations";
import { useInView } from "./hooks";
import { Counter } from "./Counter";
import { Editor } from "./Editor";

export type ImageAnimatorProps = {
  /** URL de la imagen a animar */
  src: string;
  /** Texto alternativo */
  alt?: string;
  /** Array de overlays + counters que se aplican sobre la imagen */
  elements: ElementCfg[];
  /** Ratio de visibilidad para activar la animación (0-1). Por defecto 0.2 */
  threshold?: number;
  /** Duración base de las animaciones de overlay (ms). Por defecto 1600 */
  duration?: number;
  /** Easing CSS para los overlays. Por defecto cubic-bezier(0.65, 0, 0.35, 1) */
  easing?: string;
  /** Activa el editor visual (drag + resize + panel con form). Útil en dev */
  editable?: boolean;
  /**
   * Si `editable` está activo, persiste los cambios bajo esta clave en
   * localStorage. Si no se pasa, no persiste.
   */
  storageKey?: string;
  /** Callback cuando los elementos cambian (modo editor). */
  onChange?: (elements: ElementCfg[]) => void;
  /** Estilos del wrapper externo */
  style?: CSSProperties;
  /** ClassName del wrapper externo */
  className?: string;
};

/**
 * ImageAnimator — Component to animate static images with overlays and
 * counters. Includes a visual editor (drag + resize + form panel) for
 * pixel-precise positioning.
 *
 * Usage:
 *
 * ```tsx
 * import { ImageAnimator } from "@jrgarcia23/image-animator";
 *
 * <ImageAnimator
 *   src="/dashboard.png"
 *   alt="My dashboard"
 *   elements={[
 *     { id: "a", kind: "overlay", label: "Top row", left: 0, top: 0,
 *       right: 0, bottom: 70, delay: 0, animation: "wipe-right" },
 *     { id: "b", kind: "counter", label: "Visits", left: 10, top: 20,
 *       right: 60, bottom: 70, delay: 200, value: 11337, decimals: 0,
 *       thousandsSep: ",", prefix: "", suffix: "",
 *       fontSize: 40, fontWeight: 600, color: "#15163A",
 *       align: "left", duration: 1600 },
 *   ]}
 * />
 * ```
 *
 * For pixel-perfect positioning, pass `editable` and `storageKey`,
 * navigate with `?edit=1` in the URL (or use editable={true}), drag the
 * boxes over the image, copy the resulting JSON, and paste it back into
 * `elements`.
 */
export function ImageAnimator({
  src,
  alt = "",
  elements: initialElements,
  threshold = 0.2,
  duration = 1600,
  easing = "cubic-bezier(0.65, 0, 0.35, 1)",
  editable = false,
  storageKey,
  onChange,
  style,
  className,
}: ImageAnimatorProps) {
  const [editMode, setEditMode] = useState(editable);
  const [elements, setElements] = useState<ElementCfg[]>(initialElements);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>(threshold, !editMode);

  const setRefs = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    // useInView's ref is mutable in our hook
    (inViewRef as { current: HTMLDivElement | null }).current = node;
  };

  // Auto-edit via ?edit=1 in URL (only if a storageKey is provided)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("edit") === "1") setEditMode(true);
  }, []);

  // Load from localStorage when entering edit mode
  useEffect(() => {
    if (!editMode || !storageKey || typeof window === "undefined") return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setElements(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [editMode, storageKey]);

  // Persist + emit onChange
  useEffect(() => {
    if (editMode && storageKey && typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(elements));
    }
    onChange?.(elements);
  }, [elements, editMode, storageKey, onChange]);

  const updateElement = (id: string, patch: Partial<ElementCfg>) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } as ElementCfg : e)));
  };
  const addOverlay = () => {
    const id = `overlay-${Date.now().toString(36)}`;
    setElements((prev) => [...prev, {
      id, kind: "overlay", label: `Overlay ${prev.length + 1}`,
      left: 25, top: 25, right: 25, bottom: 25,
      delay: prev.length * 300,
      animation: "wipe-right",
    }]);
  };
  const addCounter = () => {
    const id = `counter-${Date.now().toString(36)}`;
    setElements((prev) => [...prev, {
      id, kind: "counter", label: `Contador ${prev.length + 1}`,
      left: 30, top: 30, right: 50, bottom: 60,
      delay: 200,
      value: 1000, decimals: 0, thousandsSep: ",",
      prefix: "", suffix: "",
      fontSize: 36, fontWeight: 600, color: "#15163A", align: "left",
      duration: 1600,
    }]);
  };
  const removeElement = (id: string) => setElements((prev) => prev.filter((e) => e.id !== id));

  return (
    <div
      ref={setRefs}
      className={className}
      style={{ position: "relative", ...style }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {editMode ? (
        <Editor
          elements={elements}
          onChange={updateElement}
          onAddOverlay={addOverlay}
          onAddCounter={addCounter}
          onRemove={removeElement}
          wrapperRef={wrapperRef}
          onReset={() => {
            setElements(initialElements);
            if (storageKey && typeof window !== "undefined") localStorage.removeItem(storageKey);
          }}
        />
      ) : (
        elements.map((e) =>
          e.kind === "overlay" ? (
            <div
              key={e.id}
              aria-hidden
              style={{
                position: "absolute",
                left: `${e.left}%`,
                right: `${e.right}%`,
                top: `${e.top}%`,
                bottom: `${e.bottom}%`,
                background: e.background ?? "#fff",
                ...animationStyle(e.animation, inView, e.delay, duration, easing),
              }}
            />
          ) : (
            <div
              key={e.id}
              style={{
                position: "absolute",
                left: `${e.left}%`,
                right: `${e.right}%`,
                top: `${e.top}%`,
                bottom: `${e.bottom}%`,
                background: e.background ?? "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  e.align === "left" ? "flex-start" :
                  e.align === "right" ? "flex-end" : "center",
                color: e.color,
                fontFamily: e.fontFamily ?? "inherit",
                fontSize: e.fontSize,
                fontWeight: e.fontWeight,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                pointerEvents: "none",
              }}
            >
              <Counter
                to={e.value}
                decimals={e.decimals}
                sep={e.thousandsSep}
                prefix={e.prefix}
                suffix={e.suffix}
                active={inView}
                delay={e.delay}
                duration={e.duration}
              />
            </div>
          )
        )
      )}
    </div>
  );
}
