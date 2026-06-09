/**
 * Editor example — activate the visual editor with ?edit=1 in the URL.
 * Drag the boxes over the image, then click "Copiar JSON" and paste the
 * result back into your `elements` prop.
 */
import { ImageAnimator } from "@jrgarcia23/image-animator";

export default function EditorExample() {
  return (
    <div style={{ maxWidth: 1100, margin: "40px auto" }}>
      <ImageAnimator
        src="/dashboard.png"
        alt="Dashboard"
        // Pass storageKey to persist edits between refreshes
        storageKey="my-dashboard-editor"
        elements={[
          // Start with placeholder elements; user drags them into place
          { id: "ov1", kind: "overlay", label: "Overlay 1",
            left: 25, top: 25, right: 25, bottom: 25, delay: 0,
            animation: "wipe-right" },
          { id: "ctr1", kind: "counter", label: "Visits",
            left: 30, top: 30, right: 50, bottom: 60, delay: 200,
            value: 11337, decimals: 0, thousandsSep: ",",
            prefix: "", suffix: "",
            fontSize: 40, fontWeight: 600, color: "#15163A", align: "left",
            duration: 1600 },
        ]}
      />
    </div>
  );
}
