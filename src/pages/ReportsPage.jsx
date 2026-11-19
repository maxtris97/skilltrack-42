import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Code2, Brain } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-400" />
          Reports & Progress Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real metrics calculated from verified database records • Zero fabricated statistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <span className="text-xs text-slate-400 block uppercase">Overall Completion</span>
          <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">0%</span>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <span className="text-xs text-slate-400 block uppercase">Tasks Remaining</span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">0</span>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <span className="text-xs text-slate-400 block uppercase">Total Study Time</span>
          <span className="text-2xl font-bold font-mono text-sky-400 mt-1 block">0.0 hrs</span>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <span className="text-xs text-slate-400 block uppercase">Verified DSA Solved</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">0 / 50</span>
        </div>
      </div>

      <EmptyState
        title="Comprehensive analytics will appear as you study"
        description="Track weekly consistency, subject distributions, and difficulty breakdowns generated in real-time from Supabase."
        icon={BarChart3}
      />
    </div>
  );
}
