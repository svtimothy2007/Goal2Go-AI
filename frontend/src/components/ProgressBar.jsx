import React from "react";

export default function ProgressBar({ value = 0, label, large = false }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs text-ink-muted">{label}</span>
          <span className={large ? "text-xl font-semibold text-signal" : "text-xs font-semibold text-signal"}>
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={[
          "w-full rounded-full bg-surface-alt overflow-hidden",
          large ? "h-3.5" : "h-2",
        ].join(" ")}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-signal-dim to-signal transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
