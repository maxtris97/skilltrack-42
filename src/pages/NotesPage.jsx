import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Brain,
  X,
  ArrowLeft,
  Code,
  Bug,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteMetrics,
  NOTE_SUBJECTS,
} from '../services/noteService';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';

export default function NotesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const topicParam = searchParams.get('topic');
  const topicIdParam = searchParams.get('topicId');

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState(topicParam || '');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [contentTypeFilter, setContentTypeFilter] = useState('all'); // 'all' | 'code' | 'mistakes' | 'takeaways'
  const [sortBy, setSortBy] = useState('updated_at');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedNote, setSelectedNote] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadNotes = useCallback(
    async (showRefresh = false) => {
      if (!user) return;
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const { data, error } = await fetchNotes(user.id);
        if (error) throw new Error(error);
        setNotes(data || []);
      } catch (err) {
        console.error('Failed to load notes:', err);
        setFeedback({ text: 'Failed to load learning notes.', type: 'error' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (topicParam) {
      setSearchQuery(topicParam);
    }
  }, [topicParam]);

  const handleClearTopicFilter = () => {
    searchParams.delete('topic');
    searchParams.delete('topicId');
    setSearchParams(searchParams);
    setSearchQuery('');
  };

  const metrics = useMemo(() => {
    return getNoteMetrics(notes);
  }, [notes]);

  // Filtered and sorted notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (n.title || '').toLowerCase().includes(q);
          const matchTopic = (n.topic || '').toLowerCase().includes(q);
          const matchSubject = (n.subject || '').toLowerCase().includes(q);
          const matchContent = (n.content || '').toLowerCase().includes(q);
          const matchCode = (n.code_snippet || '').toLowerCase().includes(q);
          const matchMistakes = (n.mistakes || '').toLowerCase().includes(q);
          const matchTakeaways = (n.key_takeaways || '').toLowerCase().includes(q);
          if (
            !matchTitle &&
            !matchTopic &&
            !matchSubject &&
            !matchContent &&
            !matchCode &&
            !matchMistakes &&
            !matchTakeaways
          ) {
            return false;
          }
        }

        // Subject filter
        if (subjectFilter !== 'All Subjects') {
          if ((n.subject || '').toLowerCase() !== subjectFilter.toLowerCase()) {
            return false;
          }
        }

        // Content Type filter
        if (contentTypeFilter === 'code') {
          return Boolean(n.code_snippet && n.code_snippet.trim());
        }
        if (contentTypeFilter === 'mistakes') {
          return Boolean(n.mistakes && n.mistakes.trim());
        }
        if (contentTypeFilter === 'takeaways') {
          return Boolean(n.key_takeaways && n.key_takeaways.trim());
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // Default: updated_at desc
        return (b.updated_at || '').localeCompare(a.updated_at || '');
      });
  }, [notes, searchQuery, subjectFilter, contentTypeFilter, sortBy]);

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedNote(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setSelectedNote(note);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleOpenDelete = (note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  // Submissions
  const handleSaveNote = async (payload) => {
    setActionLoading(true);
    try {
      if (modalMode === 'create') {
        const { data, error } = await createNote(user.id, payload);
        if (error) throw new Error(error);
        setNotes((prev) => [data, ...prev]);
        setFeedback({ text: `Created note "${payload.title}" successfully!`, type: 'success' });
      } else {
        const { data, error } = await updateNote(selectedNote.id, payload);
        if (error) throw new Error(error);
        setNotes((prev) =>
          prev.map((n) => (n.id === selectedNote.id ? { ...n, ...data } : n))
        );
        setFeedback({ text: `Updated note "${payload.title}" successfully!`, type: 'success' });
      }
      setModalOpen(false);
      setTimeout(() => setFeedback({ text: '', type: '' }), 3500);
    } catch (err) {
      console.error('Error saving note:', err);
      setFeedback({ text: err.message || 'Failed to save note.', type: 'error' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    setActionLoading(true);
    try {
      const { error } = await deleteNote(noteToDelete.id);
      if (error) throw new Error(error);

      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      setDeleteModalOpen(false);
      setFeedback({ text: `Deleted note "${noteToDelete.title}".`, type: 'success' });
      setTimeout(() => setFeedback({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error deleting note:', err);
      setFeedback({ text: err.message || 'Failed to delete note.', type: 'error' });
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
            <BookOpen className="h-6 w-6 text-indigo-400" />
            Learning Notes & Coding Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Document technical explanations, syntax nuances, code snippets & key takeaways
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadNotes(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50"
            title="Refresh notes"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Note</span>
          </button>
        </div>
      </div>

      {/* Active Topic Filter Chip from Topic Tracker Navigation */}
      {topicParam && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-xs text-violet-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Brain className="h-4 w-4 text-violet-400 shrink-0" />
            <span>
              Showing notes specifically for topic: <strong className="text-white">{topicParam}</strong>
            </span>
            <button
              onClick={handleClearTopicFilter}
              className="ml-2 inline-flex items-center gap-1 rounded-lg bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300 hover:bg-violet-500/30 hover:text-white"
              title="Clear topic filter"
            >
              <X className="h-3 w-3" />
              <span>Clear Filter</span>
            </button>
          </div>

          <Link
            to={`/topics?search=${encodeURIComponent(topicParam)}`}
            className="inline-flex items-center gap-1 font-medium text-violet-300 hover:text-white hover:underline shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>View "{topicParam}" in Topic Tracker</span>
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => setContentTypeFilter('all')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            contentTypeFilter === 'all'
              ? 'border-indigo-500/50 bg-indigo-500/10 shadow-sm'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Notes
            </span>
            <BookOpen className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{metrics.total}</span>
            <span className="text-xs text-slate-400">Articles</span>
          </div>
        </div>

        <div
          onClick={() => setContentTypeFilter('code')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            contentTypeFilter === 'code'
              ? 'border-sky-500/50 bg-sky-500/10 shadow-sm'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-sky-400 uppercase tracking-wider">
              With Code Snippets
            </span>
            <Code className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-sky-400">
              {metrics.withCode}
            </span>
            <span className="text-xs text-slate-400">Snippets</span>
          </div>
        </div>

        <div
          onClick={() => setContentTypeFilter('mistakes')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            contentTypeFilter === 'mistakes'
              ? 'border-rose-500/50 bg-rose-500/10 shadow-sm'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider">
              Traps & Mistakes
            </span>
            <Bug className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {metrics.withMistakes}
            </span>
            <span className="text-xs text-slate-400">Documented</span>
          </div>
        </div>

        <div
          onClick={() => setContentTypeFilter('takeaways')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            contentTypeFilter === 'takeaways'
              ? 'border-emerald-500/50 bg-emerald-500/10 shadow-sm'
              : 'border-surface-border bg-surface hover:border-surface-elevated'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
              Key Takeaways
            </span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.withTakeaways}
            </span>
            <span className="text-xs text-slate-400">Summaries</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-surface-border">
        {[
          { id: 'all', label: 'All Notes', count: metrics.total },
          { id: 'code', label: 'With Code Snippets', count: metrics.withCode },
          { id: 'mistakes', label: 'Traps & Mistakes', count: metrics.withMistakes },
          { id: 'takeaways', label: 'Key Takeaways', count: metrics.withTakeaways },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setContentTypeFilter(tab.id)}
            className={`rounded-xl px-3.5 py-2 font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              contentTypeFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                contentTypeFilter === tab.id
                  ? 'bg-indigo-700 text-white'
                  : 'bg-surface-subtle text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-slate-300 sm:col-span-1">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, code, mistakes, topics..."
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
            <option value="All Subjects" className="bg-surface text-white">
              All Subjects
            </option>
            {NOTE_SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-surface text-white">
                {s}
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
            <option value="updated_at" className="bg-surface text-white">
              Recently Updated
            </option>
            <option value="title" className="bg-surface text-white">
              Title (A-Z)
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
              className="h-48 rounded-2xl border border-surface-border bg-surface-subtle/50 p-5"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          title={
            searchQuery || subjectFilter !== 'All Subjects' || contentTypeFilter !== 'all'
              ? 'No notes match your filter'
              : topicParam
              ? `No notes logged for "${topicParam}" yet`
              : 'Knowledge base is empty'
          }
          description={
            searchQuery || subjectFilter !== 'All Subjects' || contentTypeFilter !== 'all'
              ? 'Try clearing your search query or switching your subject filter.'
              : topicParam
              ? `Create your first structured technical explanation, code snippet, or trap list specifically for "${topicParam}".`
              : 'Write clear explanations in your own words, store reproducible code snippets, record traps to avoid, and save key takeaways.'
          }
          actionLabel={
            searchQuery || subjectFilter !== 'All Subjects' || contentTypeFilter !== 'all'
              ? 'Reset All Filters'
              : topicParam
              ? `Create Note for ${topicParam}`
              : 'Create First Note'
          }
          icon={BookOpen}
          onAction={
            searchQuery || subjectFilter !== 'All Subjects' || contentTypeFilter !== 'all'
              ? () => {
                  setSearchQuery('');
                  setSubjectFilter('All Subjects');
                  setContentTypeFilter('all');
                }
              : handleOpenCreate
          }
        />
      ) : (
        /* Notes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((item) => (
            <NoteCard
              key={item.id}
              note={item}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NoteModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedNote}
        prefillTopic={topicParam}
        prefillTopicId={topicIdParam}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveNote}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Learning Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Note"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
}
