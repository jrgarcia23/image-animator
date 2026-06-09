# @jrgarcia23/image-animator

Animate static images with reveal overlays and number counters. Visual drag-and-drop editor included for pixel-perfect positioning.

> Built to bring dashboard screenshots, product UIs and infographics to life on marketing pages — without rebuilding the UI in code.

## Features

- 🎬 **Reveal overlays** with 10 animation types (wipe / fade / scale / slide × 4 directions)
- 🔢 **Number counters** that count from 0 to a target value (decimals, separators, prefix/suffix)
- 🎨 **Visual editor** built-in — drag and resize each element on top of the image, copy the resulting JSON config
- ♿ **Respects `prefers-reduced-motion`**
- 📐 **0 dependencies** beyond React 18+
- 🪶 **~6 KB gzipped** (ESM + tree-shaken)
- 📐 **Pixel-precise positioning** via the editor — no more guessing percentages

## Install

```bash
npm install @jrgarcia23/image-animator
```

> This package is published on **GitHub Packages**. You'll need a `.npmrc` with the `@jrgarcia23` scope pointing to `npm.pkg.github.com`. Add this to your project:
>
> ```
> @jrgarcia23:registry=https://npm.pkg.github.com
> ```
>
> And authenticate once with a [personal access token](https://github.com/settings/tokens) with the `read:packages` scope:
>
> ```bash
> npm login --scope=@jrgarcia23 --registry=https://npm.pkg.github.com
> ```

## Quickstart

```tsx
import { ImageAnimator } from "@jrgarcia23/image-animator";

export default function MyPage() {
  return (
    <ImageAnimator
      src="/dashboard.png"
      alt="My dashboard"
      elements={[
        {
          id: "top-row",
          kind: "overlay",
          label: "Top KPI row",
          left: 4, top: 8, right: 1, bottom: 76,
          delay: 0,
          animation: "wipe-right",
        },
        {
          id: "counter-visits",
          kind: "counter",
          label: "Visits",
          left: 17, top: 13, right: 67, bottom: 80,
          delay: 200,
          value: 11337, decimals: 0, thousandsSep: ",",
          prefix: "", suffix: "",
          fontSize: 40, fontWeight: 600,
          color: "#15163A", align: "left",
          duration: 1600,
        },
      ]}
    />
  );
}
```

## The visual editor (recommended workflow)

Hand-tuning percentages is painful. Use the built-in editor:

```tsx
<ImageAnimator
  src="/dashboard.png"
  elements={initialElements}
  editable           // or activate via `?edit=1` in the URL
  storageKey="my-dashboard-overlays"
/>
```

Then:

1. Open the page in your browser (with `?edit=1` if you didn't pass `editable`)
2. Drag boxes from inside to **move**, drag the cyan/purple dots to **resize**
3. Add new elements: **+ Overlay** or **+ Counter**
4. Edit labels, delays, animation types, counter values, font sizes, etc. in the right panel
5. When happy, click **Copiar JSON**
6. Paste the JSON back into your `elements` prop
7. Remove `editable` for production

Your edits autosave to `localStorage` under `storageKey` while editing, so refreshes don't lose progress.

## API

### `<ImageAnimator />` props

| Prop          | Type                                  | Default   | Description                                                                 |
| ------------- | ------------------------------------- | --------- | --------------------------------------------------------------------------- |
| `src`         | `string`                              | —         | URL of the image to animate                                                 |
| `alt`         | `string`                              | `""`      | Image alt text                                                              |
| `elements`    | `ElementCfg[]`                        | —         | Array of overlays and counters                                              |
| `threshold`   | `number` (0-1)                        | `0.2`     | Intersection-observer threshold to trigger animations                       |
| `duration`    | `number` (ms)                         | `1600`    | Base duration for overlay animations                                        |
| `easing`      | `string` (CSS easing)                 | cubic     | Easing for overlay transitions                                              |
| `editable`    | `boolean`                             | `false`   | Activate the visual editor                                                  |
| `storageKey`  | `string`                              | —         | localStorage key to persist edits while editing                             |
| `onChange`    | `(elements: ElementCfg[]) => void`    | —         | Callback every time the user changes anything in the editor                 |
| `style`       | `CSSProperties`                       | —         | Inline styles for the wrapper                                               |
| `className`   | `string`                              | —         | Class name for the wrapper                                                  |

### `OverlayCfg`

A white box that covers a region of the image and animates **out** on scroll-in, revealing the image underneath.

```ts
type OverlayCfg = {
  id: string;
  kind: "overlay";
  label: string;
  left: number;   // % from left
  top: number;    // % from top
  right: number;  // % from right
  bottom: number; // % from bottom
  delay: number;          // ms before animating
  animation: AnimationType;
  background?: string;    // default "#fff"
};
```

### `CounterCfg`

A box with a number that animates from `0` to `value` while the underlying image number is hidden.

```ts
type CounterCfg = {
  id: string;
  kind: "counter";
  label: string;
  left: number; top: number; right: number; bottom: number;
  delay: number;          // ms before counter starts
  value: number;          // target number (e.g. 11337)
  decimals: number;       // decimals to display (0 for integers)
  thousandsSep: "," | "." | ""; // thousands separator
  prefix: string;         // text before number ("+", "$", "↑")
  suffix: string;         // text after number ("%", " visits")
  fontSize: number;       // px
  fontWeight: number;     // 400-700
  color: string;          // CSS color
  align: "left" | "center" | "right";
  duration: number;       // ms for the count animation
  background?: string;    // default "#fff"
  fontFamily?: string;    // default inherit
};
```

### `AnimationType`

```ts
type AnimationType =
  | "wipe-right" | "wipe-left" | "wipe-down" | "wipe-up"   // curtain pulled aside
  | "fade"                                                 // opacity 1 → 0
  | "scale-out"                                            // shrink to center
  | "slide-right" | "slide-left" | "slide-up" | "slide-down"; // slide out
```

## Common patterns

### KPI dashboard with cascading reveals

```tsx
<ImageAnimator
  src="/kpi-dashboard.png"
  elements={[
    // Top KPI row reveals first
    { id: "row1", kind: "overlay", label: "Row 1", left: 0, top: 0, right: 0, bottom: 70, delay: 0, animation: "wipe-right" },
    // Chart reveals next
    { id: "chart", kind: "overlay", label: "Chart", left: 0, top: 30, right: 0, bottom: 30, delay: 400, animation: "wipe-up" },
    // Bottom row last
    { id: "row2", kind: "overlay", label: "Row 2", left: 0, top: 70, right: 0, bottom: 0, delay: 800, animation: "fade" },
  ]}
/>
```

### KPI cards with animated counters

```tsx
<ImageAnimator
  src="/metrics-card.png"
  elements={[
    { id: "visits", kind: "counter", label: "Visits",
      left: 5, top: 30, right: 60, bottom: 50,
      delay: 0, value: 11337, decimals: 0, thousandsSep: ",",
      prefix: "", suffix: "",
      fontSize: 48, fontWeight: 700, color: "#15163A", align: "center",
      duration: 1500 },
    { id: "conv", kind: "counter", label: "Conversion",
      left: 55, top: 30, right: 10, bottom: 50,
      delay: 200, value: 23.4, decimals: 1, thousandsSep: ",",
      prefix: "", suffix: "%",
      fontSize: 48, fontWeight: 700, color: "#15163A", align: "center",
      duration: 1500 },
  ]}
/>
```

### Accessibility

The component respects `prefers-reduced-motion: reduce`. When that media query matches, overlays jump to their final state instantly and counters render the final value without animating.

## Development

```bash
npm install
npm run dev      # tsup --watch
npm run build    # production build
npm run typecheck
```

## License

MIT © JR García
