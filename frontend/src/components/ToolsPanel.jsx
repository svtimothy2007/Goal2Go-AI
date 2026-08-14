import React from "react";
import {
  Search,
  Calendar,
  NotebookPen,
  HelpCircle,
  BarChart3,
  FolderCog,
} from "lucide-react";
import Card from "./Card.jsx";

const ICON_MAP = {
  search: Search,
  calendar: Calendar,
  "notebook-pen": NotebookPen,
  "help-circle": HelpCircle,
  "bar-chart-3": BarChart3,
  "folder-cog": FolderCog,
};

export default function ToolsPanel({ tools = [], activeToolName }) {
  return (
    <Card title="Tools Available">
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => {
          const Icon = ICON_MAP[tool.icon] || Search;
          const isActive = tool.name === activeToolName;
          return (
            <div
              key={tool.id}
              className={[
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors",
                isActive
                  ? "border-signal/50 bg-signal/10 text-signal"
                  : "border-surface-border text-ink-muted",
              ].join(" ")}
            >
              <Icon size={14} className="shrink-0" />
              <span className="truncate">{tool.name}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
