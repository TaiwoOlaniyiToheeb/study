import React, { useState } from "react";
import WeeklyCalendar from "./components/WeeklyCalendar";
import ScheduleExplanation from "./components/ScheduleExplanation";
import LoginForm from "./components/LoginForm";
import { AiStudyScheduleCard } from "./pages/StudyScheduleDashboard";
import StudyScheduleDashboardPage from "./pages/StudyScheduleDashboard";
import { StudySchedule, ScheduledSession } from "./types";
import { mockSchedule, mockSubjects } from "./mockData";

type Mode = "demo" | "live";

export default function App() {
  const [mode, setMode] = useState<Mode>("demo");
  const [authed, setAuthed] = useState<boolean>(() => !!localStorage.getItem("auth_token"));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="font-semibold text-slate-800">AI Study Schedule — Preview</h1>
          <div className="flex items-center gap-3">
            {mode === "live" && authed && (
              <button
                className="text-xs text-slate-500 hover:underline"
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  setAuthed(false);
                }}
              >
                Log out
              </button>
            )}
            <div className="flex gap-1 rounded border border-slate-300 p-0.5 text-sm">
              <button
                className={`rounded px-3 py-1 ${mode === "demo" ? "bg-slate-800 text-white" : "text-slate-600"}`}
                onClick={() => setMode("demo")}
              >
                Demo (mock data)
              </button>
              <button
                className={`rounded px-3 py-1 ${mode === "live" ? "bg-slate-800 text-white" : "text-slate-600"}`}
                onClick={() => setMode("live")}
              >
                Live (calls backend)
              </button>
            </div>
          </div>
        </div>
      </header>

      {mode === "demo" ? (
        <DemoView />
      ) : authed ? (
        <StudyScheduleDashboardPage subjects={mockSubjects} />
      ) : (
        <LoginForm onAuthenticated={() => setAuthed(true)} />
      )}
    </div>
  );
}

/**
 * Renders the calendar/explanation/session-card components against a fixed
 * mock schedule, entirely client-side — no fetch calls, so this works with
 * zero backend setup. Useful for checking the UI/UX before wiring up
 * FastAPI + Postgres + an AI provider key.
 */
function DemoView() {
  const [schedule, setSchedule] = useState<StudySchedule>(mockSchedule);

  function handleComplete(session: ScheduledSession) {
    setSchedule((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === session.id ? { ...s, status: "completed" } : s)),
    }));
  }

  function handleMiss(session: ScheduledSession) {
    setSchedule((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === session.id ? { ...s, status: "missed" } : s)),
    }));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        This view shows a fixed mock schedule with no backend calls, so you can check the UI works
        before setting up FastAPI + Postgres + an AI provider key. Switch to "Live" once the backend
        is running on <code className="rounded bg-amber-100 px-1">localhost:8000</code>.
      </div>

      <AiStudyScheduleCard hasSchedule={true} onOpen={() => {}} />

      <h2 className="text-xl font-bold">Your AI Study Plan</h2>
      <ScheduleExplanation
        overallReasoning={schedule.overall_reasoning}
        sessions={schedule.sessions}
        unscheduled={schedule.unscheduled}
      />
      <WeeklyCalendar sessions={schedule.sessions} onComplete={handleComplete} onMiss={handleMiss} />
    </div>
  );
}
