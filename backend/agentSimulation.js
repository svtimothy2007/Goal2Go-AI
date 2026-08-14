/**
 * agentSimulation.js
 *
 * This module simulates the internal lifecycle of an autonomous AI agent.
 * IMPORTANT: This is a scripted simulation for demonstration purposes.
 * No real AI/LLM reasoning happens here — it is a deterministic state
 * machine that mimics the *shape* of autonomous agent behavior:
 *   understand -> plan -> use tools -> act -> observe -> adapt -> result
 *
 * Each session is fully isolated and stored in-memory (Map). This is a
 * prototype; a production system would use a real datastore.
 */

const { randomUUID } = require("crypto");

// ---- Static "world knowledge" the simulation draws from -------------------

const TASK_DEFINITIONS = [
  {
    id: "t1",
    name: "Analyze syllabus",
    tool: "File Organizer",
    log: "Scanning uploaded syllabus and course materials...",
    durationMs: 8000,
  },
  {
    id: "t2",
    name: "Identify weak areas",
    tool: "Progress Analyzer",
    log: "Cross-referencing past quiz scores against topic list...",
    durationMs: 9000,
  },
  {
    id: "t3",
    name: "Create study schedule",
    tool: "Calendar",
    log: "Blocking 30-minute focused study sessions before tomorrow's exam...",
    durationMs: 8000,
  },
  {
    id: "t4",
    name: "Generate notes",
    tool: "Notes Generator",
    log: "Compiling condensed revision notes for each topic...",
    durationMs: 10000,
    sensitiveAfter: {
      id: "email_reminder",
      message: "Agent wants to send a study reminder to your email.",
      auditAction: "Send study reminder email",
    },
  },
  {
    id: "t5",
    name: "Create practice questions",
    tool: "Quiz Generator",
    log: "Generating practice questions weighted toward weaker topics...",
    durationMs: 9000,
  },
  {
    id: "t6",
    name: "Evaluate performance",
    tool: "Progress Analyzer",
    log: "Scoring practice attempts and updating topic mastery levels...",
    durationMs: 8000,
    triggersAdaptation: true,
  },
  {
    id: "t7",
    name: "Recommend revision",
    tool: "Study Resource Search",
    log: "Finalizing prioritized revision plan for tomorrow morning...",
    durationMs: 8000,
  },
];

const INITIAL_METRICS = { Statistics: 85, Python: 70, "Machine Learning": 40 };

const MEMORY = {
  preferences: [
    "Short study sessions (30 min blocks)",
    "Learns best with practice questions",
    "Prefers visual explanations",
  ],
  previousProgress: [
    { topic: "Python", level: "Strong", value: 85 },
    { topic: "Statistics", level: "Moderate", value: 75 },
    { topic: "Machine Learning", level: "Needs Improvement", value: 40 },
  ],
};

const TOOLS = [
  { id: "search", name: "Study Resource Search", icon: "search" },
  { id: "calendar", name: "Calendar", icon: "calendar" },
  { id: "notes", name: "Notes Generator", icon: "notebook-pen" },
  { id: "quiz", name: "Quiz Generator", icon: "help-circle" },
  { id: "analyzer", name: "Progress Analyzer", icon: "bar-chart-3" },
  { id: "files", name: "File Organizer", icon: "folder-cog" },
];

// ---- Session store ----------------------------------------------------

const sessions = new Map();

function nowStamp() {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour12: false });
}

function freshState(goal, demoMode) {
  return {
    goal,
    demoMode: !!demoMode,
    status: "running", // running | paused-approval | complete
    stage: "understand", // understand | plan | tools | act | observe | adapt | result
    tasks: TASK_DEFINITIONS.map((t) => ({
      id: t.id,
      name: t.name,
      tool: t.tool,
      status: "pending", // pending | in-progress | complete
    })),
    currentTaskIndex: -1,
    progress: 0,
    activityLog: [],
    metrics: { ...INITIAL_METRICS },
    adaptations: [],
    pendingApproval: null,
    auditLog: [],
    memory: MEMORY,
    tools: TOOLS,
    result: null,
    startedAt: Date.now(),
    finishedAt: null,
    _timer: null,
  };
}

function pushLog(state, message, type = "info") {
  state.activityLog.push({ time: nowStamp(), message, type });
}

function pushAudit(state, action, status, approvalRequired) {
  state.auditLog.push({
    action,
    time: nowStamp(),
    status,
    approvalRequired: !!approvalRequired,
  });
}

function computeProgress(state) {
  const total = state.tasks.length;
  const completed = state.tasks.filter((t) => t.status === "complete").length;
  const inProgress = state.tasks.some((t) => t.status === "in-progress") ? 0.5 : 0;
  state.progress = Math.min(
    100,
    Math.round(((completed + inProgress) / total) * 100)
  );
}

/** Advance the simulation to the next task, respecting approval gates. */
function advance(sessionId) {
  const state = sessions.get(sessionId);
  if (!state || state.status === "complete") return;

  const nextIndex = state.currentTaskIndex + 1;

  if (nextIndex >= state.tasks.length) {
    finish(state);
    return;
  }

  const def = TASK_DEFINITIONS[nextIndex];
  state.currentTaskIndex = nextIndex;
  state.stage = nextIndex === 0 ? "understand" : "act";
  state.tasks[nextIndex].status = "in-progress";
  pushLog(state, `Starting: ${def.name}`, "task-start");
  pushLog(state, def.log, "tool");
  computeProgress(state);

  state._timer = setTimeout(() => {
    completeTask(sessionId, def);
  }, def.durationMs);
}

