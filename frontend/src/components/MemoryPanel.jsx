import React from "react";
import { BrainCircuit } from "lucide-react";
import Card from "./Card.jsx";

export default function MemoryPanel({ memory }) {
  if (!memory) return null;

  return (
    <Card title="Memory" icon={<BrainCircuit size={14} className="text-signal" />}>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-1.5">
            User Preferences
          </p>
          <ul className="space-y-1">
            {memory.preferences.map((p, i) => (
              <li key={i} className="text-sm text-ink-muted flex gap-2">
                <span className="text-signal">•</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-1.5">
            Previous Progress
          </p>
          <ul className="space-y-1.5">
            {memory.previousProgress.map((p, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">{p.topic}</span>
                <span
                  className={[
                    "text-xs font-mono px-1.5 py-0.5 rounded",
                    p.value >= 80
                      ? "text-okgreen bg-okgreen/10"
                      : p.value >= 60
                      ? "text-amber bg-amber/10"
                      : "text-alert bg-alert/10",
                  ].join(" ")}
                >
                  {p.level} ({p.value}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] text-ink-faint italic pt-1 border-t border-surface-border">
          This is simulated memory for prototype demonstration purposes.
        </p>
      </div>
    </Card>
  );
}
