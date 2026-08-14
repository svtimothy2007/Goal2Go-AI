import React from "react";
import { useAgent } from "../context/AgentContext.jsx";
import StatusBadge from "./StatusBadge.jsx";
import ProgressBar from "./ProgressBar.jsx";
import TaskList from "./TaskList.jsx";
import ActivityLog from "./ActivityLog.jsx";
import ToolsPanel from "./ToolsPanel.jsx";
import MemoryPanel from "./MemoryPanel.jsx";
import ApprovalPanel from "./ApprovalPanel.jsx";
import AuditLog from "./AuditLog.jsx";
import ResultSummary from "./ResultSummary.jsx";
import MetricsChart from "./MetricsChart.jsx";
import AgentPipeline from "./AgentPipeline.jsx";
import Card from "./Card.jsx";

export default function Dashboard() {
  const { state, approveAction, theme } = useAgent();
  if (!state) return null;
  const isLight = theme === "light";

  const currentTask = state.tasks[state.currentTaskIndex];

  return (
    <div className="max-w-6xl mx-auto px-5 pb-16">
      {/* Status strip */}
      <Card className="mb-5" dense>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="min-w-0">
            <p className={isLight ? "text-paper-ink/60 text-xs mb-0.5" : "text-ink-faint text-xs mb-0.5"}>
              Goal
            </p>
            <p className={isLight ? "text-paper-ink text-sm font-medium truncate" : "text-ink text-sm font-medium truncate"}>
              {state.goal}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-ink-faint">
              {currentTask ? `Current: ${currentTask.name}` : "—"}
            </span>
            <StatusBadge status={state.status} size="lg" />
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={state.progress} label="Overall progress" />
        </div>
      </Card>

      <ApprovalPanel
        pendingApproval={state.pendingApproval}
        onApprove={approveAction}
        demoMode={state.demoMode}
      />
      {state.pendingApproval && <div className="mb-5" />}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <TaskList tasks={state.tasks} />
          <MetricsChart metrics={state.metrics} />
          <ActivityLog entries={state.activityLog} />
          {state.result && (
            <ResultSummary result={state.result} adaptations={state.adaptations} />
          )}
          <AuditLog entries={state.auditLog} />
        </div>

        <div className="flex flex-col gap-5">
          <AgentPipeline currentStage={state.stage} isRunning={state.status !== "complete"} />
          <ToolsPanel tools={state.tools} activeToolName={currentTask?.tool} />
          <MemoryPanel memory={state.memory} />
        </div>
      </div>
    </div>
  );
}
