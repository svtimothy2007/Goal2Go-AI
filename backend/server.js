const express = require("express");
const cors = require("cors");
const { startAgent, getStatus, approveAction, resetSession } = require("./agentSimulation");

const app = express();
const PORT = process.env.PORT || 5050;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "goal2go-ai-backend" });
});

app.post("/api/start-agent", (req, res) => {
  const { goal, demoMode } = req.body || {};
  if (typeof goal !== "string" || !goal.trim()) {
    return res.status(400).json({ error: "A goal is required to start the agent." });
  }

  const sessionId = startAgent(goal.trim(), demoMode === true);
  return res.json({ sessionId });
});

app.get("/api/get-status", (req, res) => {
  const { sessionId } = req.query;
  if (typeof sessionId !== "string" || !sessionId) {
    return res.status(400).json({ error: "sessionId is required." });
  }

  const state = getStatus(sessionId);
  if (!state) return res.status(404).json({ error: "Session not found." });
  return res.json(state);
});

app.post("/api/approve-action", (req, res) => {
  const { sessionId, approved } = req.body || {};
  if (typeof sessionId !== "string" || !sessionId) {
    return res.status(400).json({ error: "sessionId is required." });
  }
  if (typeof approved !== "boolean") {
    return res.status(400).json({ error: "approved must be a boolean." });
  }

  const state = getStatus(sessionId);
  if (!state) return res.status(404).json({ error: "Session not found." });
  if (!state.pendingApproval) {
    return res.status(409).json({ error: "No pending approval for this session." });
  }

  const updated = approveAction(sessionId, approved);
  if (!updated) return res.status(409).json({ error: "Approval was already resolved." });
  return res.json(updated);
});

app.post("/api/reset", (req, res) => {
  const { sessionId } = req.body || {};
  if (typeof sessionId !== "string" || !sessionId) {
    return res.status(400).json({ error: "sessionId is required." });
  }
  resetSession(sessionId);
  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Goal2Go AI backend running on port ${PORT}`);
});
