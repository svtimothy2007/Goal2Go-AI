import React, { useEffect, useRef } from "react";
import {
  Play,
  Brain,
  ListTree,
  Wrench,
  Eye,
  RefreshCw,
  ShieldQuestion,
  ShieldCheck,
  ShieldX,
  Flag,
} from "lucide-react";
import Card from "./Card.jsx";

const ICONS = {
  start: { Icon: Play, color: "text-signal" },
  understand: { Icon: Brain, color: "text-signal" },
  plan: { Icon: ListTree, color: "text-signal" },
  tool: { Icon: Wrench, color: "text-ink-muted" },
  "task-start": { Icon: Wrench, color: "text-ink-muted" },
  "task-complete": { Icon: ShieldCheck, color: "text-okgreen" },
  observation: { Icon: Eye, color: "text-amber" },
  adaptation: { Icon: RefreshCw, color: "text-amber" },
  "approval-request": { Icon: ShieldQuestion, color: "text-amber" },
  "approval-granted": { Icon: ShieldCheck, color: "text-okgreen" },
  "approval-denied": { Icon: ShieldX, color: "text-alert" },
  result: { Icon: Flag, color: "text-okgreen" },
  info: { Icon: Wrench, color: "text-ink-muted" },
};

export default function ActivityLog({ entries = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <Card title="Agent Activity Log">
      <div
        ref={scrollRef}
        className="log-scroll flex flex-col gap-1 max-h-64 overflow-y-auto pr-1 font-mono text-[12.5px]"
      >
        {entries.length === 0 && (
          <p className="text-ink-faint py-4 text-center font-sans text-sm">
            Activity will appear here once the agent starts.
          </p>
        )}
        {entries.map((e, i) => {
          const cfg = ICONS[e.type] || ICONS.info;
          const { Icon, color } = cfg;
          return (
            <div key={i} className="flex items-start gap-2 py-1 animate-fadeUp">
              <Icon size={13} className={`${color} mt-0.5 shrink-0`} />
              <span className="text-ink-faint shrink-0">{e.time}</span>
              <span className="text-ink-muted">{e.message}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
