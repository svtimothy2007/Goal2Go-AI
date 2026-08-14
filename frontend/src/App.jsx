import React from "react";
import { useAgent } from "./context/AgentContext.jsx";
import Header from "./components/Header.jsx";
import GoalHero from "./components/GoalHero.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PresentationView from "./components/PresentationView.jsx";

export default function App() {
  const { state, presentationMode, theme } = useAgent();
  const isLight = theme === "light";

  return (
    <div
      className={[
        "min-h-screen transition-colors duration-300",
        isLight ? "bg-paper text-paper-ink" : "bg-base text-ink",
      ].join(" ")}
    >
      <Header />

      {presentationMode ? (
        <PresentationView />
      ) : (
        <>
          {!state && <GoalHero />}
          {state && (
            <div className="pt-6">
              <Dashboard />
            </div>
          )}
        </>
      )}

      <footer className="max-w-6xl mx-auto px-5 py-8 text-center">
        <p className="text-[11px] text-ink-faint max-w-xl mx-auto">
          A conceptual and functional prototype demonstrating the workflow of
          an autonomous AI productivity agent for educational purposes. No
          real AI reasoning or external services are used — all behavior is
          scripted for demonstration.
        </p>
      </footer>
    </div>
  );
}
