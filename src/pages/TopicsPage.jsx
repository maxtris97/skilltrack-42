import React from 'react';
import { Brain, Star, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function TopicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-violet-400" />
            Topic Understanding Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Self-assessment ratings (1–5) and knowledge gaps • Strictly independent from task completion
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500">
          <Plus className="h-4 w-4" />
          Assess New Topic
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-surface-border bg-surface p-3.5">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Evaluated</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">0</span>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
          <span className="text-[11px] text-emerald-400 uppercase tracking-wider block">Confident (Rating 4-5)</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">0</span>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5">
          <span className="text-[11px] text-amber-400 uppercase tracking-wider block">Needs Practice</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">0</span>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3.5">
          <span className="text-[11px] text-indigo-400 uppercase tracking-wider block">In Learning</span>
          <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">0</span>
        </div>
      </div>

      <EmptyState
        title="No topics evaluated yet"
        description="Rate your true understanding on a scale of 1–5, record mistakes, identify doubts, and schedule revisions."
        actionLabel="Assess First Topic"
        icon={Brain}
        onAction={() => alert('Topic evaluation modal will be connected in Phase 5.')}
      />
    </div>
  );
}
