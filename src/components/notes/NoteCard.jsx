import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code,
  Copy,
  Check,
  Edit2,
  Trash2,
  Bug,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Calendar,
} from 'lucide-react';

export default function NoteCard({
  note,
  onEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopyCode = async () => {
    if (!note.code_snippet) return;
    try {
      await navigator.clipboard.writeText(note.code_snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Could not copy code:', e);
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

  const formattedDate = note.updated_at
    ? new Date(note.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const isLongContent = (note.content || '').length > 300;

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm transition-all duration-200 hover:border-surface-elevated space-y-4">
      {/* Top Bar: Subject, Topic & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-border/60">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getSubjectColor(
              note.subject
            )}`}
          >
            {note.subject}
          </span>

          <span className="rounded border border-surface-border bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-slate-300">
            {note.topic}
          </span>

          {formattedDate && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {note.code_snippet && (
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors"
              title="Copy code snippet"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onEdit(note)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
            title="Edit note"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onDelete(note)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Note Title */}
      <div>
        <h3 className="text-base font-semibold text-white tracking-tight">
          {note.title}
        </h3>
      </div>

      {/* Note Content / Explanation */}
      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
        {isLongContent && !expanded ? `${note.content.slice(0, 300)}...` : note.content}
        {isLongContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Code Snippet Box (if present) */}
      {note.code_snippet && (
        <div className="rounded-xl border border-surface-border bg-black/50 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-surface-border/50">
            <span className="flex items-center gap-1.5 font-mono text-indigo-300">
              <Code className="h-3.5 w-3.5" /> Code Snippet
            </span>
            <button
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Copy snippet"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto whitespace-pre p-1">
            {note.code_snippet}
          </pre>
        </div>
      )}

      {/* Mistakes Callout (if present) */}
      {note.mistakes && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
          <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mb-1">
            <Bug className="h-3.5 w-3.5" /> Traps & Mistakes to Avoid
          </span>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {note.mistakes}
          </p>
        </div>
      )}

      {/* Key Takeaways Callout (if present) */}
      {note.key_takeaways && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Key Takeaways
          </span>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {note.key_takeaways}
          </p>
        </div>
      )}

      {/* Footer: Bidirectional link to Topic Tracker */}
      <div className="pt-2 border-t border-surface-border/40 flex items-center justify-between text-[11px]">
        <Link
          to={`/topics?search=${encodeURIComponent(note.topic)}`}
          className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium hover:underline"
        >
          <Brain className="h-3 w-3" />
          <span>View "{note.topic}" in Topic Tracker →</span>
        </Link>
      </div>
    </div>
  );
}
