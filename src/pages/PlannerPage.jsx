import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck2,
  Filter,
  Plus,
  ArrowRight,
  ArrowLeftRight,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  checkCurriculumStatus,
  seedCurriculum,
  fetchCurriculumDays,
  toggleTaskCompletion,
} from '../services/curriculumService';
import StatusBadge from '../components/common/StatusBadge';
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
  const { user, isConfigured } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [curriculumStatus, setCurriculumStatus] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackErr, setFeedbackErr] = useState('');
  const [expandedDayId, setExpandedDayId] = useState(null);

  const loadCurriculum = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const status = await checkCurriculumStatus(user.id);
      setCurriculumStatus(status);

      if (status.hasCurriculum || status.isPartial) {
        const { data } = await fetchCurriculumDays(user.id, selectedWeek);
        setDays(data || []);
        if (data && data.length > 0 && !expandedDayId) {
          setExpandedDayId(data[0].id);
        }
      } else {
        setDays([]);
      }
    } catch (err) {
      console.error('Failed to load curriculum:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedWeek]);

  useEffect(() => {
    loadCurriculum();
  }, [loadCurriculum]);

  const handleSeed = async () => {
    if (!user) return;
    setSeeding(true);
    setFeedbackMsg('');
    setFeedbackErr('');

    try {
      const res = await seedCurriculum(user.id);
      if (res.success) {
        setFeedbackMsg(
          `Curriculum synced successfully! Days inserted: ${res.daysInserted}, Tasks inserted: ${res.tasksInserted} (${res.daysExisting} days already existed).`
        );
        await loadCurriculum();
      } else {
        setFeedbackErr(res.error || 'Failed to seed curriculum.');
      }
    } catch (err) {
      setFeedbackErr(err.message || 'Seeding error');
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setDays((prevDays) =>
      prevDays.map((d) => ({
        ...d,
        learning_tasks: (d.learning_tasks || []).map((t) =>
          t.id === taskId
            ? { ...t, is_completed: newStatus, task_status: newStatus ? 'Completed' : 'Not Started' }
            : t
        ),
      }))
    );

    const { error } = await toggleTaskCompletion(taskId, newStatus);
    if (error) {
      // Revert on failure
      loadCurriculum();
    }
  };

  const currentWeekInfo = WEEKS.find((w) => w.id === selectedWeek);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-indigo-400" />
            42-Day Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            November 20 – December 31, 2026 • 6-Week Structured Syllabus
          </p>
        </div>

        {/* Sync/Init Actions */}
        <div className="flex items-center gap-2">
          {curriculumStatus?.hasCurriculum ? (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white disabled:opacity-50 cursor-pointer"
              title="Ensure all 42 days and tasks exist without overwriting progress"
            >
              {seeding ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Sync Syllabus</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSeed}
              disabled={seeding || !isConfigured}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-indigo hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {seeding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Initializing Curriculum...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Initialize 42-Day Curriculum</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alerts */}
      {feedbackMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {feedbackErr && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{feedbackErr}</span>
        </div>
      )}

      {/* Week Selector Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-surface-border">
        {WEEKS.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWeek(w.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedWeek === w.id
                ? 'bg-indigo-600 text-white shadow-glow-indigo'
                : 'bg-surface text-slate-400 hover:bg-surface-elevated hover:text-slate-200 border border-surface-border'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Week Theme Header */}
      <div className="rounded-2xl border border-surface-border bg-surface/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Week {selectedWeek} Curriculum Focus
          </span>
          <h2 className="text-sm font-semibold text-white mt-0.5">
            {currentWeekInfo?.title}
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Days {selectedWeek === 1 ? '1 – 7' : selectedWeek === 2 ? '8 – 14' : selectedWeek === 3 ? '15 – 21' : selectedWeek === 4 ? '22 – 28' : selectedWeek === 5 ? '29 – 35' : '36 – 42'}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mb-2" />
          <span className="text-xs">Loading curriculum days...</span>
        </div>
      ) : days.length === 0 ? (
        <EmptyState
          title="Curriculum not yet seeded in your account"
          description="Click below to seed the complete 42-day syllabus into your Supabase database in a single transactional operation."
          actionLabel="Initialize 42-Day Curriculum"
          onAction={handleSeed}
          icon={CalendarCheck2}
        />
      ) : (
        /* Render Days List */
        <div className="space-y-4">
          {days.map((day) => {
            const isExpanded = expandedDayId === day.id;
            const tasks = day.learning_tasks || [];
            const completedCount = tasks.filter((t) => t.is_completed).length;
            const isAllCompleted = tasks.length > 0 && completedCount === tasks.length;

            return (
              <div
                key={day.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  isAllCompleted
                    ? 'border-emerald-500/30 bg-surface/90'
                    : 'border-surface-border bg-surface hover:border-surface-elevated'
                }`}
              >
                {/* Day Header Bar */}
                <div
                  onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold font-mono text-indigo-400">
                      D{day.day_number}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {day.title}
                        </span>
                        {isAllCompleted && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> All Done
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono">{day.study_date}</span>
                        <span>•</span>
                        <span>{day.subject}</span>
                        <span>•</span>
                        <span className="text-slate-500">{tasks.length} tasks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {completedCount} / {tasks.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Day Expanded Task List */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-surface-border/60 mt-2 space-y-3">
                    <div className="mt-3 space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start justify-between rounded-xl border p-3 text-xs transition-colors ${
                            task.is_completed
                              ? 'border-emerald-500/20 bg-emerald-500/5'
                              : 'border-surface-border/60 bg-surface-subtle/70'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={task.is_completed}
                              onChange={() => handleToggleTask(task.id, task.is_completed)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0 pr-3">
                              <span
                                className={`font-semibold block ${
                                  task.is_completed
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-100'
                                }`}
                              >
                                {task.task_title}
                              </span>
                              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                {task.description}
                              </p>
                              {task.is_carried_forward && (
                                <span className="inline-block mt-1 text-[10px] text-amber-400 font-mono">
                                  Rescheduled from {task.original_date}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                              <Clock className="h-3 w-3 text-slate-500" />
                              {task.estimated_minutes}m
                            </span>
                            <StatusBadge
                              status={task.is_completed ? 'Completed' : 'Not Started'}
                              className="text-[10px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
