const express = require("express");
const cors = require("cors");
const {
  startAgent,
  getStatus,
  approveAction,
  resetSession,
} = require("./agentSimulation");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "goal2go-ai-backend" });
});

// Start a new autonomous agent run
app.post("/api/start-agent", (req, res) => {
  const { goal, demoMode } = req.body || {};
  if (!goal || typeof goal !== "string" || !goal.trim()) {
    return res.status(400).json({ error: "A goal is required to start the agent." });
  }
  const sessionId = startAgent(goal.trim(), !!demoMode);
  res.json({ sessionId });
});

// Poll current agent state
app.get("/api/get-status", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "sessionId is required." });
  const state = getStatus(sessionId);
  if (!state) return res.status(404).json({ error: "Session not found." });
  res.json(state);
});

// Approve or reject a pending sensitive action
app.post("/api/approve-action", (req, res) => {
  const { sessionId, approved } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId is required." });
  const state = getStatus(sessionId);
  if (!state) return res.status(404).json({ error: "Session not found." });
  if (!state.pendingApproval) {
    return res.status(409).json({ error: "No pending approval for this session." });
  }
  const updated = approveAction(sessionId, !!approved);
  res.json(updated);
});

// Reset / discard a session
app.post("/api/reset", (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId is required." });
  resetSession(sessionId);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Goal2Go AI backend running at http://localhost:${PORT}`);
});
