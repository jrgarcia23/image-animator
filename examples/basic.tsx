/**
 * Basic example — reveal sections of a dashboard image in cascade.
 */
import { ImageAnimator } from "@jrgarcia23/image-animator";

export default function BasicExample() {
  return (
    <div style={{ maxWidth: 1100, margin: "40px auto" }}>
      <ImageAnimator
        src="/dashboard.png"
        alt="Dashboard"
        elements={[
          { id: "row1", kind: "overlay", label: "Top KPIs",
            left: 4, top: 8, right: 1, bottom: 76, delay: 0,
            animation: "wipe-right" },
          { id: "chart", kind: "overlay", label: "Center chart",
            left: 26, top: 8, right: 27, bottom: 76, delay: 400,
            animation: "wipe-right" },
          { id: "heatmap", kind: "overlay", label: "Heatmap",
            left: 4, top: 28, right: 51, bottom: 14, delay: 800,
            animation: "wipe-up" },
          { id: "hourly", kind: "overlay", label: "Hourly",
            left: 51, top: 28, right: 1, bottom: 14, delay: 1000,
            animation: "wipe-right" },
          { id: "daily", kind: "overlay", label: "Daily",
            left: 4, top: 86, right: 1, bottom: 1, delay: 1300,
            animation: "wipe-right" },
        ]}
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 12px 40px -10px rgba(15,23,42,0.15)",
        }}
      />
    </div>
  );
}
