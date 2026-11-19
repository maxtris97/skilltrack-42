import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Code2,
  Plus,
  Target,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Layers,
  Flame,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchDsaProblems,
  createDsaProblem,
  updateDsaProblem,
  deleteDsaProblem,
  quickUpdateDsaStatus,
  getDsaMetrics,
  DSA_TOPICS,
  DSA_PATTERNS,
} from '../services/dsaService';
import DsaProblemCard from '../components/dsa/DsaProblemCard';
import DsaModal from '../components/dsa/DsaModal';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import ProgressBar from '../components/common/ProgressBar';

export default function DsaPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('solved_date');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProblems = useCallback(
    async (showRefresh = false) => {
      if (!user) return;
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const { data, error } = await fetchDsaProblems(user.id);
        if (error) throw new Error(error);
        setProblems(data || []);
      } catch (err) {
        console.error('Failed to load DSA problems:', err);
        setFeedback({ text: 'Failed to load DSA problems.', type: 'error' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  const metrics = useMemo(() => {
    return getDsaMetrics(problems);
  }, [problems]);

  // Filtered and Sorted Problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (p.problem_name || '').toLowerCase().includes(q);
          const matchTopic = (p.topic || '').toLowerCase().includes(q);
          const matchPattern = (p.pattern || '').toLowerCase().includes(q);
          const matchApproach = (p.optimized_approach || '').toLowerCase().includes(q);
          const matchBrute = (p.brute_force_approach || '').toLowerCase().includes(q);
          const matchMistakes = (p.mistakes || '').toLowerCase().includes(q);
          if (!matchName && !matchTopic && !matchPattern && !matchApproach && !matchBrute && !matchMistakes) {
            return false;
          }
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (p.status !== statusFilter) return false;
        }

        // Difficulty filter
        if (difficultyFilter !== 'all') {
          if (p.difficulty !== difficultyFilter) return false;
        }

        // Topic filter
        if (topicFilter !== 'all') {
          if (p.topic !== topicFilter) return false;
        }

        // Language filter
        if (languageFilter !== 'all') {
          if (p.language !== languageFilter && p.language !== 'Both') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'solved_date') {
          if (!a.solved_date) return 1;
          if (!b.solved_date) return -1;
          return b.solved_date.localeCompare(a.solved_date);
        }
        if (sortBy === 'difficulty_asc') {
          const weight = { Easy: 1, Medium: 2, Hard: 3 };
          return (weight[a.difficulty] || 0) - (weight[b.difficulty] || 0);
        }
        if (sortBy === 'difficulty_desc') {
          const weight = { Easy: 1, Medium: 2, Hard: 3 };
          return (weight[b.difficulty] || 0) - (weight[a.difficulty] || 0);
        }
        if (sortBy === 'name') {
          return a.problem_name.localeCompare(b.problem_name);
        }
        // Default: updated_at desc
        return (b.updated_at || '').localeCompare(a.updated_at || '');
      });
  }, [problems, searchQuery, statusFilter, difficultyFilter, topicFilter, languageFilter, sortBy]);

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedProblem(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleOpenEdit = (problem) => {
    setSelectedProblem(problem);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleOpenDelete = (problem) => {
    setProblemToDelete(problem);
    setDeleteModalOpen(true);
  };

  // Submissions
  const handleSaveProblem = async (payload) => {
    setActionLoading(true);
    try {
      if (modalMode === 'create') {
        const { data, error } = await createDsaProblem(user.id, payload);
        if (error) throw new Error(error);
        setProblems((prev) => [data, ...prev]);
        setFeedback({ text: `Logged "${payload.problem_name}" successfully!`, type: 'success' });
      } else {
        const { data, error } = await updateDsaProblem(selectedProblem.id, payload);
        if (error) throw new Error(error);
        setProblems((prev) =>
          prev.map((p) => (p.id === selectedProblem.id ? { ...p, ...data } : p))
        );
        setFeedback({ text: `Updated "${payload.problem_name}" successfully!`, type: 'success' });
      }
      setModalOpen(false);
      setTimeout(() => setFeedback({ text: '', type: '' }), 3500);
    } catch (err) {
      console.error('Error saving problem:', err);
      setFeedback({ text: err.message || 'Failed to save DSA problem.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (problemId, newStatus) => {
    try {
      const { data, error } = await quickUpdateDsaStatus(problemId, newStatus);
      if (error) throw new Error(error);

      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, ...data } : p))
      );
      setFeedback({ text: `Updated status to "${newStatus}".`, type: 'success' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setFeedback({ text: 'Failed to update problem status.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;
    setActionLoading(true);
    try {
      const { error } = await deleteDsaProblem(problemToDelete.id);
      if (error) throw new Error(error);

      setProblems((prev) => prev.filter((p) => p.id !== problemToDelete.id));
      setDeleteModalOpen(false);
      setFeedback({ text: `Deleted "${problemToDelete.problem_name}".`, type: 'success' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error deleting problem:', err);
      setFeedback({ text: err.message || 'Failed to delete problem.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    } finally {
      setActionLoading(false);
    }
  };

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
            <Code2 className="h-6 w-6 text-emerald-400" />
            DSA Problem Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Target: 50 Problems • Stretch Goal: 70 Problems • Java (Primary) & Python
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadProblems(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50"
            title="Refresh problems"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Log DSA Problem</span>
          </button>
        </div>
      </div>

      {/* Target Progress Banner */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Primary Goal: 50 Solved Problems
              </h2>
              <p className="text-xs text-slate-400">
                <strong className="text-emerald-400 font-mono">{metrics.solved}</strong> of{' '}
                <span className="font-mono">50</span> completed ({metrics.target50Progress}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Award className="h-3.5 w-3.5 text-violet-400" />
              Stretch Goal: 70 ({metrics.stretch70Progress}%)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              {metrics.target50Progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          value={metrics.solved}
          max={50}
          color="bg-emerald-500"
          height="h-3"
        />

        {/* Rule reminder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 pt-1 border-t border-surface-border/60">
          <span>
            <strong className="text-slate-300">Strict Metric Rule:</strong> Only problems with status{' '}
            <strong className="text-emerald-400">'Solved'</strong> count toward this goal.
          </span>
          <span>
            Remaining to 50 Target:{' '}
            <strong className="text-white font-mono">{Math.max(0, 50 - metrics.solved)}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'all'
              ? 'border-emerald-500/50 bg-emerald-500/10 shadow-sm'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Logged
            </span>
            <Layers className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{metrics.total}</span>
            <span className="text-xs text-slate-400">Questions</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('Solved')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'Solved'
              ? 'border-emerald-500/60 bg-emerald-500/20 shadow-sm'
              : 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
              Verified Solved
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.solved}
            </span>
            <span className="text-xs text-emerald-400/70">Target counts</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('Needs Revision')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'Needs Revision'
              ? 'border-amber-500/60 bg-amber-500/20 shadow-sm'
              : 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
              Needs Revision
            </span>
            <RotateCcw className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {metrics.needsRevision}
            </span>
            <span className="text-xs text-amber-400/70">Review</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('Attempted')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'Attempted'
              ? 'border-indigo-500/60 bg-indigo-500/20 shadow-sm'
              : 'border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
              Attempted
            </span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-400">
              {metrics.attempted}
            </span>
            <span className="text-xs text-indigo-400/70">In progress</span>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface px-4 py-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-slate-300">Difficulty Breakdown:</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 font-mono">
            Easy: <strong>{metrics.difficulty.Easy}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-400 font-mono">
            Medium: <strong>{metrics.difficulty.Medium}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-rose-400 font-mono">
            Hard: <strong>{metrics.difficulty.Hard}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Languages:</span>
          <span>Java: <strong className="text-amber-400">{metrics.languages.Java}</strong></span>
          <span>Python: <strong className="text-sky-400">{metrics.languages.Python}</strong></span>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-surface-border">
        {[
          { id: 'all', label: 'All Problems', count: metrics.total },
          { id: 'Solved', label: 'Solved (Target Counted)', count: metrics.solved },
          { id: 'Needs Revision', label: 'Needs Revision', count: metrics.needsRevision },
          { id: 'Attempted', label: 'Attempted', count: metrics.attempted },
          { id: 'Not Started', label: 'Not Started', count: metrics.notStarted },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-xl px-3.5 py-2 font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                statusFilter === tab.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-surface-subtle text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-slate-300">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem, pattern, approach..."
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

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs">
          <Flame className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          >
            <option value="all" className="bg-surface text-white">
              All Difficulties
            </option>
            <option value="Easy" className="bg-surface text-emerald-400">
              Easy
            </option>
            <option value="Medium" className="bg-surface text-amber-400">
              Medium
            </option>
            <option value="Hard" className="bg-surface text-rose-400">
              Hard
            </option>
          </select>
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs">
          <Layers className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          >
            <option value="all" className="bg-surface text-white">
              All Topics
            </option>
            {DSA_TOPICS.map((t) => (
              <option key={t} value={t} className="bg-surface text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs">
          <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          >
            <option value="solved_date" className="bg-surface text-white">
              Solved Date (Newest first)
            </option>
            <option value="updated_at" className="bg-surface text-white">
              Recently Updated
            </option>
            <option value="difficulty_asc" className="bg-surface text-white">
              Difficulty (Easy to Hard)
            </option>
            <option value="difficulty_desc" className="bg-surface text-white">
              Difficulty (Hard to Easy)
            </option>
            <option value="name" className="bg-surface text-white">
              Problem Name (A-Z)
            </option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-surface-border bg-surface-subtle/50 p-5"
            />
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <EmptyState
          title={
            searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all'
              ? 'No DSA problems match your filter'
              : 'No DSA problems logged yet'
          }
          description={
            searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all'
              ? 'Try clearing your search query or switching your status/difficulty filters.'
              : 'Start logging your LeetCode questions, patterns, complexities, and mistakes to track progress toward your 50 problem goal!'
          }
          actionLabel={
            searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all'
              ? 'Reset All Filters'
              : 'Log First Problem'
          }
          icon={Code2}
          onAction={
            searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all'
              ? () => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDifficultyFilter('all');
                  setTopicFilter('all');
                  setLanguageFilter('all');
                }
              : handleOpenCreate
          }
        />
      ) : (
        /* Problem Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProblems.map((prob) => (
            <DsaProblemCard
              key={prob.id}
              problem={prob}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <DsaModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedProblem}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveProblem}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete DSA Problem"
        message={`Are you sure you want to delete "${problemToDelete?.problem_name}"? This action cannot be undone.`}
        confirmText="Delete Problem"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
}
