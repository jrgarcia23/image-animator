"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { AnimationType, ElementCfg } from "./types";
import { ANIM_LABELS } from "./types";
import { formatNumber } from "./animations";

type EditorProps = {
  elements: ElementCfg[];
  onChange: (id: string, patch: Partial<ElementCfg>) => void;
  onAddOverlay: () => void;
  onAddCounter: () => void;
  onRemove: (id: string) => void;
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  onReset: () => void;
};

export function Editor({
  elements, onChange, onAddOverlay, onAddCounter, onRemove,
  wrapperRef, onReset,
}: EditorProps) {
  const [selected, setSelected] = useState<string>(elements[0]?.id || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const json = JSON.stringify(
      elements.map((e) => ({
        ...e,
        left: round(e.left, 2),
        top: round(e.top, 2),
        right: round(e.right, 2),
        bottom: round(e.bottom, 2),
      })),
      null,
      2
    );
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      {elements.map((e) => (
        <EditableBox
          key={e.id}
          element={e}
          isSelected={selected === e.id}
          onSelect={() => setSelected(e.id)}
          onChange={(patch) => onChange(e.id, patch)}
          wrapperRef={wrapperRef}
        />
      ))}

      <div style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong style={{ fontFamily: "sans-serif", fontSize: 13 }}>🎯 Editor</strong>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onAddOverlay} style={btnPrimary}>+ Overlay</button>
            <button onClick={onAddCounter} style={{ ...btnPrimary, background: "#A78BFA" }}>+ Contador</button>
            <button
              onClick={handleCopy}
              style={{ ...btnPrimary, background: copied ? "#10B981" : "#31b1f8" }}
            >
              {copied ? "✓ Copiado" : "Copiar JSON"}
            </button>
          </div>
        </div>

        {elements.length === 0 && (
          <div style={{ padding: 12, opacity: 0.6, fontFamily: "sans-serif", textAlign: "center" }}>
            No hay elementos. Añade un Overlay o Contador.
          </div>
        )}

        {elements.map((e) => (
          <ElementRow
            key={e.id}
            e={e}
            selected={selected === e.id}
            onSelect={() => setSelected(e.id)}
            onChange={(patch) => onChange(e.id, patch)}
            onRemove={() => onRemove(e.id)}
          />
        ))}

        <button onClick={onReset} style={{ ...btnSecondary, width: "100%", marginTop: 4 }}>
          ↺ Reset
        </button>
      </div>
    </>
  );
}

