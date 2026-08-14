import React from "react";
import { useAgent } from "../context/AgentContext.jsx";

/**
 * Card — the base surface unit used across the dashboard.
 * Theme-aware: swaps dark "control room" surfaces for a light paper surface.
 */
export default function Card({ title, icon, right, className = "", children, dense }) {
  const { theme } = useAgent();
  const isLight = theme === "light";

  return (
    <section
      className={[
        "rounded-xl border shadow-card",
        isLight
          ? "bg-paper-panel border-paper-border"
          : "bg-surface border-surface-border",
        dense ? "p-4" : "p-5",
        className,
      ].join(" ")}
    >
      {(title || right) && (
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            {icon}
            {title && (
              <h3
                className={[
                  "text-[13px] font-semibold tracking-wide uppercase",
                  isLight ? "text-paper-ink/70" : "text-ink-muted",
                ].join(" ")}
              >
                {title}
              </h3>
            )}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
