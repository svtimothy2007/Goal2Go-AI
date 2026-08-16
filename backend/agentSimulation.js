/**
 * Goal2Go AI — deterministic autonomous-agent prototype.
 *
 * This is a scripted simulation for demonstration purposes. It does not use
 * real AI/LLM reasoning or real external services.
 */

const { randomUUID } = require("crypto");

const TARGET_SCORE = 60;
const INITIAL_METRICS = { Statistics: 85, Python: 70, "Machine Learning": 40 };

const TASK_DEFINITIONS = [
  {
    id: "t1",
    name: "Analyze syllabus",
    tool: "File Organizer",
    log: "Analyzing simulated syllabus data and course context...",
    durationMs: 8000,
  },
  {
    id: "t2",
    name: "Identify weak areas",
    tool: "Progress Analyzer",
    log: "Cross-referencing practice scores against the topic list...",
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
      label: "Simulated Action: Send Study Reminder Email",
      message: "Simulated Action: Send Study Reminder Email",
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

const MEMORY = {
  preferences: [
    "Short study sessions (30 min blocks)",
    "Learns best with practice questions",
    "Prefers visual explanations",
  ],
  previousProgress: [
    { topic: "Python", level: "Good", value: 70 },
    { topic: "Statistics", level: "Strong", value: 85 },
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

const sessions = new Map();

function nowStamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function freshState(goal, demoMode) {
  return {
    goal,
    demoMode: !!demoMode,
    status: "running",
    stage: "understand",
    tasks: TASK_DEFINITIONS.map((task) => ({
      id: task.id,
      name: task.name,
      tool: task.tool,
      status: "pending",
    })),
    currentTaskIndex: -1,
    progress: 0,
    activityLog: [],
    metrics: { ...INITIAL_METRICS },
    targetScore: TARGET_SCORE,
    adaptations: [],
    pendingApproval: null,
    auditLog: [],
    memory: JSON.parse(JSON.stringify(MEMORY)),
    tools: TOOLS,
    result: null,
    startedAt: Date.now(),
    finishedAt: null,
    sensitiveAction: null,
    _timer: null,
  };
}

function pushLog(state, message, type = "info") {
  state.activityLog.push({ time: nowStamp(), message, type });
}

function addAudit(state, action, status, approvalRequired) {
  state.auditLog.push({
    action,
    time: nowStamp(),
    status,
    approvalRequired: !!approvalRequired,
    approval: approvalRequired ? "Human" : "—",
  });
  return state.auditLog[state.auditLog.length - 1];
}

function updateAudit(state, action, status) {
  const entry = [...state.auditLog].reverse().find((item) => item.action === action);
  if (entry) {
    entry.time = nowStamp();
    entry.status = status;
    entry.approval = "Human";
    return entry;
  }
  return addAudit(state, action, status, true);
}

function computeProgress(state) {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.status === "complete").length;
  const inProgress = state.tasks.some((task) => task.status === "in-progress") ? 0.5 : 0;
  state.progress = Math.min(100, Math.round(((completed + inProgress) / total) * 100));
}

function advance(sessionId) {
  const state = sessions.get(sessionId);
  if (!state || state.status === "complete" || state.status === "paused-approval") return;

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

  state._timer = setTimeout(() => completeTask(sessionId, def), def.durationMs);
}

function completeTask(sessionId, def) {
  const state = sessions.get(sessionId);
  if (!state || state.status === "complete" || state.status === "paused-approval") return;

  const idx = state.tasks.findIndex((task) => task.id === def.id);
  if (idx < 0 || state.tasks[idx].status !== "in-progress") return;

  state.tasks[idx].status = "complete";
  pushLog(state, `Completed: ${def.name}`, "task-complete");
  computeProgress(state);

  if (def.triggersAdaptation) {
    runAdaptation(state);
    // Hold the adapted state long enough for the UI/presentation mode to show
    // the Observe → Adapt evidence before the next task starts.
    state._timer = setTimeout(() => advance(sessionId), 1800);
    return;
  }

  if (def.sensitiveAfter) {
    requestApproval(sessionId, def.sensitiveAfter);
    return;
  }

  advance(sessionId);
}

function runAdaptation(state) {
  state.stage = "observe";
  pushLog(
    state,
    `Machine Learning performance is ${state.metrics["Machine Learning"]}%, below the ${TARGET_SCORE}% target.`,
    "observation"
  );
  pushLog(state, "Agent detected a performance gap.", "observation");
  pushLog(state, "Reallocating study time.", "adaptation");

  state.stage = "adapt";
  const adaptation = {
    time: nowStamp(),
    message: "Machine Learning moved to top priority.",
    detail: "Machine Learning allocation increased from 20% to 45% of remaining study time.",
    from: 20,
    to: 45,
    target: TARGET_SCORE,
    observed: state.metrics["Machine Learning"],
  };
  state.adaptations.push(adaptation);
  pushLog(state, "Machine Learning allocation increased from 20% to 45%.", "adaptation");
  pushLog(state, "Plan reprioritized: Machine Learning moved to top priority.", "adaptation");
}

function requestApproval(sessionId, sensitive) {
  const state = sessions.get(sessionId);
  if (!state || state.pendingApproval) return;

  state.status = "paused-approval";
  state.stage = "act";
  state.pendingApproval = {
    id: sensitive.id,
    label: sensitive.label,
    message: sensitive.message,
    requestedAt: nowStamp(),
  };
  state.sensitiveAction = {
    id: sensitive.id,
    action: sensitive.auditAction,
    outcome: "Pending approval",
  };

  pushLog(state, `Human Approval Required: ${sensitive.label}`, "approval-request");
  addAudit(state, sensitive.auditAction, "Pending approval", true);
}

function resolveApproval(sessionId, approved) {
  const state = sessions.get(sessionId);
  if (!state || !state.pendingApproval || state.status !== "paused-approval") return null;

  const sensitive = state.pendingApproval;
  const auditAction = sensitive.id === "email_reminder" ? "Send study reminder email" : sensitive.id;

  // Clear the gate before continuing so a second request cannot resolve it twice.
  state.pendingApproval = null;
  state.status = "running";

  if (approved) {
    state.sensitiveAction = { id: sensitive.id, action: auditAction, outcome: "Approved — simulated only" };
    pushLog(state, `Approved by human: ${sensitive.label}`, "approval-granted");
    pushLog(state, "Simulated action approved. No real external action was performed.", "approval-granted");
    updateAudit(state, auditAction, "Approved");
  } else {
    state.sensitiveAction = { id: sensitive.id, action: auditAction, outcome: "Rejected — not executed" };
    pushLog(state, `Rejected by human: ${sensitive.label}`, "approval-denied");
    pushLog(state, "Sensitive action was not executed. Workflow continues safely.", "approval-denied");
    updateAudit(state, auditAction, "Rejected");
  }

  advance(sessionId);
  return getStatus(sessionId);
}

function finish(state) {
  state.status = "complete";
  state.stage = "result";
  state.progress = 100;
  state.finishedAt = Date.now();

  const elapsedSec = Math.round((state.finishedAt - state.startedAt) / 1000);
  const sensitiveOutcome = state.sensitiveAction?.outcome || "Not reached";

  state.result = {
    summary: "Personalized Data Science exam prep plan generated and prioritized around the weakest topic.",
    studyPlan: [
      { topic: "Machine Learning", allocation: "45%", note: "Reprioritized after low practice score (40%)" },
      { topic: "Statistics", allocation: "20%", note: "Light review — strong performance (85%)" },
      { topic: "Python", allocation: "35%", note: "Targeted practice (70%)" },
    ],
    performance: { ...state.metrics },
    targetScore: TARGET_SCORE,
    tasksCompleted: state.tasks.length,
    adaptationsMade: state.adaptations.length,
    sensitiveActionOutcome: sensitiveOutcome,
    timeSavedEstimate: "~2.5 hours",
    timeSavedNote: "Prototype estimate based on simulated manual planning time.",
    elapsedSeconds: elapsedSec,
  };

  pushLog(state, "Final study plan ready. Autonomous run complete.", "result");
}

function startAgent(goal, demoMode) {
  const sessionId = randomUUID();
  const state = freshState(goal, demoMode);
  sessions.set(sessionId, state);

  pushLog(state, `Goal received: "${goal}"`, "start");
  pushLog(state, "Interpreting goal and checking simulated memory for prior context...", "understand");
  computeProgress(state);
  state._timer = setTimeout(() => {
    const current = sessions.get(sessionId);
    if (!current || current.status !== "running") return;
    current.stage = "plan";
    pushLog(current, "Building task plan...", "plan");
    current._timer = setTimeout(() => advance(sessionId), 800);
  }, 700);

  return sessionId;
}

function getStatus(sessionId) {
  const state = sessions.get(sessionId);
  if (!state) return null;
  const { _timer, ...publicState } = state;
  return publicState;
}

function approveAction(sessionId, approved) {
  return resolveApproval(sessionId, approved);
}

function resetSession(sessionId) {
  const state = sessions.get(sessionId);
  if (state?._timer) clearTimeout(state._timer);
  sessions.delete(sessionId);
}

module.exports = { startAgent, getStatus, approveAction, resetSession };
