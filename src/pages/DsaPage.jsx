import React from 'react';
import { Code2, Plus, Target, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function DsaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-emerald-400" />
            DSA Problem Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Target: 50 Problems • Stretch: 70 Problems • Java (Primary) & Python
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500">
          <Plus className="h-4 w-4" />
          Add Solved Problem
        </button>
      </div>

      {/* Target Progress Bar */}
      <div className="rounded-2xl border border-surface-border bg-surface p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Target Progress: 0 of 50 Solved</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">0% Completed</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden border border-surface-border">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '0%' }} />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Strict Metric: Only problems with status <span className="text-emerald-400 font-semibold">'Solved'</span> contribute to this count.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-surface-border bg-surface p-3.5">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Logged</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">0</span>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
          <span className="text-[11px] text-emerald-400 uppercase tracking-wider block">Verified Solved</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">0</span>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5">
          <span className="text-[11px] text-amber-400 uppercase tracking-wider block">Needs Revision</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">0</span>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3.5">
          <span className="text-[11px] text-indigo-400 uppercase tracking-wider block">Attempted</span>
          <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">0</span>
        </div>
      </div>

      <EmptyState
        title="No DSA problems logged yet"
        description="Log your LeetCode questions, brute-force vs optimized approaches, time/space complexities, and mistakes."
        actionLabel="Log First Problem"
        icon={Code2}
        onAction={() => alert('DSA logging modal will be connected in Phase 6.')}
      />
    </div>
  );
}