function ElementRow({
  e, selected, onSelect, onChange, onRemove,
}: {
  e: ElementCfg;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ElementCfg>) => void;
  onRemove: () => void;
}) {
  const isCounter = e.kind === "counter";
  const themeColor = isCounter ? "#A78BFA" : "#31b1f8";
  const themeBg = isCounter ? "rgba(167,139,250,0.18)" : "rgba(49,177,248,0.18)";

  return (
    <div
      onClick={onSelect}
      style={{
        padding: 10, marginBottom: 6,
        borderRadius: 6,
        background: selected ? themeBg : "rgba(255,255,255,0.04)",
        border: selected ? `1px solid ${themeColor}` : "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
        <span style={{
          fontSize: 10, opacity: 0.7, fontFamily: "sans-serif",
          padding: "2px 6px",
          background: isCounter ? "rgba(167,139,250,0.25)" : "rgba(49,177,248,0.25)",
          borderRadius: 3,
        }}>
          {isCounter ? "🔢 Cont" : "🔲 Over"}
        </span>
        <input
          value={e.label}
          onChange={(ev) => onChange({ label: ev.target.value })}
          onClick={(ev) => ev.stopPropagation()}
          style={{
            flex: 1, background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff", padding: "4px 8px",
            borderRadius: 4, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600,
          }}
        />
        <button
          onClick={(ev) => { ev.stopPropagation(); onRemove(); }}
          style={{ ...btnSecondary, color: "#FCA5A5", border: "1px solid rgba(252,165,165,0.25)" }}
        >🗑</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <label style={fieldLabel}>
          <span style={fieldSpan}>delay (ms)</span>
          <input
            type="number" value={e.delay} step={100}
            onChange={(ev) => onChange({ delay: Number(ev.target.value) || 0 })}
            onClick={(ev) => ev.stopPropagation()}
            style={fieldInput}
          />
        </label>

        {e.kind === "overlay" ? (
          <label style={fieldLabel}>
            <span style={fieldSpan}>animación</span>
            <select
              value={e.animation}
              onChange={(ev) => onChange({ animation: ev.target.value as AnimationType })}
              onClick={(ev) => ev.stopPropagation()}
              style={fieldInput}
            >
              {(Object.keys(ANIM_LABELS) as AnimationType[]).map((a) => (
                <option key={a} value={a}>{ANIM_LABELS[a]}</option>
              ))}
            </select>
          </label>
        ) : (
          <label style={fieldLabel}>
            <span style={fieldSpan}>duración (ms)</span>
            <input
              type="number" value={e.duration} step={100}
              onChange={(ev) => onChange({ duration: Number(ev.target.value) || 0 })}
              onClick={(ev) => ev.stopPropagation()}
              style={fieldInput}
            />
          </label>
        )}
      </div>

      {e.kind === "counter" && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <label style={fieldLabel}>
              <span style={fieldSpan}>valor final</span>
              <input
                type="number" value={e.value} step={1}
                onChange={(ev) => onChange({ value: Number(ev.target.value) || 0 })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              />
            </label>
            <label style={fieldLabel}>
              <span style={fieldSpan}>decimales</span>
              <input
                type="number" value={e.decimals} step={1} min={0} max={4}
                onChange={(ev) => onChange({ decimals: Number(ev.target.value) || 0 })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              />
            </label>
            <label style={fieldLabel}>
              <span style={fieldSpan}>sep miles</span>
              <select
                value={e.thousandsSep}
                onChange={(ev) => onChange({ thousandsSep: ev.target.value as "," | "." | "" })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              >
                <option value=",">,</option>
                <option value=".">.</option>
                <option value="">sin</option>
              </select>
            </label>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <label style={fieldLabel}>
              <span style={fieldSpan}>prefijo</span>
              <input
                value={e.prefix} placeholder="+ ↑ $"
                onChange={(ev) => onChange({ prefix: ev.target.value })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              />
            </label>
            <label style={fieldLabel}>
              <span style={fieldSpan}>sufijo</span>
              <input
                value={e.suffix} placeholder="% h €"
                onChange={(ev) => onChange({ suffix: ev.target.value })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <label style={fieldLabel}>
              <span style={fieldSpan}>font size</span>
              <input
                type="number" value={e.fontSize} step={2} min={10} max={120}
                onChange={(ev) => onChange({ fontSize: Number(ev.target.value) || 36 })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              />
            </label>
            <label style={fieldLabel}>
              <span style={fieldSpan}>peso</span>
              <select
                value={e.fontWeight}
                onChange={(ev) => onChange({ fontWeight: Number(ev.target.value) })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              >
                <option value={400}>400</option>
                <option value={500}>500</option>
                <option value={600}>600</option>
                <option value={700}>700</option>
              </select>
            </label>
            <label style={fieldLabel}>
              <span style={fieldSpan}>alineación</span>
              <select
                value={e.align}
                onChange={(ev) => onChange({ align: ev.target.value as "left" | "center" | "right" })}
                onClick={(ev) => ev.stopPropagation()}
                style={fieldInput}
              >
                <option value="left">izq</option>
                <option value="center">centro</option>
                <option value="right">der</option>
              </select>
            </label>
          </div>
          <label style={{ ...fieldLabel, marginBottom: 6 }}>
            <span style={fieldSpan}>color (hex)</span>
            <input
              value={e.color}
              onChange={(ev) => onChange({ color: ev.target.value })}
              onClick={(ev) => ev.stopPropagation()}
              style={fieldInput}
            />
          </label>
        </>
      )}

      <div style={{ opacity: 0.7, fontSize: 11 }}>
        L:{e.left.toFixed(2)}% · T:{e.top.toFixed(2)}% · R:{e.right.toFixed(2)}% · B:{e.bottom.toFixed(2)}%
      </div>
    </div>
  );
}

type DragMode = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function EditableBox({
  element: e, isSelected, onSelect, onChange, wrapperRef,
}: {
  element: ElementCfg;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ElementCfg>) => void;
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const startRef = useRef<{ x: number; y: number; o: ElementCfg; mode: DragMode; W: number; H: number } | null>(null);
  const themeColor = e.kind === "counter" ? "#A78BFA" : "#31b1f8";

  const beginDrag = (ev: React.PointerEvent, mode: DragMode) => {
    ev.stopPropagation();
    ev.preventDefault();
    onSelect();
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    startRef.current = {
      x: ev.clientX, y: ev.clientY,
      o: { ...e } as ElementCfg, mode,
      W: rect.width, H: rect.height,
    };
    (ev.target as Element).setPointerCapture(ev.pointerId);
  };

  const onMove = (ev: React.PointerEvent) => {
    if (!startRef.current) return;
    const { x, y, o, mode, W, H } = startRef.current;
    const dxPct = ((ev.clientX - x) / W) * 100;
    const dyPct = ((ev.clientY - y) / H) * 100;
    const patch: Partial<ElementCfg> = {};
    if (mode === "move") {
      patch.left = clamp(o.left + dxPct);
      patch.right = clamp(o.right - dxPct);
      patch.top = clamp(o.top + dyPct);
      patch.bottom = clamp(o.bottom - dyPct);
    } else {
      if (mode.includes("n")) patch.top = clamp(o.top + dyPct);
      if (mode.includes("s")) patch.bottom = clamp(o.bottom - dyPct);
      if (mode.includes("w")) patch.left = clamp(o.left + dxPct);
      if (mode.includes("e")) patch.right = clamp(o.right - dxPct);
    }
    onChange(patch);
  };

  const endDrag = (ev: React.PointerEvent) => {
    if (!startRef.current) return;
    startRef.current = null;
    try { (ev.target as Element).releasePointerCapture(ev.pointerId); } catch {}
  };

  const handle = (mode: DragMode, style: CSSProperties) => (
    <div
      onPointerDown={(ev) => beginDrag(ev, mode)}
      style={{
        position: "absolute",
        width: 10, height: 10,
        background: themeColor,
        border: "2px solid #fff",
        borderRadius: "50%",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
        cursor: `${mode}-resize`,
        ...style,
      }}
    />
  );

  const tooltip = e.kind === "counter"
    ? `${e.label} · → ${formatNumber(e.value, e.decimals, e.thousandsSep)}${e.suffix} · ${e.delay}ms`
    : `${e.label} · ${ANIM_LABELS[e.animation]} · ${e.delay}ms`;

  return (
    <div
      onPointerDown={(ev) => beginDrag(ev, "move")}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        position: "absolute",
        left: `${e.left}%`, top: `${e.top}%`,
        right: `${e.right}%`, bottom: `${e.bottom}%`,
        background: isSelected
          ? (e.kind === "counter" ? "rgba(167,139,250,0.20)" : "rgba(49,177,248,0.18)")
          : (e.kind === "counter" ? "rgba(167,139,250,0.08)" : "rgba(49,177,248,0.08)"),
        border: `2px solid ${isSelected ? themeColor : `${themeColor}88`}`,
        cursor: "move",
        boxSizing: "border-box",
      }}
    >
      <div style={{
        position: "absolute",
        top: -22, left: 0,
        background: isSelected ? themeColor : `${themeColor}b3`,
        color: "#fff", fontSize: 11, fontWeight: 600,
        padding: "2px 8px", borderRadius: 4,
        whiteSpace: "nowrap",
        fontFamily: "sans-serif",
        pointerEvents: "none",
      }}>{tooltip}</div>

      {/* In edit mode, Counter boxes render the FINAL value with their real
          styles (fontSize, fontWeight, color, align) over a white bg so the
          user can compare the rendered number against the underlying image
          and tweak the font without leaving edit mode. */}
      {e.kind === "counter" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
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
            outline: `1px dashed ${themeColor}66`,
            outlineOffset: -1,
          }}
        >
          {e.prefix}{formatNumber(e.value, e.decimals, e.thousandsSep)}{e.suffix}
        </div>
      )}

      {handle("nw", { left: -6, top: -6 })}
      {handle("n",  { left: "50%", top: -6, transform: "translateX(-50%)" })}
      {handle("ne", { right: -6, top: -6 })}
      {handle("e",  { right: -6, top: "50%", transform: "translateY(-50%)" })}
      {handle("se", { right: -6, bottom: -6 })}
      {handle("s",  { left: "50%", bottom: -6, transform: "translateX(-50%)" })}
      {handle("sw", { left: -6, bottom: -6 })}
      {handle("w",  { left: -6, top: "50%", transform: "translateY(-50%)" })}
    </div>
  );
}

const panelStyle: CSSProperties = {
  position: "fixed",
  right: 24, bottom: 24,
  width: 440, maxHeight: "85vh", overflow: "auto",
  background: "#0F172A", color: "#fff",
  borderRadius: 12, padding: 16,
  boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5)",
  zIndex: 9999,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 12,
};

const btnPrimary: CSSProperties = {
  background: "#31b1f8", color: "#fff", border: "none",
  padding: "6px 10px", borderRadius: 6,
  cursor: "pointer", fontSize: 11, fontWeight: 600,
  fontFamily: "sans-serif",
};
const btnSecondary: CSSProperties = {
  background: "transparent", color: "#94A3B8",
  border: "1px solid #334155",
  padding: "6px 12px", borderRadius: 6,
  cursor: "pointer", fontSize: 12,
  fontFamily: "sans-serif",
};
const fieldLabel: CSSProperties = {
  display: "flex", flexDirection: "column", gap: 2, flex: 1,
};
const fieldSpan: CSSProperties = {
  opacity: 0.6, fontFamily: "sans-serif", fontSize: 10,
};
const fieldInput: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", padding: "4px 8px",
  borderRadius: 4, fontFamily: "sans-serif", fontSize: 11,
  width: "100%",
};

function round(n: number, d: number) {
  const m = Math.pow(10, d);
  return Math.round(n * m) / m;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
