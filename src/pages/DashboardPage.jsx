import React from 'react';
import {
  CalendarCheck2,
  Clock,
  Code2,
  Brain,
  ListTodo,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            SkillTrack <span className="text-indigo-400">42</span> Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Placement & Technical Preparation Tracker • Nov 20 – Dec 31, 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Active Roadmap
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Days Completed"
          value="0 / 42"
          subtitle="Target: 42 Days"
          icon={CalendarCheck2}
          accentColor="text-indigo-400"
          bgColor="bg-indigo-500/10"
          borderColor="border-indigo-500/20"
        />
        <StatCard
          title="Study Hours"
          value="0.0 hrs"
          subtitle="Real logged time"
          icon={Clock}
          accentColor="text-sky-400"
          bgColor="bg-sky-500/10"
          borderColor="border-sky-500/20"
        />
        <StatCard
          title="DSA Solved"
          value="0"
          subtitle="Target: 50 | Stretch: 70"
          icon={Code2}
          accentColor="text-emerald-400"
          bgColor="bg-emerald-500/10"
          borderColor="border-emerald-500/20"
        />
        <StatCard
          title="Confident Topics"
          value="0"
          subtitle="Independently rated"
          icon={Brain}
          accentColor="text-violet-400"
          bgColor="bg-violet-500/10"
          borderColor="border-violet-500/20"
        />
      </div>

      {/* Main Grid: Today's Focus & Overall Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Focus Card */}
        <div className="lg:col-span-2 rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Today's Focus
                </span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  Day 1
                </span>
              </div>
              <h2 className="text-base font-semibold text-white mt-1">
                Java & Python Fundamentals — Variables, Data Types & Memory Model
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Est. 90 mins</span>
            </div>
          </div>

          {/* Today's Tasks checklist placeholder */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle/70 p-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-slate-600 bg-slate-800" />
                <span className="text-slate-200">Install JDK 21 & Python 3.10+ with environment paths</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">30m</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle/70 p-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-slate-600 bg-slate-800" />
                <span className="text-slate-200">Java primitive types vs Python dynamic types memory allocation</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">30m</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle/70 p-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-slate-600 bg-slate-800" />
                <span className="text-slate-200">Type casting, precision limits & Stack vs Heap basics</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">30m</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-surface-border/60 text-xs">
            <span className="text-slate-400">0 of 3 tasks completed</span>
            <button className="inline-flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300">
              Open 42-Day Planner <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Overall Curriculum Progress */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Curriculum Progress
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculated from verified task completions.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300">Total Completion</span>
                  <span className="text-indigo-400 font-mono">0%</span>
                </div>
                <ProgressBar value={0} max={100} color="bg-indigo-500" height="h-2.5" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300">DSA 50 Target</span>
                  <span className="text-emerald-400 font-mono">0 / 50</span>
                </div>
                <ProgressBar value={0} max={50} color="bg-emerald-500" height="h-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-surface-border/80 bg-surface-subtle p-3.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">Strict Metric Rule:</span>
            Only problems marked <strong className="text-emerald-400">Solved</strong> count toward your targets. Attempted and Needs Revision are tracked separately.
          </div>
        </div>
      </div>
    </div>
  );
}
