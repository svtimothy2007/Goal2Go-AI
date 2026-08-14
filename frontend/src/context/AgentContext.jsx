import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const API_BASE = "http://localhost:5050/api";

const AgentContext = createContext(null);

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}

const DEFAULT_GOAL = "Prepare me for my Data Science exam tomorrow.";

export function AgentProvider({ children }) {
  const [goal, setGoal] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [state, setState] = useState(null); // full agent state from backend
  const [connectionError, setConnectionError] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const poll = useCallback((id) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/get-status?sessionId=${id}`);
        if (!res.ok) throw new Error("Session not found");
        const data = await res.json();
        setConnectionError(null);
        setState(data);
        if (data.status === "complete") {
          stopPolling();
        }
      } catch (err) {
        setConnectionError(
          "Cannot reach the Goal2Go backend. Make sure the server is running (npm run dev in /backend)."
        );
        stopPolling();
      }
    }, 700);
  }, [stopPolling]);

  const startAgent = useCallback(
    async (goalText, demoMode = false) => {
      const finalGoal = (goalText || goal || DEFAULT_GOAL).trim();
      try {
        const res = await fetch(`${API_BASE}/start-agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal: finalGoal, demoMode }),
        });
        if (!res.ok) throw new Error("Failed to start agent");
        const data = await res.json();
        setConnectionError(null);
        setGoal(finalGoal);
        setSessionId(data.sessionId);
        poll(data.sessionId);
      } catch (err) {
        setConnectionError(
          "Cannot reach the Goal2Go backend. Make sure the server is running (npm run dev in /backend)."
        );
      }
    },
    [goal, poll]
  );

  const approveAction = useCallback(
    async (approved) => {
      if (!sessionId) return;
      try {
        const res = await fetch(`${API_BASE}/approve-action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, approved }),
        });
        if (!res.ok) throw new Error("Failed to submit approval");
        const data = await res.json();
        setState(data);
      } catch (err) {
        setConnectionError(
          "Cannot reach the Goal2Go backend. Make sure the server is running (npm run dev in /backend)."
        );
      }
    },
    [sessionId]
  );

  const resetAgent = useCallback(async () => {
    stopPolling();
    if (sessionId) {
      try {
        await fetch(`${API_BASE}/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        /* best-effort */
      }
    }
    setSessionId(null);
    setState(null);
    setGoal("");
  }, [sessionId, stopPolling]);

  const startDemo = useCallback(() => {
    startAgent(DEFAULT_GOAL, true);
  }, [startAgent]);

  useEffect(() => stopPolling, [stopPolling]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.classList.add("theme-light");
    else root.classList.remove("theme-light");
  }, [theme]);

  const value = {
    goal,
    setGoal,
    sessionId,
    state,
    connectionError,
    startAgent,
    approveAction,
    resetAgent,
    startDemo,
    presentationMode,
    setPresentationMode,
    theme,
    setTheme,
    DEFAULT_GOAL,
  };

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}
