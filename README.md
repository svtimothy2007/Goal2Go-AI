# Goal2Go AI

**A conceptual and functional prototype demonstrating the workflow of an autonomous AI productivity agent, built for an Ideathon presentation.**

This is a proof-of-concept. The agent's "intelligence" is demonstrated through its **workflow** (goal → plan → tools → act → observe → adapt → result), not through real AI reasoning. All behavior is scripted in the backend and runs **entirely offline** — no external APIs, no API keys, no internet connection required.

---

## 1. What this demonstrates

| Traditional AI Assistant | Autonomous AI Agent (this prototype) |
|---|---|
| User → Prompt → AI → Answer | User → Goal → Understand → Plan → Use Tools → Act → Observe → Adapt → Result |
| Single-turn, reactive | Multi-step, self-directed, monitors its own progress |
| No memory of context | Uses a memory panel of prior progress & preferences |
| No autonomy checks | Pauses for **human approval** before sensitive actions |

The demo scenario: **"Prepare me for my Data Science exam tomorrow."**

---

## 2. Project structure

```
goal2go-ai/
├── backend/                  Express API + agent simulation engine
│   ├── server.js             Routes: start-agent, get-status, approve-action, reset
│   ├── agentSimulation.js    The scripted "understand→plan→act→observe→adapt" state machine
│   └── package.json
├── frontend/                 React + Vite + Tailwind dashboard
│   ├── src/
│   │   ├── components/       Card, Button, ProgressBar, ActivityLog, TaskList,
│   │   │                     AgentPipeline, ApprovalPanel, AuditLog, MemoryPanel,
│   │   │                     MetricsChart, ResultSummary, Dashboard, PresentationView...
│   │   ├── context/AgentContext.jsx   App state, polling, demo/presentation modes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── package.json              Convenience root scripts (runs both servers together)
└── README.md
```

---

## 3. Setup (one-time)

You need **Node.js 18+** installed. Then, from the `goal2go-ai/` root folder:

```bash
npm install
npm run install:all
```

This installs the root convenience tooling plus the backend and frontend dependencies.

---

## 4. Running the app

**Option A — one command (recommended):**

```bash
npm run dev
```

This starts the backend (`http://localhost:5050`) and frontend (`http://localhost:5173`) together. Your browser should open automatically to `http://localhost:5173`.

**Option B — two terminals (if you prefer, or if `concurrently` isn't available):**

```bash
# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

> The backend must be running for the dashboard to work — the frontend polls it for live agent state. If you see a connection error banner in the UI, double check the backend terminal is still running on port 5050.

---

## 5. How to present in 60–90 seconds

1. Open the app — you'll land on the goal screen with the positioning statement and two options: type a goal, or click **Demo Mode**.
2. Click **Demo Mode**. This auto-fills the goal ("Prepare me for my Data Science exam tomorrow.") and starts the agent with no further clicks needed.
3. Narrate as it runs:
   - **0–5s** — "The agent receives a goal, not a prompt. It interprets the goal and checks its memory for prior context."
   - **5–45s** — Point at the **Task Plan** card: tasks execute one by one (Analyze syllabus → Identify weak areas → Create study schedule → Generate notes...). Point at the **Activity Log** for real-time reasoning-level updates, and the **Agent Architecture** panel on the right — the pipeline node lights up as the agent moves through stages.
   - **~mid-run** — A **Human Approval** card appears: "Simulated Action: Send Study Reminder Email" Explain: *"Autonomous doesn't mean uncontrolled — sensitive actions always need a human in the loop."* Demo Mode never auto-approves. The presenter must explicitly choose Approve or Reject.
   - **~50–60s** — Point at the **Performance Metrics** chart: Machine Learning is at 40%, below the 60% target line. The **Activity Log** shows the agent noticing this and reprioritizing — "Machine Learning performance below target. Reallocating study time." This is the **Observe → Adapt** loop, the core of autonomy.
   - **60–90s** — The **Final Result** card appears: a reprioritized study plan, tasks completed, adaptations made, and estimated time saved.
4. Optionally click **Presentation Mode** beforehand (top right) to switch to a large-font, judge-friendly view with a simplified `GOAL → PLAN → ACT → OBSERVE → ADAPT → RESULT` flow and hidden secondary UI — ideal when projecting.
5. Click **Reset** to run it again for the next judge.

---

## 6. Key UI elements to point out

- **Status indicator** — Running / Paused (awaiting approval) / Complete.
- **Task list** — ✓ complete, spinner = in progress, ○ pending.
- **Activity log** — timestamped, high-level actions only (e.g., "Analyzing user goal..."). Internal chain-of-thought is intentionally never exposed — only safe, user-facing status.
- **Tools used** — Study Resource Search, Calendar, Notes Generator, Quiz Generator, Progress Analyzer, File Organizer — highlights the tool the current task is using.
- **Memory panel** — simulated user preferences and prior progress (clearly labeled as simulated).
- **Human approval + Audit Log** — every sensitive action is gated and logged with time/status/approval-required.
- **Agent Architecture diagram** — static pipeline (`USER → GOAL INTERPRETER → PLANNER → MEMORY → TOOL SELECTOR → ACTION EXECUTOR → OBSERVATION → ADAPTATION → RESULT`) with `HUMAN APPROVAL` connected to the action stage; the current stage highlights as the agent runs.

---

## 7. API reference (backend)

| Method | Route | Body / Query | Description |
|---|---|---|---|
| POST | `/api/start-agent` | `{ goal, demoMode }` | Starts a new agent run, returns `{ sessionId }` |
| GET | `/api/get-status` | `?sessionId=` | Returns the full current agent state (polled by the frontend) |
| POST | `/api/approve-action` | `{ sessionId, approved }` | Approves or rejects the pending sensitive action |
| POST | `/api/reset` | `{ sessionId }` | Discards a session |

State is stored in-memory per session (a `Map` in `agentSimulation.js`) — this is a prototype, not a production data layer.

---

## 8. Configuration

The frontend uses `VITE_API_BASE` for the backend API base URL. Locally it defaults to `http://localhost:5050/api`. For a deployed frontend, set it to the deployed backend URL ending in `/api`.

## 9. Design notes

- Dark "control-room" aesthetic by default, with a light theme toggle in the header.
- Tailwind CSS for styling, Lucide React for icons, Recharts for the performance-metrics chart.
- All timing (task durations and brief UI pause points) is defined in `backend/agentSimulation.js` and tuned so a full Demo Mode run remains presentation-friendly. Human approval is never automatic.

---

## 10. Positioning statement

> Goal2Go AI is a conceptual and functional prototype demonstrating the workflow of an autonomous AI productivity agent for educational purposes. It does not use real AI/LLM reasoning — every decision, adaptation, and "insight" is scripted to illustrate what an autonomous agent's workflow looks and feels like, for an Ideathon audience.


## Ideathon demo note

The prototype is intentionally deterministic and does not expose hidden chain-of-thought reasoning. It demonstrates the visible agent lifecycle: goal understanding, planning, tool use, action, observation, adaptation, and result.

### Human-in-the-loop
Sensitive actions are **never auto-approved**, including in Demo Mode. The agent pauses and waits for the presenter/user to choose **Approve** or **Reject**. This is intentional and demonstrates the principle: **Autonomous does not mean uncontrolled.**

### Suggested 60–90 second demo
1. Start Demo Mode.
2. Let the agent move through Goal → Plan → Act.
3. Point out the activity log and tool usage.
4. When Machine Learning performance is detected as low, highlight the Observe → Adapt step.
5. When the approval gate appears, click **Approve** yourself.
6. Let the run finish and show the final result/audit log.
