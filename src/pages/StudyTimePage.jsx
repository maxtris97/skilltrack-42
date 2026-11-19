import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Clock,
  Plus,
  RefreshCw,
  Search,
  Layers,
  Calendar,
  Star,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  Timer,
  PieChart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchStudyLogs,
  createStudyLog,
  updateStudyLog,
  deleteStudyLog,
  fetchStudyTopicSuggestions,
  getStudyMetrics,
  STUDY_SUBJECTS,
} from '../services/studyService';
import { getIndiaTodayDate, getIndiaFutureDate } from '../services/dashboardService';
import PomodoroTimer from '../components/study/PomodoroTimer';
import StudyLogModal from '../components/study/StudyLogModal';
import StudyLogCard from '../components/study/StudyLogCard';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';

export default function StudyTimePage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  // Filters
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'timer' | 'history'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | '7days' | '30days'
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedLog, setSelectedLog] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const todayIST = useMemo(() => getIndiaTodayDate(), []);

  // Load study logs
  const loadData = useCallback(
    async (showRefresh = false) => {
      if (!user) return;
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const [logsRes, topicsRes] = await Promise.all([
          fetchStudyLogs(user.id),
          fetchStudyTopicSuggestions(user.id),
        ]);

        if (logsRes.error) throw new Error(logsRes.error);
        setLogs(logsRes.data || []);
        setAvailableTopics(topicsRes || []);
      } catch (err) {
        console.error('Failed to load study logs:', err);
        setFeedback({ text: 'Failed to load study time logs.', type: 'error' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Metrics
  const metrics = useMemo(() => {
    return getStudyMetrics(logs, todayIST);
  }, [logs, todayIST]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    const today = getIndiaTodayDate();
    const sevenDaysAgo = getIndiaFutureDate(-7);
    const thirtyDaysAgo = getIndiaFutureDate(-30);

    return logs.filter((log) => {
      // Date Range Filter
      if (dateFilter === 'today' && log.study_date !== today) {
        return false;
      }
      if (dateFilter === '7days' && log.study_date < sevenDaysAgo) {
        return false;
      }
      if (dateFilter === '30days' && log.study_date < thirtyDaysAgo) {
        return false;
      }

      // Subject Filter
      if (subjectFilter !== 'All Subjects' && log.subject !== subjectFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTopic = (log.topic || '').toLowerCase().includes(q);
        const matchSubject = (log.subject || '').toLowerCase().includes(q);
        const matchReflection = (log.reflection || '').toLowerCase().includes(q);
        if (!matchTopic && !matchSubject && !matchReflection) {
          return false;
        }
      }

      return true;
    });
  }, [logs, dateFilter, subjectFilter, searchQuery]);

  // Handlers for Modals
  const handleOpenManualCreate = () => {
    setSelectedLog(null);
    setPrefillData(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleOpenTimerCompleted = (timerData) => {
    setSelectedLog(null);
    setPrefillData({
      ...timerData,
      study_date: todayIST,
    });
    setModalMode('create');
    setModalOpen(true);
  };

  const handleOpenEdit = (log) => {
    setSelectedLog(log);
    setPrefillData(null);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleOpenDelete = (log) => {
    setLogToDelete(log);
    setDeleteModalOpen(true);
  };

  // Submit Handlers
  const handleSaveLog = async (payload) => {
    setActionLoading(true);
    try {
      if (modalMode === 'create') {
        const { data, error } = await createStudyLog(user.id, payload);
        if (error) throw new Error(error);
        setLogs((prev) => [data, ...prev]);
        setFeedback({
          text: `Logged ${payload.duration_minutes} minutes for ${payload.subject} successfully!`,
          type: 'success',
        });
      } else {
        const { data, error } = await updateStudyLog(selectedLog.id, payload);
        if (error) throw new Error(error);
        setLogs((prev) => prev.map((l) => (l.id === selectedLog.id ? { ...l, ...data } : l)));
        setFeedback({ text: 'Updated study session successfully!', type: 'success' });
      }
      setModalOpen(false);
      setTimeout(() => setFeedback({ text: '', type: '' }), 3500);
    } catch (err) {
      console.error('Error saving study log:', err);
      setFeedback({ text: err.message || 'Failed to save study log.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!logToDelete) return;
    setActionLoading(true);
    try {
      const { error } = await deleteStudyLog(logToDelete.id);
      if (error) throw new Error(error);

      setLogs((prev) => prev.filter((l) => l.id !== logToDelete.id));
      setDeleteModalOpen(false);
      setFeedback({ text: 'Deleted study log session.', type: 'success' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error deleting study log:', err);
      setFeedback({ text: err.message || 'Failed to delete study log.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    } finally {
      setActionLoading(false);
    }
  };

  // Today progress towards 3.0 hr daily target
  const dailyTargetHours = 3.0;
  const todayProgressPercent = Math.min(100, Math.round((metrics.todayHours / dailyTargetHours) * 100));

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

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Clock className="h-6 w-6 text-sky-400" />
            Study Time Tracker & Pomodoro
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Log actual learning sessions, monitor deep work flow, and evaluate daily productivity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenManualCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Log Study Session</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Hours */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Study Time
            </span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {metrics.totalHours.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500 font-mono">
            {metrics.totalMinutes} total minutes
          </span>
        </div>

        {/* Today's Study Time */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
              Today's Focus
            </span>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.todayHours.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ {dailyTargetHours} hrs</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${todayProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Average Productivity */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
              Avg Productivity
            </span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {metrics.averageRating ? metrics.averageRating.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 ★</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">
            {metrics.totalSessions} sessions evaluated
          </span>
        </div>

        {/* Sessions Count & Avg Duration */}
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
              Total Sessions
            </span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {metrics.totalSessions}
            </span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-500 font-mono">
            avg {metrics.averageSessionMins} mins / session
          </span>
        </div>
      </div>

      {/* Grid: Pomodoro Focus Timer & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Pomodoro Focus Timer */}
        <div className="lg:col-span-2">
          <PomodoroTimer
            onLogCompletedSession={handleOpenTimerCompleted}
            availableTopics={availableTopics}
          />
        </div>

        {/* Right 1 Col: Subject Distribution Breakdown */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-sky-400" />
                <span>Subject Distribution</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {metrics.totalHours.toFixed(1)} hrs total
              </span>
            </div>

            {/* Subject Bars */}
            <div className="mt-4 space-y-3">
              {metrics.subjectBreakdown.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No study sessions recorded yet. Start a focus session to see your subject breakdown.
                </div>
              ) : (
                metrics.subjectBreakdown.slice(0, 6).map((item) => (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{item.subject}</span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {item.hours.toFixed(1)} hrs ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-surface-border/50 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Daily Goal Target:</span>
            <span className="font-mono text-white font-semibold">{dailyTargetHours} hours / day</span>
          </div>
        </div>
      </div>

      {/* Session History & Logs Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-semibold text-white">Study Session History</h2>
            <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-mono text-slate-400">
              {filteredLogs.length}
            </span>
          </div>

          {/* Quick Date Range Filter */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDateFilter(d.id)}
                className={`rounded-xl px-3 py-1.5 font-medium transition-colors shrink-0 ${
                  dateFilter === d.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-surface-elevated hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls: Search & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search Box */}
          <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-slate-300">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, subjects, reflections..."
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Subject Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-xs"
            >
              <option value="All Subjects" className="bg-surface text-white">
                All Subjects
              </option>
              {STUDY_SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-surface text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logs Grid or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-surface-border bg-surface-subtle/50 p-4"
              />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            title={
              searchQuery || subjectFilter !== 'All Subjects' || dateFilter !== 'all'
                ? 'No study sessions match your filter'
                : 'No study time logged yet'
            }
            description={
              searchQuery || subjectFilter !== 'All Subjects' || dateFilter !== 'all'
                ? 'Try clearing your search query, switching subject, or expanding the date filter.'
                : 'Record your study sessions manually or start a Pomodoro focus block to log your deep work.'
            }
            actionLabel={
              searchQuery || subjectFilter !== 'All Subjects' || dateFilter !== 'all'
                ? 'Reset Filters'
                : 'Log Study Session'
            }
            icon={Clock}
            onAction={
              searchQuery || subjectFilter !== 'All Subjects' || dateFilter !== 'all'
                ? () => {
                    setSearchQuery('');
                    setSubjectFilter('All Subjects');
                    setDateFilter('all');
                  }
                : handleOpenManualCreate
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredLogs.map((log) => (
              <StudyLogCard
                key={log.id}
                log={log}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <StudyLogModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedLog}
        prefillData={prefillData}
        availableTopics={availableTopics}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveLog}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Study Log"
        message="Are you sure you want to delete this study session log? Your total study hours will be updated accordingly."
        confirmText="Delete Session"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
}
