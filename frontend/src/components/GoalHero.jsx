import React, { useState } from "react";
import { Rocket, Play, AlertTriangle } from "lucide-react";
import { useAgent } from "../context/AgentContext.jsx";
import Button from "./Button.jsx";

export default function GoalHero() {
  const { startAgent, startDemo, connectionError, DEFAULT_GOAL, theme } = useAgent();
  const [input, setInput] = useState("");
  const isLight = theme === "light";

  return (
    <div className="max-w-3xl mx-auto text-center pt-10 pb-6 px-5">
      <span className="inline-block text-[11px] tracking-widest uppercase text-signal font-semibold mb-3">
        Ideathon Prototype · Autonomous AI Agents
      </span>
      <h1
        className={[
          "text-3xl sm:text-4xl font-semibold leading-tight mb-3",
          isLight ? "text-paper-ink" : "text-ink",
        ].join(" ")}
      >
        Give it a goal. Watch it plan, act, and adapt —{" "}
        <span className="text-signal">on its own.</span>
      </h1>
      <p className={isLight ? "text-paper-ink/70 text-sm max-w-xl mx-auto mb-7" : "text-ink-muted text-sm max-w-xl mx-auto mb-7"}>
        A conceptual and functional prototype demonstrating the workflow of an
        autonomous AI productivity agent for educational purposes. Traditional
        assistants answer prompts; this agent pursues a goal end-to-end —
        understanding, planning, using tools, observing results, and adapting
        its plan, with a human approval gate on sensitive actions.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          startAgent(input);
        }}
        className="flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={DEFAULT_GOAL}
          className={[
            "flex-1 rounded-lg border px-4 py-3 text-sm outline-none transition-colors",
            isLight
              ? "bg-paper-panel border-paper-border text-paper-ink placeholder:text-paper-ink/40"
              : "bg-surface border-surface-border text-ink placeholder:text-ink-faint focus:border-signal/60",
          ].join(" ")}
        />
        <Button type="submit" variant="primary" icon={<Rocket size={16} />}>
          Start Autonomous Agent
        </Button>
      </form>

      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px w-10 bg-surface-border" />
        <span className="text-[11px] text-ink-faint">or</span>
        <div className="h-px w-10 bg-surface-border" />
      </div>

      <Button variant="secondary" size="sm" icon={<Play size={13} />} onClick={startDemo} className="mt-3">
        Demo Mode — guided full scenario with human approval (60–90s)
      </Button>

      {connectionError && (
        <div className="mt-5 mx-auto max-w-xl flex items-start gap-2 text-left text-xs text-alert bg-alert/10 border border-alert/30 rounded-lg px-3 py-2.5">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{connectionError}</span>
        </div>
      )}
    </div>
  );
}
