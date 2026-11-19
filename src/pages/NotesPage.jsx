import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, Plus, Search, Brain, X, ArrowLeft } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');
  const topicIdParam = searchParams.get('topicId');

  const [searchQuery, setSearchQuery] = useState(topicParam || '');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-400" />
            Learning Notes & Coding Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Document explanations, syntax nuances, code snippets & key takeaways
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <Plus className="h-4 w-4" />
          Create Note
        </button>
      </div>

      {/* Topic Filter Pill from Topic Tracker Navigation */}
      {topicParam && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs text-violet-200">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-400 shrink-0" />
            <span>
              Filtered notes for topic: <strong className="text-white">{topicParam}</strong>
            </span>
            <button
              onClick={handleClearTopicFilter}
              className="ml-2 rounded-lg bg-violet-500/20 p-1 text-violet-300 hover:bg-violet-500/30 hover:text-white"
              title="Clear topic filter"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <Link
            to={`/topics?search=${encodeURIComponent(topicParam)}`}
            className="inline-flex items-center gap-1 font-medium text-violet-300 hover:text-white hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Topic in Tracker
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-slate-300">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title, topic, or content..."
          className="bg-transparent text-white placeholder-slate-500 focus:outline-none flex-1 text-xs"
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

      {/* Empty State */}
      <EmptyState
        title={topicParam ? `No notes for "${topicParam}" yet` : 'Knowledge base is empty'}
        description={
          topicParam
            ? `Write your first structured explanation or code snippet specifically for ${topicParam}.`
            : 'Write clear explanations in your own words, store reproducible code snippets, and record mistakes.'
        }
        actionLabel={topicParam ? `Create Note for ${topicParam}` : 'Create First Note'}
        icon={BookOpen}
        onAction={() => alert('Note modal will be connected in Phase 6.')}
      />
    </div>
  );
}
