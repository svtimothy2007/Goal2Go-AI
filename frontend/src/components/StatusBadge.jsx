import React from "react";

const MAP = {
  running: { label: "Running", dot: "bg-signal", text: "text-signal", ring: "ring-signal/30" },
  "paused-approval": { label: "Paused — Approval Needed", dot: "bg-amber", text: "text-amber", ring: "ring-amber/30" },
  complete: { label: "Complete", dot: "bg-okgreen", text: "text-okgreen", ring: "ring-okgreen/30" },
  idle: { label: "Idle", dot: "bg-ink-faint", text: "text-ink-muted", ring: "ring-white/10" },
};

export default function StatusBadge({ status = "idle", size = "md" }) {
  const cfg = MAP[status] || MAP.idle;
  const isAnimated = status === "running" || status === "paused-approval";
  const pad = size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full ring-1 font-medium",
        pad,
        cfg.ring,
        cfg.text,
        "bg-surface-alt",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block rounded-full",
          size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2",
          cfg.dot,
          isAnimated ? "animate-pulseSlow" : "",
        ].join(" ")}
      />
      {cfg.label}
    </span>
  );
}
