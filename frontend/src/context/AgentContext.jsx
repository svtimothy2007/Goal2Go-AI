import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5050/api").replace(/\/$/, "");
const AgentContext = createContext(null);
const DEFAULT_GOAL = "Prepare me for my Data Science exam tomorrow.";

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}

export function AgentProvider({ children }) {
  const [goal, setGoal] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [state, setState] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [actionBusy, setActionBusy] = useState(false);
  const pollRef = useRef(null);
  const sessionRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(async (id) => {
    const res = await fetch(`${API_BASE}/get-status?sessionId=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Session not found");
    return res.json();
  }, []);

  const poll = useCallback(
    (id) => {
      stopPolling();
      const tick = async () => {
        try {
          const data = await fetchStatus(id);
          if (sessionRef.current !== id) return;
          setConnectionError(null);
          setState(data);
          if (data.status === "complete") stopPolling();
        } catch {
          if (sessionRef.current !== id) return;
          setConnectionError("Cannot reach the Goal2Go backend. Check that the backend is running or that VITE_API_BASE is configured correctly.");
          stopPolling();
        }
      };
      tick();
      pollRef.current = setInterval(tick, 700);
    },
    [fetchStatus, stopPolling]
  );

  const startAgent = useCallback(
    async (goalText, demoMode = false) => {
      if (actionBusy || (state && state.status !== "complete")) return false;
      const finalGoal = (goalText || goal || DEFAULT_GOAL).trim();
      if (!finalGoal) {
        setConnectionError("Please enter a goal before starting the agent.");
        return false;
      }

      setActionBusy(true);
      try {
        stopPolling();
        const res = await fetch(`${API_BASE}/start-agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal: finalGoal, demoMode: demoMode === true }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Failed to start agent");
        setConnectionError(null);
        setGoal(finalGoal);
        setSessionId(data.sessionId);
        sessionRef.current = data.sessionId;
        setState(null);
        poll(data.sessionId);
        return true;
      } catch {
        setConnectionError("Cannot reach the Goal2Go backend. Check that the backend is running or that VITE_API_BASE is configured correctly.");
        return false;
      } finally {
        setActionBusy(false);
      }
    },
    [actionBusy, goal, poll, state, stopPolling]
  );

  const approveAction = useCallback(
    async (approved) => {
      if (!sessionId || !state?.pendingApproval || actionBusy || typeof approved !== "boolean") return false;
      setActionBusy(true);
      try {
        const res = await fetch(`${API_BASE}/approve-action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, approved }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Failed to submit approval");
        setConnectionError(null);
        setState(data);
        return true;
      } catch {
        setConnectionError("The approval could not be submitted. Please check the backend connection and try again.");
        return false;
      } finally {
        setActionBusy(false);
      }
    },
    [actionBusy, sessionId, state?.pendingApproval]
  );

  const resetAgent = useCallback(async () => {
    const oldSessionId = sessionId;
    stopPolling();
    sessionRef.current = null;
    setActionBusy(false);

    if (oldSessionId) {
      try {
        await fetch(`${API_BASE}/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: oldSessionId }),
        });
      } catch {
        // UI reset still proceeds; backend cleanup is best-effort.
      }
    }

    setSessionId(null);
    setState(null);
    setGoal("");
    setConnectionError(null);
  }, [sessionId, stopPolling]);

  const startDemo = useCallback(() => startAgent(DEFAULT_GOAL, true), [startAgent]);

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
    actionBusy,
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
