import React from 'react';
import { Clock, Plus, Calendar, TrendingUp } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function StudyTimePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Clock className="h-6 w-6 text-sky-400" />
            Study Time Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Log actual study sessions, reflections, and productivity ratings (1–5)
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500">
          <Plus className="h-4 w-4" />
          Log Study Session
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-border bg-surface p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Study Time</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">0.0 hrs</span>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">This Week</span>
          <span className="text-2xl font-bold font-mono text-sky-400 mt-1 block">0.0 hrs</span>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Average Daily Session</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">0 mins</span>
        </div>
      </div>

      <EmptyState
        title="No study time logged yet"
        description="Record your actual study minutes, reflection on what you built, and a 1–5 productivity rating."
        actionLabel="Log First Session"
        icon={Clock}
        onAction={() => alert('Study log modal will be connected in Phase 7.')}
      />
    </div>
  );
}
