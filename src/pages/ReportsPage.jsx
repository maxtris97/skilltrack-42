import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Code2,
  Brain,
  RefreshCw,
  Target,
  Layers,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../services/dashboardService';
import ProgressBar from '../components/common/ProgressBar';

export default function ReportsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadReportData = useCallback(
    async (showRefresh = false) => {
      if (!user) return;
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      try {
        const dashboardData = await fetchDashboardData(user.id);
        setData(dashboardData);
      } catch (err) {
        console.error('Error loading report analytics:', err);
        setError('Could not fetch latest progress metrics.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const dsaTarget = 50;
  const dsaPercent = data ? Math.min(100, Math.round((data.dsaSolved / dsaTarget) * 100)) : 0;
  const curriculumPercent = data ? data.overallProgress : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            Reports & Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real metrics calculated from verified database records • Zero fabricated statistics
          </p>
        </div>

        <button
          onClick={() => loadReportData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Analytics'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Overall Completion */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Curriculum Progress
            </span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-400">
              {loading ? '—' : `${curriculumPercent}%`}
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500 font-mono">
            {loading ? 'Calculating...' : `${data?.completedCurriculumTasks || 0} / ${data?.totalCurriculumTasks || 0} tasks`}
          </span>
        </div>

        {/* Days Completed */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
              Days Completed
            </span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {loading ? '—' : data?.completedDays || 0}
            </span>
            <span className="text-xs text-slate-400">/ 42 Days</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500 font-mono">
            {loading ? '...' : `${42 - (data?.completedDays || 0)} days remaining`}
          </span>
        </div>

        {/* Total Study Time */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-sky-400 uppercase tracking-wider">
              Total Study Time
            </span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-sky-400">
              {loading ? '—' : data?.studyHours || '0.0'}
            </span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">
            From verified study logs
          </span>
        </div>

        {/* Verified DSA Solved */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
              DSA Solved
            </span>
            <Code2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {loading ? '—' : data?.dsaSolved || 0}
            </span>
            <span className="text-xs text-slate-400">/ 50 Target</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500 font-mono">
            {loading ? '...' : `${dsaPercent}% of target achieved`}
          </span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-Wise Curriculum Coverage */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Subject Progress Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {data?.subjectBreakdown?.length || 0} Subjects
            </span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 rounded bg-surface-subtle" />
                ))}
              </div>
            ) : (data?.subjectBreakdown || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No curriculum tasks found. Use Settings to sync the 42-day curriculum.
              </p>
            ) : (
              data.subjectBreakdown.map((sb) => (
                <div key={sb.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{sb.subject}</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {sb.completed} / {sb.total} tasks ({sb.percentage}%)
                    </span>
                  </div>
                  <ProgressBar
                    progress={sb.percentage}
                    height="h-1.5"
                    color={
                      sb.percentage === 100
                        ? 'bg-emerald-500'
                        : sb.percentage > 50
                        ? 'bg-indigo-500'
                        : 'bg-sky-500'
                    }
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Topic Mastery & Revision Health */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-400" />
              <span>Topic Mastery & Revision Health</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {data?.totalTopicsTracked || 0} Evaluated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block">
                Confident Topics
              </span>
              <span className="text-xl font-bold font-mono text-emerald-300 mt-1 block">
                {loading ? '—' : data?.confidentTopicsCount || 0}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Rated 4★ or 5★
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                Needs Practice
              </span>
              <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">
                {loading ? '—' : data?.needsPracticeCount || 0}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Requires reinforcement
              </span>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 block">
                Overdue Revisions
              </span>
              <span className="text-xl font-bold font-mono text-rose-300 mt-1 block">
                {loading ? '—' : data?.overdueRevisionCount || 0}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Scheduled before today
              </span>
            </div>

            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 block">
                Due Today / Upcoming
              </span>
              <span className="text-xl font-bold font-mono text-sky-300 mt-1 block">
                {loading ? '—' : (data?.dueRevisionCount || 0) + (data?.upcomingRevisionCount || 0)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Active revision schedule
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-subtle p-3 text-xs text-slate-300 flex items-center justify-between">
            <span>Tasks currently in Backlog:</span>
            <span className="font-mono text-amber-400 font-semibold">
              {loading ? '—' : `${data?.backlogCount || 0} tasks`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
