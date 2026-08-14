import React from "react";
import { Check, Loader2, Circle } from "lucide-react";
import Card from "./Card.jsx";

function TaskRow({ task }) {
  const isComplete = task.status === "complete";
  const isActive = task.status === "in-progress";

  return (
    <li
      className={[
        "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors",
        isActive ? "bg-signal/10" : "",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center justify-center w-6 h-6 rounded-full shrink-0",
          isComplete
            ? "bg-okgreen/15 text-okgreen"
            : isActive
            ? "bg-signal/15 text-signal"
            : "bg-surface-alt text-ink-faint",
        ].join(" ")}
      >
        {isComplete ? (
          <Check size={14} strokeWidth={3} />
        ) : isActive ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Circle size={8} fill="currentColor" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={[
            "text-sm truncate",
            isComplete ? "text-ink-muted line-through decoration-ink-faint" : "text-ink",
            isActive ? "font-medium" : "",
          ].join(" ")}
        >
          {task.name}
        </p>
      </div>
      <span className="text-[11px] text-ink-faint font-mono shrink-0">{task.tool}</span>
    </li>
  );
}

export default function TaskList({ tasks = [] }) {
  return (
    <Card title="Task Plan">
      <ul className="flex flex-col gap-0.5">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-ink-faint py-4 text-center">
            No tasks yet — start the agent to generate a plan.
          </p>
        )}
      </ul>
    </Card>
  );
}