function completeTask(sessionId, def) {
  const state = sessions.get(sessionId);
  if (!state) return;

  const idx = state.tasks.findIndex((t) => t.id === def.id);
  state.tasks[idx].status = "complete";
  pushLog(state, `Completed: ${def.name}`, "task-complete");
  computeProgress(state);

  // Adaptation trigger (Observe -> Adapt cycle)
  if (def.triggersAdaptation) {
    runAdaptation(state);
  }

  // Human-in-the-loop trigger
  if (def.sensitiveAfter) {
    requestApproval(sessionId, def.sensitiveAfter);
    return; // pause pipeline until approved/rejected
  }

  advance(sessionId);
}

function runAdaptation(state) {
  state.stage = "observe";
  pushLog(
    state,
    `Observation: Machine Learning performance is ${state.metrics["Machine Learning"]}%, below the 60% target.`,
    "observation"
  );
  state.stage = "adapt";
  const adaptation = {
    time: nowStamp(),
    message:
      "Machine Learning performance below target. Reallocating study time.",
    detail:
      "Increasing Machine Learning allocation from 20% to 45% of remaining study time; reducing Statistics allocation (already strong at 85%).",
  };
  state.adaptations.push(adaptation);
  pushLog(state, adaptation.message, "adaptation");
  pushLog(state, "Plan reprioritized: Machine Learning moved to top priority.", "adaptation");
}

function requestApproval(sessionId, sensitive) {
  const state = sessions.get(sessionId);
  state.status = "paused-approval";
  state.stage = "act";
  state.pendingApproval = {
    id: sensitive.id,
    message: sensitive.message,
    requestedAt: nowStamp(),
  };
  pushLog(state, `Approval required: ${sensitive.message}`, "approval-request");
  pushAudit(state, sensitive.auditAction, "Pending approval", true);

  // IMPORTANT: Never auto-approve sensitive actions.
  // The demo intentionally pauses here so the presenter can click
  // Approve/Reject and demonstrate human-in-the-loop safety.
}

function resolveApproval(sessionId, approved, auto = false) {
  const state = sessions.get(sessionId);
  if (!state || !state.pendingApproval) return;

  const sensitive = state.pendingApproval;
  state.pendingApproval = null;
  state.status = "running";

  const auditAction =
    sensitive.id === "email_reminder"
      ? "Send study reminder email"
      : sensitive.id;

  if (approved) {
    pushLog(
      state,
      `${auto ? "Auto-" : ""}Approved: ${sensitive.message}`,
      "approval-granted"
    );
    pushAudit(state, auditAction, "Approved" + (auto ? " (auto, demo mode)" : ""), true);
  } else {
    pushLog(state, `Rejected: ${sensitive.message}`, "approval-denied");
    pushAudit(state, auditAction, "Rejected", true);
  }

  advance(sessionId);
}

function finish(state) {
  state.status = "complete";
  state.stage = "result";
  state.progress = 100;
  state.finishedAt = Date.now();

  const elapsedSec = Math.round((state.finishedAt - state.startedAt) / 1000);

  state.result = {
    summary:
      "Personalized Data Science exam prep plan generated and prioritized around your weakest topic.",
    studyPlan: [
      { topic: "Machine Learning", allocation: "45%", note: "Reprioritized after low practice scores (40%)" },
      { topic: "Statistics", allocation: "20%", note: "Light review — already strong (85%)" },
      { topic: "Python", allocation: "35%", note: "Targeted practice on weaker sub-topics" },
    ],
    tasksCompleted: state.tasks.length,
    adaptationsMade: state.adaptations.length,
    timeSavedEstimate: "~2.5 hours vs. manual planning",
    elapsedSeconds: elapsedSec,
  };

  pushLog(state, "Final study plan ready. Autonomous run complete.", "result");
}

// ---- Public API ---------------------------------------------------------

function startAgent(goal, demoMode) {
  const sessionId = randomUUID();
  const state = freshState(goal, demoMode);
  sessions.set(sessionId, state);
  pushLog(state, `Goal received: "${goal}"`, "start");
  pushLog(state, "Interpreting goal and checking memory for prior context...", "understand");
  pushLog(state, "Building task plan...", "plan");
  state.stage = "plan";
  computeProgress(state);

  // Small delay before the first task so the UI can show the
  // "understand -> plan" stages distinctly, like a real agent would.
  state._timer = setTimeout(() => advance(sessionId), 1500);

  return sessionId;
}

function getStatus(sessionId) {
  const state = sessions.get(sessionId);
  if (!state) return null;
  // Strip internal-only fields before returning to the client.
  const { _timer, ...publicState } = state;
  return publicState;
}

function approveAction(sessionId, approved) {
  resolveApproval(sessionId, approved, false);
  return getStatus(sessionId);
}

function resetSession(sessionId) {
  const state = sessions.get(sessionId);
  if (state && state._timer) clearTimeout(state._timer);
  sessions.delete(sessionId);
}

module.exports = {
  startAgent,
  getStatus,
  approveAction,
  resetSession,
};
