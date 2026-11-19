import React from 'react';
import {
  Clock,
  Calendar,
  Star,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';

export default function StudyLogCard({
  log,
  onEdit,
  onDelete,
}) {
  const getSubjectColor = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('java')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (s.includes('python')) return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    if (s.includes('dsa') || s.includes('algo')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s.includes('stack') || s.includes('react') || s.includes('node')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (s.includes('data') || s.includes('sql') || s.includes('mongo')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (s.includes('spring') || s.includes('boot')) return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (s.includes('design') || s.includes('system') || s.includes('lld')) return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
    if (s.includes('revision') || s.includes('core')) return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const formattedDate = log.study_date
    ? new Date(log.study_date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const hours = (log.duration_minutes / 60).toFixed(1);

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-sm transition-all duration-200 hover:border-surface-elevated space-y-3">
      {/* Top Bar: Subject, Date, Duration & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-surface-border/50">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getSubjectColor(
              log.subject
            )}`}
          >
            {log.subject}
          </span>

          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Calendar className="h-3 w-3 text-slate-500" />
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Duration Pill */}
          <span className="inline-flex items-center gap-1 rounded-xl border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-sky-400">
            <Clock className="h-3 w-3" />
            {log.duration_minutes >= 60 ? `${hours} hrs` : `${log.duration_minutes} mins`}
          </span>

          {/* Edit / Delete Buttons */}
          <button
            onClick={() => onEdit(log)}
            className="rounded-lg p-1 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
            title="Edit study log"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(log)}
            className="rounded-lg p-1 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
            title="Delete study log"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Topic Title & Rating */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-white tracking-tight">
          {log.topic || `${log.subject} Study Session`}
        </h4>

        {/* Productivity Stars */}
        <div className="flex items-center gap-0.5" title={`Productivity: ${log.productivity_rating}/5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 ${
                star <= (log.productivity_rating || 3)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Reflection Note */}
      {log.reflection && (
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-3 text-xs text-slate-300">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <FileText className="h-3 w-3" />
            <span>Reflection & Takeaways</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
            {log.reflection}
          </p>
        </div>
      )}
    </div>
  );
}
