import React from "react";
import { ShieldAlert, Check, X } from "lucide-react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";

export default function ApprovalPanel({ pendingApproval, onApprove, actionBusy }) {
  if (!pendingApproval) return null;

  return (
    <Card
      className="border-amber/50 ring-2 ring-amber/20"
      title="Human Approval Required"
      icon={<ShieldAlert size={15} className="text-amber" />}
    >
      <div className="rounded-lg border border-amber/30 bg-amber/10 px-3 py-2.5 mb-4">
        <p className="text-xs uppercase tracking-wide text-amber font-semibold mb-1">Sensitive action</p>
        <p className="text-sm text-ink font-medium">{pendingApproval.label || pendingApproval.message}</p>
      </div>
      <p className="text-xs text-ink-faint mb-4">
        The agent is paused. Nothing sensitive will execute until a human chooses an option.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="success"
          icon={<Check size={16} />}
          onClick={() => onApprove(true)}
          disabled={actionBusy}
          className="flex-1"
        >
          {actionBusy ? "Submitting…" : "Approve"}
        </Button>
        <Button
          variant="danger"
          icon={<X size={16} />}
          onClick={() => onApprove(false)}
          disabled={actionBusy}
          className="flex-1"
        >
          {actionBusy ? "Submitting…" : "Reject"}
        </Button>
      </div>
      <p className="text-[11px] text-ink-faint mt-3">
        Prototype only: approval controls a simulated action; no real external service is called.
      </p>
    </Card>
  );
}
