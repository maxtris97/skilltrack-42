import React, { useState } from 'react';
import { CalendarCheck2, Filter, Plus, ArrowRight, ArrowLeftRight, Clock, FileText } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

const WEEKS = [
  { id: 1, label: 'Week 1: Nov 20–26', title: 'Java & Python Fundamentals' },
  { id: 2, label: 'Week 2: Nov 27–Dec 3', title: 'Methods, Strings, Arrays & OOP' },
  { id: 3, label: 'Week 3: Dec 4–10', title: 'DSA Arrays, Strings & Two Pointers' },
  { id: 4, label: 'Week 4: Dec 11–17', title: 'Searching, Sorting & Linked Lists' },
  { id: 5, label: 'Week 5: Dec 18–24', title: 'Git, React, Node & Architecture Flow' },
  { id: 6, label: 'Week 6: Dec 25–31', title: 'Databases, Spring Boot & LLD' },
];

export default function PlannerPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-indigo-400" />
            42-Day Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            November 20 – December 31, 2026 • 6-Week Structured Roadmap
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white">
            <ArrowLeftRight className="h-3.5 w-3.5 text-amber-400" />
            Reschedule / Backlog
          </button>
        </div>
      </div>

      {/* Week Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-surface-border">
        {WEEKS.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWeek(w.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedWeek === w.id
                ? 'bg-indigo-600 text-white shadow-glow-indigo'
                : 'bg-surface text-slate-400 hover:bg-surface-elevated hover:text-slate-200 border border-surface-border'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Week Focus Header */}
      <div className="rounded-2xl border border-surface-border bg-surface/60 p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
          Week {selectedWeek} Focus
        </span>
        <h2 className="text-sm font-semibold text-white mt-0.5">
          {WEEKS.find((w) => w.id === selectedWeek)?.title}
        </h2>
      </div>

      {/* Day Cards Placeholder / Empty State */}
      <EmptyState
        title="Curriculum will load here upon Supabase connection"
        description="Connect your Supabase account to seed all 42 days, track tasks, and carry forward pending tasks."
        actionLabel="View Database Schema"
        onAction={() => alert('Supabase schema is available in supabase-schema.sql')}
      />
    </div>
  );
}
