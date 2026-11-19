import React from 'react';
import { Settings, User, Database, RotateCcw, ShieldCheck, KeyRound } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-400" />
          Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage targets, view Supabase connectivity, and maintain your 42-day curriculum
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <User className="h-4 w-4 text-indigo-400" />
          Learner Profile
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Display Name</label>
            <input
              type="text"
              defaultValue="Learner"
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Daily Study Target (minutes)</label>
            <input
              type="number"
              defaultValue={120}
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Supabase Connection Status */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <Database className="h-4 w-4 text-emerald-400" />
          Supabase Connection Diagnostics
        </h2>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle p-3 text-xs">
            <span className="text-slate-300">Database Engine</span>
            <span className="font-mono text-emerald-400 font-semibold">PostgreSQL (Supabase)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle p-3 text-xs">
            <span className="text-slate-300">Security Model</span>
            <span className="font-mono text-emerald-400 font-semibold">Row-Level Security (RLS) Active</span>
          </div>
        </div>
      </div>

      {/* Curriculum Reseed / Repair */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <RotateCcw className="h-4 w-4 text-amber-400" />
          Curriculum Maintenance
        </h2>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold text-white">Repair / Sync 42-Day Curriculum</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Safely inserts any missing days or tasks without overwriting your existing completion progress.
            </p>
          </div>
          <button
            onClick={() => alert('Curriculum sync will run via Supabase RPC in Phase 3.')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Sync Curriculum
          </button>
        </div>
      </div>
    </div>
  );
}
