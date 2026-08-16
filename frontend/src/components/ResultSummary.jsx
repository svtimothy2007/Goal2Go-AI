import React from "react";
import { Sparkles, Clock, ListChecks, RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
import Card from "./Card.jsx";

export default function ResultSummary({ result, adaptations }) {
  if (!result) return null;
  const approved = result.sensitiveActionOutcome?.startsWith("Approved");

  return (
    <Card className="border-okgreen/40 ring-1 ring-okgreen/20" title="Final Result" icon={<Sparkles size={14} className="text-okgreen" />}>
      <p className="text-sm text-ink mb-4">{result.summary}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat icon={<ListChecks size={14} />} label="Tasks completed" value={result.tasksCompleted} />
        <Stat icon={<RefreshCw size={14} />} label="Adaptations made" value={result.adaptationsMade} />
        <Stat icon={<Clock size={14} />} label="Run time" value={`${result.elapsedSeconds}s`} />
      </div>

      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-2">Personalized Study Plan</p>
        <ul className="space-y-2">
          {result.studyPlan.map((item) => (
            <li key={item.topic} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center text-sm bg-surface-alt rounded-lg px-3 py-2">
              <span className="text-ink">{item.topic}</span>
              <span className="text-ink-faint text-xs text-right">{item.note}</span>
              <span className="text-signal font-mono text-xs">{item.allocation}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-surface-border bg-surface-alt/60 px-3 py-2.5 mb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-ink">
          {approved ? <ShieldCheck size={14} className="text-okgreen" /> : <ShieldX size={14} className="text-alert" />}
          Sensitive action: {result.sensitiveActionOutcome}
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        Estimated time saved: <span className="text-okgreen font-medium">{result.timeSavedEstimate}</span>
      </p>
      <p className="text-[11px] text-ink-faint mt-1">{result.timeSavedNote}</p>

      {adaptations?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-surface-border">
          <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-2">Adaptation Evidence</p>
          {adaptations.map((item) => (
            <div key={item.time} className="rounded-lg bg-amber/10 border border-amber/20 px-3 py-2">
              <p className="text-xs text-amber font-medium">{item.message}</p>
              <p className="text-xs text-ink-muted mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-surface-alt px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1.5 text-signal mb-1">{icon}</div>
      <p className="text-lg font-semibold text-ink leading-none">{value}</p>
      <p className="text-[10px] text-ink-faint mt-1">{label}</p>
    </div>
  );
}
