import React from "react";
import {
  User,
  Brain,
  ListTree,
  BrainCircuit,
  Wrench,
  Zap,
  Eye,
  RefreshCw,
  Flag,
  ShieldAlert,
} from "lucide-react";
import Card from "./Card.jsx";

const STAGES = [
  { key: "user", label: "USER", icon: User },
  { key: "understand", label: "GOAL INTERPRETER", icon: Brain },
  { key: "plan", label: "PLANNER", icon: ListTree },
  { key: "memory", label: "MEMORY", icon: BrainCircuit },
  { key: "tools", label: "TOOL SELECTOR", icon: Wrench },
  { key: "act", label: "ACTION EXECUTOR", icon: Zap },
  { key: "observe", label: "OBSERVATION", icon: Eye },
  { key: "adapt", label: "ADAPTATION", icon: RefreshCw },
  { key: "result", label: "RESULT", icon: Flag },
];

// Map backend stage names to a rank so we can mark nodes complete/active.
const STAGE_ORDER = ["user", "understand", "plan", "memory", "tools", "act", "observe", "adapt", "result"];

export default function AgentPipeline({ currentStage, isRunning }) {
  const activeIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;

  return (
    <Card title="Agent Architecture">
      <div className="flex flex-col items-center py-2">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === activeIndex;
          const isPast = activeIndex > i;
          const isHuman = stage.key === "act";

          return (
            <React.Fragment key={stage.key}>
              <div
                className={[
                  "flex items-center gap-3 w-full max-w-xs rounded-lg border px-4 py-2.5 transition-all duration-300",
                  isActive
                    ? "border-signal bg-signal/10 shadow-glow scale-[1.03]"
                    : isPast
                    ? "border-okgreen/30 bg-okgreen/5"
                    : "border-surface-border bg-surface-alt/40",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
                    isActive
                      ? "bg-signal text-base"
                      : isPast
                      ? "bg-okgreen/20 text-okgreen"
                      : "bg-surface-border text-ink-faint",
                  ].join(" ")}
                >
                  <Icon size={14} />
                </span>
                <span
                  className={[
                    "text-xs font-semibold tracking-wide",
                    isActive ? "text-signal" : isPast ? "text-okgreen" : "text-ink-faint",
                  ].join(" ")}
                >
                  {stage.label}
                </span>
              </div>

              {i < STAGES.length - 1 && (
                <div className="relative h-6 w-px">
                  <div className="absolute inset-0 bg-surface-border" />
                  {isRunning && isPast && (
                    <div className="absolute inset-0 bg-gradient-to-b from-signal to-transparent animate-pulseSlow" />
                  )}
                </div>
              )}

              {isHuman && i < STAGES.length - 1 && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber my-1 -mt-1">
                  <ShieldAlert size={11} />
                  HUMAN APPROVAL for sensitive actions
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}
