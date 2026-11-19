import React from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function NotesPage() {
  return (
    <div className="space-y-6">
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

        <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500">
          <Plus className="h-4 w-4" />
          Create Note
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-slate-300">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search notes by title, topic, or content..."
          className="bg-transparent text-white placeholder-slate-500 focus:outline-none flex-1 text-xs"
        />
      </div>

      <EmptyState
        title="Knowledge base is empty"
        description="Write clear explanations in your own words, store reproducible code snippets, and record mistakes."
        actionLabel="Create First Note"
        icon={BookOpen}
        onAction={() => alert('Note modal will be connected in Phase 6.')}
      />
    </div>
  );
}
