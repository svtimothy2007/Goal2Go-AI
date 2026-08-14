import React from "react";
import { Bot, Sun, Moon, Presentation, RotateCcw } from "lucide-react";
import { useAgent } from "../context/AgentContext.jsx";
import Button from "./Button.jsx";

export default function Header() {
  const {
    theme,
    setTheme,
    presentationMode,
    setPresentationMode,
    resetAgent,
    state,
  } = useAgent();
  const isLight = theme === "light";

  return (
    <header
      className={[
        "sticky top-0 z-20 border-b backdrop-blur",
        isLight
          ? "bg-paper/90 border-paper-border"
          : "bg-base/85 border-surface-border",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal/15 text-signal">
            <Bot size={17} />
          </span>
          <div>
            <p className={isLight ? "text-paper-ink font-semibold text-sm leading-none" : "text-ink font-semibold text-sm leading-none"}>
              Goal2Go AI
            </p>
            <p className="text-[10px] text-ink-faint leading-none mt-1">
              Autonomous Agent Prototype
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {state && (
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw size={13} />}
              onClick={resetAgent}
            >
              Reset
            </Button>
          )}
          <Button
            variant={presentationMode ? "primary" : "secondary"}
            size="sm"
            icon={<Presentation size={13} />}
            onClick={() => setPresentationMode((v) => !v)}
          >
            {presentationMode ? "Exit Presentation" : "Presentation Mode"}
          </Button>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={[
              "w-9 h-9 flex items-center justify-center rounded-lg border transition-colors",
              isLight
                ? "border-paper-border text-paper-ink hover:bg-paper"
                : "border-surface-border text-ink-muted hover:bg-surface-alt",
            ].join(" ")}
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
