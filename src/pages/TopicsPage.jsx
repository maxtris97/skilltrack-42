import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Brain,
  Star,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  quickReviseTopic,
  getTopicRevisionMetrics,
} from '../services/topicService';
import { getIndiaTodayDate } from '../services/dashboardService';

import TopicCard from '../components/topics/TopicCard';
import TopicModal from '../components/topics/TopicModal';
import QuickReviseModal from '../components/topics/QuickReviseModal';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import StatCard from '../components/common/StatCard';

const SUBJECT_OPTIONS = [
  'All Subjects',
  'Java',
  'Python',
  'DSA',
  'Full-Stack',
  'Databases',
  'Spring Boot',
  'System Design',
];

export default function TopicsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'all');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');

  // Modals state
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicModalMode, setTopicModalMode] = useState('create');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [reviseModalOpen, setReviseModalOpen] = useState(false);
  const [topicToRevise, setTopicToRevise] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const today = getIndiaTodayDate();

  const loadTopics = useCallback(
    async (showRefresh = false) => {
      if (!user) return;
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const { data, error } = await fetchTopics(user.id);
        if (error) throw new Error(error);
        setTopics(data || []);
      } catch (err) {
        console.error('Failed to load topics:', err);
        setFeedback({ text: 'Failed to load topic evaluations.', type: 'error' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  // Sync url param if filter prop changes
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter) setStatusFilter(urlFilter);
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  const metrics = useMemo(() => {
    return getTopicRevisionMetrics(topics, today);
  }, [topics, today]);

  // Filtered and Sorted Topics
  const filteredTopics = useMemo(() => {
    return topics
      .filter((t) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTopic = (t.topic || '').toLowerCase().includes(q);
          const matchSubject = (t.subject || '').toLowerCase().includes(q);
          const matchUnderstood = (t.understood_notes || '').toLowerCase().includes(q);
          const matchGaps = (t.gaps_notes || '').toLowerCase().includes(q);
          const matchQuestions = (t.questions || '').toLowerCase().includes(q);
          const matchMistakes = (t.mistakes || '').toLowerCase().includes(q);
          const matchCode = (t.practice_examples || '').toLowerCase().includes(q);
          const matchPersonal = (t.personal_notes || '').toLowerCase().includes(q);
          if (
            !matchTopic &&
            !matchSubject &&
            !matchUnderstood &&
            !matchGaps &&
            !matchQuestions &&
            !matchMistakes &&
            !matchCode &&
            !matchPersonal
          ) {
            return false;
          }
        }

        // Subject filter
        if (subjectFilter !== 'All Subjects') {
          if (
            (t.subject || '').toLowerCase() !== subjectFilter.toLowerCase() &&
            !(subjectFilter === 'DSA' && (t.subject || '').toLowerCase().includes('algorithm'))
          ) {
            return false;
          }
        }

        // Rating filter
        if (ratingFilter !== 'all') {
          const minRating = Number(ratingFilter);
          if ((t.self_rating || 0) < minRating) return false;
        }

        // Status / Revision Filter
        if (statusFilter === 'needs_practice') {
          return t.status === 'Needs Practice';
        }
        if (statusFilter === 'confident') {
          return t.status === 'Confident';
        }
        if (statusFilter === 'learning') {
          return t.status === 'Learning';
        }
        if (statusFilter === 'not_started') {
          return t.status === 'Not Started';
        }
        if (statusFilter === 'due') {
          return t.next_revision_date && t.next_revision_date <= today;
        }
        if (statusFilter === 'overdue') {
          return t.next_revision_date && t.next_revision_date < today;
        }
        if (statusFilter === 'upcoming') {
          return t.next_revision_date && t.next_revision_date > today;
        }
        if (statusFilter === 'recent') {
          return Boolean(t.last_revised_at);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_asc') {
          return (a.self_rating || 0) - (b.self_rating || 0);
        }
        if (sortBy === 'rating_desc') {
          return (b.self_rating || 0) - (a.self_rating || 0);
        }
        if (sortBy === 'revision_date') {
          if (!a.next_revision_date) return 1;
          if (!b.next_revision_date) return -1;
          return a.next_revision_date.localeCompare(b.next_revision_date);
        }
        if (sortBy === 'topic_name') {
          return a.topic.localeCompare(b.topic);
        }
        // Default: updated_at desc
        return (b.updated_at || '').localeCompare(a.updated_at || '');
      });
  }, [topics, searchQuery, subjectFilter, ratingFilter, statusFilter, sortBy, today]);

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedTopic(null);
    setTopicModalMode('create');
    setTopicModalOpen(true);
  };

  const handleOpenEdit = (topic) => {
    setSelectedTopic(topic);
    setTopicModalMode('edit');
    setTopicModalOpen(true);
  };

  const handleOpenQuickRevise = (topic) => {
    setTopicToRevise(topic);
    setReviseModalOpen(true);
  };

  const handleOpenDelete = (topic) => {
    setTopicToDelete(topic);
    setDeleteModalOpen(true);
  };

  // Submission Handlers
  const handleSaveTopic = async (payload) => {
    setActionLoading(true);
    try {
      if (topicModalMode === 'create') {
        const { data, error } = await createTopic(user.id, payload);
        if (error) throw new Error(error);
        setTopics((prev) => [data, ...prev]);
        setFeedback({ text: `Evaluated "${payload.topic}" successfully!`, type: 'success' });
      } else {
        const { data, error } = await updateTopic(selectedTopic.id, payload);
        if (error) throw new Error(error);
        setTopics((prev) =>
          prev.map((t) => (t.id === selectedTopic.id ? { ...t, ...data } : t))
        );
        setFeedback({ text: `Updated "${payload.topic}" successfully!`, type: 'success' });
      }
      setTopicModalOpen(false);
      setTimeout(() => setFeedback({ text: '', type: '' }), 3500);
    } catch (err) {
      console.error('Error saving topic:', err);
      setFeedback({ text: err.message || 'Failed to save topic evaluation.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveRevision = async (revisedData) => {
    setActionLoading(true);
    try {
      const { data, error } = await updateTopic(revisedData.id, revisedData);
      if (error) throw new Error(error);

      setTopics((prev) =>
        prev.map((t) => (t.id === revisedData.id ? { ...t, ...data } : t))
      );
      setReviseModalOpen(false);
      setFeedback({
        text: `Revision recorded for "${topicToRevise.topic}". Next revision: ${
          revisedData.next_revision_date || 'None'
        }`,
        type: 'success',
      });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3500);
    } catch (err) {
      console.error('Error saving revision:', err);
      setFeedback({ text: err.message || 'Failed to record revision.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;
    setActionLoading(true);
    try {
      const { error } = await deleteTopic(topicToDelete.id);
      if (error) throw new Error(error);

      setTopics((prev) => prev.filter((t) => t.id !== topicToDelete.id));
      setDeleteModalOpen(false);
      setFeedback({ text: `Deleted topic "${topicToDelete.topic}".`, type: 'success' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error deleting topic:', err);
      setFeedback({ text: err.message || 'Failed to delete topic.', type: 'error' });
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
            <Brain className="h-6 w-6 text-violet-400" />
            Topic Understanding Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Self-assessment ratings (1–5) and knowledge gaps • Strictly independent from task completion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadTopics(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50"
            title="Refresh topic evaluations"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-violet-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Assess New Topic</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'all'
              ? 'border-violet-500/50 bg-violet-500/10 shadow-sm'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Evaluated
            </span>
            <Layers className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{metrics.total}</span>
            <span className="text-xs text-slate-400">Topics</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('confident')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'confident'
              ? 'border-emerald-500/50 bg-emerald-500/15 shadow-sm'
              : 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
              Confident
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.confident}
            </span>
            <span className="text-xs text-emerald-400/70">Mastered</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('needs_practice')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'needs_practice'
              ? 'border-amber-500/50 bg-amber-500/15 shadow-sm'
              : 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
              Needs Practice
            </span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {metrics.needsPractice}
            </span>
            <span className="text-xs text-amber-400/70">Weak Areas</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('due')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            statusFilter === 'due'
              ? 'border-rose-500/50 bg-rose-500/15 shadow-sm'
              : metrics.dueOrOverdue > 0
              ? 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider">
              Due Revisions
            </span>
            <Clock className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {metrics.dueOrOverdue}
            </span>
            <span className="text-xs text-rose-400/70">
              {metrics.overdue > 0 ? `${metrics.overdue} overdue` : 'Scheduled'}
            </span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('learning')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all hidden lg:block ${
            statusFilter === 'learning'
              ? 'border-indigo-500/50 bg-indigo-500/15 shadow-sm'
              : 'border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
              In Learning
            </span>
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-400">
              {metrics.learning}
            </span>
            <span className="text-xs text-indigo-400/70">Theory</span>
          </div>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-surface-border">
        {[
          { id: 'all', label: 'All Topics', count: metrics.total },
          { id: 'needs_practice', label: 'Needs Practice', count: metrics.needsPractice },
          { id: 'confident', label: 'Confident', count: metrics.confident },
          { id: 'due', label: 'Due for Revision', count: metrics.dueOrOverdue },
          { id: 'upcoming', label: 'Upcoming', count: metrics.upcoming },
          { id: 'learning', label: 'In Learning', count: metrics.learning },
          { id: 'recent', label: 'Recently Revised' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-xl px-3.5 py-2 font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  statusFilter === tab.id
                    ? 'bg-violet-700 text-white'
                    : 'bg-surface-subtle text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
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
            placeholder="Search topic, notes, gaps, mistakes..."
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

        {/* Subject Filter */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs">
          <Layers className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub} className="bg-surface text-white">
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs">
          <Star className="h-4 w-4 text-amber-400 shrink-0" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          >
            <option value="all" className="bg-surface text-white">
              All Ratings (1–5)
            </option>
            <option value="5" className="bg-surface text-white">
              Rating 5 Only (Mastered)
            </option>
            <option value="4" className="bg-surface text-white">
              Rating 4+ (Proficient)
            </option>
            <option value="3" className="bg-surface text-white">
              Rating 3+ (Intermediate)
            </option>
            <option value="2" className="bg-surface text-white">
              Rating 2 or below
            </option>
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
            <option value="updated_at" className="bg-surface text-white">
              Recently Updated
            </option>
            <option value="rating_asc" className="bg-surface text-white">
              Lowest Rating First (Weak)
            </option>
            <option value="rating_desc" className="bg-surface text-white">
              Highest Rating First
            </option>
            <option value="revision_date" className="bg-surface text-white">
              Next Revision Date
            </option>
            <option value="topic_name" className="bg-surface text-white">
              Topic Name (A-Z)
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
              className="h-44 rounded-2xl border border-surface-border bg-surface-subtle/50 p-5"
            />
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <EmptyState
          title={
            searchQuery || statusFilter !== 'all' || subjectFilter !== 'All Subjects'
              ? 'No topics match your current filter'
              : 'No topic evaluations yet'
          }
          description={
            searchQuery || statusFilter !== 'all' || subjectFilter !== 'All Subjects'
              ? 'Try adjusting your search keywords, clearing status filters, or selecting All Subjects.'
              : 'Honest self-assessment is the fastest path to mastery. Rate your true understanding on a scale of 1–5, record knowledge gaps, and schedule revisions.'
          }
          actionLabel={
            searchQuery || statusFilter !== 'all' || subjectFilter !== 'All Subjects'
              ? 'Reset All Filters'
              : 'Assess First Topic'
          }
          icon={Brain}
          onAction={
            searchQuery || statusFilter !== 'all' || subjectFilter !== 'All Subjects'
              ? () => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSubjectFilter('All Subjects');
                  setRatingFilter('all');
                }
              : handleOpenCreate
          }
        />
      ) : (
        /* Topic Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((item) => (
            <TopicCard
              key={item.id}
              topic={item}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onQuickRevise={handleOpenQuickRevise}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TopicModal
        isOpen={topicModalOpen}
        mode={topicModalMode}
        initialData={selectedTopic}
        onClose={() => setTopicModalOpen(false)}
        onSubmit={handleSaveTopic}
        loading={actionLoading}
      />

      <QuickReviseModal
        isOpen={reviseModalOpen}
        topic={topicToRevise}
        onClose={() => setReviseModalOpen(false)}
        onSave={handleSaveRevision}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Topic Evaluation"
        message={`Are you sure you want to delete the evaluation for "${topicToDelete?.topic}"? This will permanently remove your understanding notes and revision schedule.`}
        confirmText="Delete Evaluation"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
}
