import React from "react";
import { ShieldAlert, Check, X } from "lucide-react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";

export default function ApprovalPanel({ pendingApproval, onApprove, onReject, demoMode }) {
  if (!pendingApproval) return null;

  return (
    <Card
      className="border-amber/40 ring-1 ring-amber/20"
      title="Human Approval Required"
      icon={<ShieldAlert size={14} className="text-amber" />}
    >
      <p className="text-sm text-ink mb-1">{pendingApproval.message}</p>
      <p className="text-xs text-ink-faint italic mb-4">
        Autonomous does not mean uncontrolled.
      </p>
      <div className="flex gap-3">
        <Button variant="success" icon={<Check size={16} />} onClick={() => onApprove(true)}>
          Approve
        </Button>
        <Button variant="danger" icon={<X size={16} />} onClick={() => onApprove(false)}>
          Reject
        </Button>
      </div>
      {demoMode && (
        <p className="text-[11px] text-ink-faint mt-3">
          Demo Mode: auto-approving in a few seconds if no action is taken...
        </p>
      )}
    </Card>
  );
}
