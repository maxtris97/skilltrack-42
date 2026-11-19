import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Calendar,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bug,
  Code,
  Sparkles,
} from 'lucide-react';
import RatingStars from './RatingStars';
import StatusBadge from '../common/StatusBadge';
import { getIndiaTodayDate } from '../../services/dashboardService';

export default function TopicCard({
  topic,
  onEdit,
  onDelete,
  onQuickRevise,
}) {
  const [expanded, setExpanded] = useState(false);
  const today = getIndiaTodayDate();

  // Revision state calculation
  let revisionBadge = null;
  if (topic.next_revision_date) {
    if (topic.next_revision_date < today) {
      revisionBadge = (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400">
          <AlertTriangle className="h-3 w-3" />
          Overdue (Due {topic.next_revision_date})
        </span>
      );
    } else if (topic.next_revision_date === today) {
      revisionBadge = (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
          <Clock className="h-3 w-3 animate-pulse" />
          Revision Due Today
        </span>
      );
    } else {
      revisionBadge = (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-sky-400">
          <Calendar className="h-3 w-3" />
          Revise: {topic.next_revision_date}
        </span>
      );
    }
  } else {
    revisionBadge = (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
        Unscheduled
      </span>
    );
  }

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

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'Confident':
        return 'completed';
      case 'Needs Practice':
        return 'in-progress';
      case 'Learning':
        return 'review';
      default:
        return 'not-started';
    }
  };

  const hasDetailedContent =
    Boolean(topic.understood_notes) ||
    Boolean(topic.gaps_notes) ||
    Boolean(topic.questions) ||
    Boolean(topic.mistakes) ||
    Boolean(topic.practice_examples) ||
    Boolean(topic.personal_notes);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-surface shadow-sm hover:border-surface-elevated ${
        topic.status === 'Confident'
          ? 'border-emerald-500/20 hover:border-emerald-500/40'
          : topic.status === 'Needs Practice'
          ? 'border-amber-500/20 hover:border-amber-500/40'
          : 'border-surface-border'
      }`}
    >
      <div className="p-5">
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getSubjectColor(
                topic.subject
              )}`}
            >
              {topic.subject}
            </span>

            <StatusBadge
              status={topic.status}
              variant={getStatusBadgeVariant(topic.status)}
            />

            {revisionBadge}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuickRevise(topic)}
              className="inline-flex items-center gap-1 rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300 transition-colors"
              title="Record revision and set next date"
            >
              <Calendar className="h-3 w-3" />
              <span>Revise</span>
            </button>

            <button
              onClick={() => onEdit(topic)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
              title="Edit topic evaluation"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onDelete(topic)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              title="Delete evaluation"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Rating */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h3 className="text-base font-semibold text-white tracking-tight">
            {topic.topic}
          </h3>

          <div className="shrink-0">
            <RatingStars rating={topic.self_rating} readOnly size="h-4 w-4" />
          </div>
        </div>

        {/* Revision & Note Timestamps Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-surface-border/40">
          <div className="flex items-center gap-3">
            <span>
              Last revised:{' '}
              <strong className="text-slate-300 font-mono">
                {topic.last_revised_at || 'Never'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notes Integration Link */}
            <Link
              to={`/notes?topic=${encodeURIComponent(topic.topic)}&topicId=${topic.id}`}
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              title="View and write notes linked to this topic"
            >
              <BookOpen className="h-3 w-3" />
              <span>
                {topic.notesCount > 0 ? `${topic.notesCount} Notes` : 'Add Note'}
              </span>
            </Link>

            {hasDetailedContent && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 font-medium text-slate-300 hover:text-white"
              >
                <span>{expanded ? 'Hide Details' : 'View Notes'}</span>
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Details Section */}
        {expanded && hasDetailedContent && (
          <div className="mt-4 pt-4 border-t border-surface-border space-y-3.5 text-xs animate-in fade-in duration-150">
            {topic.understood_notes && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> What I Understood
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {topic.understood_notes}
                </p>
              </div>
            )}

            {topic.gaps_notes && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Knowledge Gaps & Confusion
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {topic.gaps_notes}
                </p>
              </div>
            )}

            {topic.questions && (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5 mb-1">
                  <HelpCircle className="h-3.5 w-3.5" /> Questions & Doubts
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {topic.questions}
                </p>
              </div>
            )}

            {topic.mistakes && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mb-1">
                  <Bug className="h-3.5 w-3.5" /> Traps & Mistakes Encountered
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {topic.mistakes}
                </p>
              </div>
            )}

            {topic.practice_examples && (
              <div className="rounded-xl border border-surface-border bg-surface-subtle p-3">
                <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
                  <Code className="h-3.5 w-3.5" /> Practice Code / Patterns
                </span>
                <pre className="text-[11px] font-mono text-slate-300 bg-black/40 p-2.5 rounded-lg overflow-x-auto whitespace-pre">
                  {topic.practice_examples}
                </pre>
              </div>
            )}

            {topic.personal_notes && (
              <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Personal Reflections:
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {topic.personal_notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
