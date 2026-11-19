import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  Clock,
  Code2,
  Brain,
  ListTodo,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../services/dashboardService';
import { toggleTaskCompletion } from '../services/curriculumService';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';

export default function DashboardPage() {
  const { user, isConfigured } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const loadDashboard = useCallback(
    async (showRefreshIndicator = false) => {
      if (!user) return;
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      try {
        const data = await fetchDashboardData(user.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setFeedback({ text: 'Failed to load live dashboard data.', type: 'error' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Handle task completion toggle directly from Today's Focus
  const handleToggleTask = async (task) => {
    if (!task || !dashboardData?.todayFocus) return;

    const newCompleted = !task.is_completed;
    const previousTodayFocus = { ...dashboardData.todayFocus };
    const previousPending = dashboardData.pendingTasks;
    const previousCompleted = dashboardData.completedCurriculumTasks;

    // Optimistic UI update
    const updatedTasks = dashboardData.todayFocus.tasks.map((t) =>
      t.id === task.id
        ? {
            ...t,
            is_completed: newCompleted,
            task_status: newCompleted ? 'Completed' : 'Not Started',
          }
        : t
    );

    const delta = newCompleted ? 1 : -1;
    const newCompletedTasks = previousCompleted + delta;
    const newPendingTasks = Math.max(0, previousPending - delta);
    const newOverallProgress =
      dashboardData.totalCurriculumTasks > 0
        ? Math.round((newCompletedTasks / dashboardData.totalCurriculumTasks) * 100)
        : 0;

    setDashboardData((prev) => ({
      ...prev,
      todayFocus: {
        ...prev.todayFocus,
        tasks: updatedTasks,
      },
      completedCurriculumTasks: newCompletedTasks,
      pendingTasks: newPendingTasks,
      overallProgress: newOverallProgress,
    }));

    try {
      const { error } = await toggleTaskCompletion(task.id, newCompleted);
      if (error) throw error;
      setFeedback({
        text: newCompleted ? `Task completed!` : `Task marked uncompleted.`,
        type: 'success',
      });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error toggling task:', err);
      // Revert optimistic update
      setDashboardData((prev) => ({
        ...prev,
        todayFocus: previousTodayFocus,
        completedCurriculumTasks: previousCompleted,
        pendingTasks: previousPending,
      }));
      setFeedback({
        text: 'Failed to update task status in database.',
        type: 'error',
      });
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    }
  };

  const getSubjectColor = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('java')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (s.includes('python')) return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    if (s.includes('dsa') || s.includes('algorithm')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s.includes('stack') || s.includes('react') || s.includes('node')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (s.includes('sql') || s.includes('database')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (s.includes('spring') || s.includes('design') || s.includes('lld')) return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getSubjectProgressColor = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('java')) return 'bg-amber-500';
    if (s.includes('python')) return 'bg-sky-500';
    if (s.includes('dsa') || s.includes('algorithm')) return 'bg-emerald-500';
    if (s.includes('stack') || s.includes('react') || s.includes('node')) return 'bg-indigo-500';
    if (s.includes('sql') || s.includes('database')) return 'bg-rose-500';
    if (s.includes('spring') || s.includes('design') || s.includes('lld')) return 'bg-purple-500';
    return 'bg-slate-400';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-72 bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800/60 rounded-2xl border border-surface-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-72 bg-slate-800/50 rounded-2xl border border-surface-border" />
          <div className="h-72 bg-slate-800/50 rounded-2xl border border-surface-border" />
        </div>
      </div>
    );
  }

  const todayFocus = dashboardData?.todayFocus;
  const todayTasks = todayFocus?.tasks || [];
  const completedTodayTasks = todayTasks.filter((t) => t.is_completed).length;
  const totalTodayEstimated = todayTasks.reduce((acc, t) => acc + (t.estimated_minutes || 0), 0);

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback.text && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium border ${
            feedback.type === 'error'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

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
          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50"
            title="Refresh live metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Supabase Data
          </span>
        </div>
      </div>

      {/* Curriculum Not Initialized Notice */}
      {!dashboardData?.hasData && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-white">Curriculum Not Yet Seeded</h2>
              <p className="text-xs text-indigo-300/90 mt-0.5">
                Initialize your complete 42-day curriculum roadmap to begin tracking your daily tasks and study progress.
              </p>
            </div>
          </div>
          <Link
            to="/planner"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shrink-0"
          >
            Go to 42-Day Planner
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Days Completed"
          value={`${dashboardData?.completedDays || 0} / ${dashboardData?.totalDays || 42}`}
          subtitle="Target: 42 Days"
          icon={CalendarCheck2}
          accentColor="text-indigo-400"
          bgColor="bg-indigo-500/10"
          borderColor="border-indigo-500/20"
        />
        <StatCard
          title="Study Hours"
          value={`${dashboardData?.studyHours || '0.0'} hrs`}
          subtitle="Real logged time"
          icon={Clock}
          accentColor="text-sky-400"
          bgColor="bg-sky-500/10"
          borderColor="border-sky-500/20"
        />
        <StatCard
          title="DSA Solved"
          value={`${dashboardData?.dsaSolved || 0}`}
          subtitle="Target: 50 | Stretch: 70"
          icon={Code2}
          accentColor="text-emerald-400"
          bgColor="bg-emerald-500/10"
          borderColor="border-emerald-500/20"
        />
        <StatCard
          title="Confident Topics"
          value={`${dashboardData?.confidentTopicsCount || 0}`}
          subtitle={`${dashboardData?.totalTopicsTracked || 0} evaluated • ${dashboardData?.needsPracticeCount || 0} weak`}
          icon={Brain}
          accentColor="text-violet-400"
          bgColor="bg-violet-500/10"
          borderColor="border-violet-500/20"
        />
        <StatCard
          title="Pending Tasks"
          value={`${dashboardData?.pendingTasks || 0}`}
          subtitle={`Backlog: ${dashboardData?.backlogCount || 0}`}
          icon={ListTodo}
          accentColor="text-amber-400"
          bgColor="bg-amber-500/10"
          borderColor="border-amber-500/20"
        />
      </div>

      {/* Main Grid: Today's Focus & Overall Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Focus Card */}
        <div className="lg:col-span-2 rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Today's Focus
                  </span>
                  {todayFocus && (
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      Day {todayFocus.day_number}
                    </span>
                  )}
                  {todayFocus?.isUpcoming && (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      Preview (Starts Nov 20)
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-white mt-1">
                  {todayFocus?.title || 'No learning day scheduled for today'}
                </h2>
                {todayFocus?.study_date && (
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Scheduled Date: {todayFocus.study_date}
                  </p>
                )}
              </div>
              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-surface-subtle px-2.5 py-1 rounded-lg border border-surface-border">
                  <Clock className="h-3 w-3 text-indigo-400" />
                  Est. {totalTodayEstimated} mins
                </span>
              </div>
            </div>

            {/* Today's Tasks checklist */}
            <div className="mt-4 space-y-2.5">
              {todayTasks.length === 0 ? (
                <div className="rounded-xl border border-surface-border/60 bg-surface-subtle/40 p-6 text-center text-xs text-slate-400">
                  <BookOpen className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                  No tasks assigned to today. You can add custom tasks in the Planner.
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 text-xs transition-colors ${
                      task.is_completed
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-surface-border/60 bg-surface-subtle/70 hover:border-surface-border'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          task.is_completed
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                            : 'border-slate-600 bg-slate-800 hover:border-slate-400'
                        }`}
                        title={task.is_completed ? 'Mark incomplete' : 'Mark completed'}
                      >
                        {task.is_completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-medium ${
                              task.is_completed
                                ? 'text-slate-400 line-through'
                                : 'text-slate-200'
                            }`}
                          >
                            {task.task_title}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.2 text-[9px] font-medium uppercase tracking-wider ${getSubjectColor(
                              task.subject
                            )}`}
                          >
                            {task.subject}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {task.estimated_minutes}m
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-surface-border/60 text-xs gap-3">
            <span className="text-slate-400">
              <strong className="text-white font-mono">{completedTodayTasks}</strong> of{' '}
              <strong className="text-white font-mono">{todayTasks.length}</strong> tasks completed
            </span>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Open 42-Day Planner <ArrowRight className="h-3.5 w-3.5" />
            </Link>
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
                  <span className="text-indigo-400 font-mono">
                    {dashboardData?.overallProgress || 0}%
                  </span>
                </div>
                <ProgressBar
                  value={dashboardData?.overallProgress || 0}
                  max={100}
                  color="bg-indigo-500"
                  height="h-2.5"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>
                    {dashboardData?.completedCurriculumTasks || 0} tasks finished
                  </span>
                  <span>{dashboardData?.totalCurriculumTasks || 0} total</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300">DSA 50 Target</span>
                  <span className="text-emerald-400 font-mono">
                    {dashboardData?.dsaSolved || 0} / 50
                  </span>
                </div>
                <ProgressBar
                  value={dashboardData?.dsaSolved || 0}
                  max={50}
                  color="bg-emerald-500"
                  height="h-2"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Stretch Goal: 70</span>
                  <span>
                    {Math.min(
                      100,
                      Math.round(((dashboardData?.dsaSolved || 0) / 50) * 100)
                    )}
                    % of target
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-surface-border/80 bg-surface-subtle p-3.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">Strict Metric Rule:</span>
            Only problems marked <strong className="text-emerald-400 font-medium">Solved</strong> count toward your targets. Attempted and Needs Revision are tracked separately.
          </div>
        </div>
      </div>

      {/* Topic Understanding & Revision Snapshot (Phase 5) */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-400" />
              Topic Understanding & Revision Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Honest self-assessments independent of task completion.
            </p>
          </div>
          <Link
            to="/topics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Open Topic Tracker <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/topics?filter=all"
            className="rounded-xl border border-surface-border bg-surface-subtle/60 p-3.5 hover:border-violet-500/40 transition-colors"
          >
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Topics Tracked</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {dashboardData?.totalTopicsTracked || 0}
            </span>
          </Link>

          <Link
            to="/topics?filter=confident"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 hover:border-emerald-500/40 transition-colors"
          >
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider block">Confident (Rating 4-5)</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {dashboardData?.confidentTopicsCount || 0}
            </span>
          </Link>

          <Link
            to="/topics?filter=needs_practice"
            className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 hover:border-amber-500/40 transition-colors"
          >
            <span className="text-[11px] text-amber-400 uppercase tracking-wider block">Needs Practice</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              {dashboardData?.needsPracticeCount || 0}
            </span>
          </Link>

          <Link
            to="/topics?filter=due"
            className={`rounded-xl border p-3.5 transition-colors ${
              (dashboardData?.dueRevisionCount || 0) > 0
                ? 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50'
                : 'border-surface-border bg-surface-subtle/60 hover:border-surface-elevated'
            }`}
          >
            <span className="text-[11px] text-rose-400 uppercase tracking-wider block">Due for Revision</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
              {dashboardData?.dueRevisionCount || 0}
            </span>
            {(dashboardData?.overdueRevisionCount || 0) > 0 && (
              <span className="text-[10px] text-rose-400/80 font-medium">
                {dashboardData.overdueRevisionCount} overdue
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Subject Progress Grid */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Subject Breakdown & Mastery
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Task completion distribution across core technical disciplines.
            </p>
          </div>
        </div>

        {dashboardData?.subjectBreakdown && dashboardData.subjectBreakdown.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.subjectBreakdown.map((item) => (
              <div
                key={item.subject}
                className="rounded-xl border border-surface-border/70 bg-surface-subtle/50 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.subject}</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {item.completed} / {item.total} tasks
                  </span>
                </div>
                <ProgressBar
                  value={item.completed}
                  max={item.total}
                  color={getSubjectProgressColor(item.subject)}
                  height="h-2"
                />
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 p-6 text-center text-xs text-slate-400">
            No subject data available. Once tasks are loaded, progress by technical subject will appear here.
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/study-time"
          className="rounded-xl border border-surface-border bg-surface p-4 text-xs hover:border-sky-500/40 hover:bg-surface-elevated transition-colors group"
        >
          <Clock className="h-5 w-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white">Log Study Time</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Record pomodoro & deep work</p>
        </Link>

        <Link
          to="/dsa"
          className="rounded-xl border border-surface-border bg-surface p-4 text-xs hover:border-emerald-500/40 hover:bg-surface-elevated transition-colors group"
        >
          <Code2 className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white">Log DSA Problem</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Track LeetCode questions</p>
        </Link>

        <Link
          to="/topics"
          className="rounded-xl border border-surface-border bg-surface p-4 text-xs hover:border-violet-500/40 hover:bg-surface-elevated transition-colors group"
        >
          <Brain className="h-5 w-5 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white">Assess Topics</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Rate technical confidence</p>
        </Link>

        <Link
          to="/notes"
          className="rounded-xl border border-surface-border bg-surface p-4 text-xs hover:border-indigo-500/40 hover:bg-surface-elevated transition-colors group"
        >
          <BookOpen className="h-5 w-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white">Study Notes</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Review saved takeaways</p>
        </Link>
      </div>
    </div>
  );
}
