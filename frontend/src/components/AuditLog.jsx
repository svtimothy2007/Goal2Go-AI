import React from "react";
import { ClipboardList } from "lucide-react";
import Card from "./Card.jsx";

const STATUS_COLOR = {
  Approved: "text-okgreen",
  Rejected: "text-alert",
  "Pending approval": "text-amber",
};

function statusColor(status) {
  const key = Object.keys(STATUS_COLOR).find((k) => status.startsWith(k));
  return key ? STATUS_COLOR[key] : "text-ink-muted";
}

export default function AuditLog({ entries = [] }) {
  return (
    <Card title="Audit Log" icon={<ClipboardList size={14} className="text-signal" />}>
      {entries.length === 0 ? (
        <p className="text-sm text-ink-faint py-3 text-center">
          Sensitive actions requiring approval will be logged here.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-ink-faint uppercase tracking-wide">
                <th className="font-medium pb-2 pr-3">Action</th>
                <th className="font-medium pb-2 pr-3">Time</th>
                <th className="font-medium pb-2 pr-3">Status</th>
                <th className="font-medium pb-2">Approval</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="border-t border-surface-border">
                  <td className="py-2 pr-3 text-ink">{e.action}</td>
                  <td className="py-2 pr-3 text-ink-faint font-mono">{e.time}</td>
                  <td className={`py-2 pr-3 font-medium ${statusColor(e.status)}`}>{e.status}</td>
                  <td className="py-2 text-ink-muted">{e.approvalRequired ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
