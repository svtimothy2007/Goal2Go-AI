import React from "react";
import { ClipboardList } from "lucide-react";
import Card from "./Card.jsx";

const STATUS_COLOR = {
  Approved: "text-okgreen",
  Rejected: "text-alert",
  "Pending approval": "text-amber",
};

function statusColor(status) {
  return STATUS_COLOR[status] || "text-ink-muted";
}

export default function AuditLog({ entries = [] }) {
  return (
    <Card title="Audit Log" icon={<ClipboardList size={14} className="text-signal" />}>
      {entries.length === 0 ? (
        <p className="text-sm text-ink-faint py-3 text-center">Sensitive actions requiring approval will be logged here.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr className="text-left text-ink-faint uppercase tracking-wide">
                <th className="font-medium pb-2 pr-3">Action</th>
                <th className="font-medium pb-2 pr-3">Time</th>
                <th className="font-medium pb-2 pr-3">Status</th>
                <th className="font-medium pb-2">Approval</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={`${entry.action}-${i}`} className="border-t border-surface-border">
                  <td className="py-2 pr-3 text-ink">{entry.action}</td>
                  <td className="py-2 pr-3 text-ink-faint font-mono">{entry.time}</td>
                  <td className={`py-2 pr-3 font-medium ${statusColor(entry.status)}`}>{entry.status}</td>
                  <td className="py-2 text-ink-muted">{entry.approval || (entry.approvalRequired ? "Human" : "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[11px] text-ink-faint mt-3">
        One row represents the current outcome of each sensitive action, so an approved action is never shown as still pending.
      </p>
    </Card>
  );
}
