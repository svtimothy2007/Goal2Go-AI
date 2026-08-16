import React from "react";
import { Check, Loader2 } from "lucide-react";
import { useAgent } from "../context/AgentContext.jsx";
import StatusBadge from "./StatusBadge.jsx";
import ProgressBar from "./ProgressBar.jsx";
import ApprovalPanel from "./ApprovalPanel.jsx";

const FLOW = [
  { key: "understand", label: "GOAL" },
  { key: "plan", label: "PLAN" },
  { key: "act", label: "ACT" },
  { key: "observe", label: "OBSERVE" },
  { key: "adapt", label: "ADAPT" },
  { key: "result", label: "RESULT" },
];

export default function PresentationView() {
  const { state, approveAction, startDemo, actionBusy } = useAgent();

  const activeIndex = state ? FLOW.findIndex((f) => f.key === state.stage) : -1;
  const currentTask = state?.tasks?.[state.currentTaskIndex];
  const lastLog = state?.activityLog?.[state.activityLog.length - 1];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-10">
      <p className="text-signal text-sm tracking-[0.3em] uppercase font-semibold mb-3">
        Goal2Go AI — Autonomous Agent
      </p>

      {!state && (
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-ink mb-6">
            Ready to demonstrate autonomy
          </h1>
          <button
            onClick={startDemo}
            className="bg-signal text-base font-semibold text-lg px-8 py-4 rounded-xl shadow-glow hover:bg-signal-glow transition-colors"
          >
            Start Demo
          </button>
        </div>
      )}

      {state && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-center mb-6">
            <StatusBadge status={state.status} size="lg" />
          </div>

          {/* Big flowchart */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {FLOW.map((f, i) => {
              const isActive = i === activeIndex;
              const isPast = activeIndex > i;
              return (
                <React.Fragment key={f.key}>
                  <div
                    className={[
                      "px-5 py-4 sm:px-7 sm:py-5 rounded-2xl border-2 font-bold text-lg sm:text-2xl tracking-wide transition-all duration-300",
                      isActive
                        ? "border-signal bg-signal/15 text-signal scale-110 shadow-glow"
                        : isPast
                        ? "border-okgreen/40 bg-okgreen/10 text-okgreen"
                        : "border-surface-border text-ink-faint",
                    ].join(" ")}
                  >
                    {f.label}
                  </div>
                  {i < FLOW.length - 1 && (
                    <span className="text-ink-faint text-2xl">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <ProgressBar value={state.progress} label="Overall progress" large />
          </div>

          <div className="text-center mb-8 min-h-[2.5rem]">
            {currentTask && state.status !== "complete" && (
              <p className="flex items-center justify-center gap-2 text-xl text-ink font-medium">
                {currentTask.status === "in-progress" ? (
                  <Loader2 className="animate-spin text-signal" size={20} />
                ) : (
                  <Check className="text-okgreen" size={20} />
                )}
                {currentTask.name}
              </p>
            )}
            {lastLog && (
              <p className="text-sm text-ink-faint mt-2">{lastLog.message}</p>
            )}
          </div>

          {state.pendingApproval && (
            <div className="max-w-md mx-auto mb-8">
              <ApprovalPanel
                pendingApproval={state.pendingApproval}
                onApprove={approveAction}
                actionBusy={actionBusy}
              />
            </div>
          )}

          {state.adaptations?.length > 0 && (
            <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-amber/40 bg-amber/10 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-amber font-semibold mb-2">Observe → Adapt</p>
              <p className="text-lg font-semibold text-ink">Machine Learning: 40% vs 60% target</p>
              <p className="text-sm text-ink-muted mt-1">Agent detected a performance gap → reallocated study time → moved Machine Learning to top priority.</p>
              <p className="text-sm text-amber font-semibold mt-2">Allocation: 20% → 45%</p>
            </div>
          )}

          {state.status === "complete" && state.result && (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-okgreen mb-3">
                Autonomous run complete
              </h2>
              <p className="text-ink text-lg mb-6">{state.result.summary}</p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <BigStat value={state.result.tasksCompleted} label="Tasks completed" />
                <BigStat value={state.result.adaptationsMade} label="Adaptations made" />
                <BigStat value={`${state.result.elapsedSeconds}s`} label="Run time" />
              </div>
              <div className="rounded-xl bg-surface-alt p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">Final allocation</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {state.result.studyPlan.map((item) => <div key={item.topic}><span className="text-ink-muted">{item.topic}</span><strong className="block text-signal text-lg">{item.allocation}</strong></div>)}
                </div>
                <p className="text-xs text-ink-faint mt-3">Sensitive action outcome: {state.result.sensitiveActionOutcome}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BigStat({ value, label }) {
  return (
    <div className="rounded-xl bg-surface-alt px-4 py-5">
      <p className="text-3xl font-bold text-signal">{value}</p>
      <p className="text-xs text-ink-faint mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}
