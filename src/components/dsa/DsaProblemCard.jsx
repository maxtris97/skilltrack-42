import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Bug,
  BookOpen,
  Zap,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function DsaProblemCard({
  problem,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            Easy
          </span>
        );
      case 'Medium':
        return (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
            Medium
          </span>
        );
      case 'Hard':
        return (
          <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400">
            Hard
          </span>
        );
      default:
        return null;
    }
  };

  const getLanguageBadge = (lang) => {
    if (lang === 'Java') {
      return (
        <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
          Java
        </span>
      );
    }
    if (lang === 'Python') {
      return (
        <span className="rounded border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
          Python
        </span>
      );
    }
    return (
      <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
        Java & Python
      </span>
    );
  };

  const hasDetails =
    Boolean(problem.optimized_approach) ||
    Boolean(problem.brute_force_approach) ||
    Boolean(problem.mistakes) ||
    Boolean(problem.revision_notes);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-surface shadow-sm hover:border-surface-elevated ${
        problem.status === 'Solved'
          ? 'border-emerald-500/20 hover:border-emerald-500/40'
          : problem.status === 'Needs Revision'
          ? 'border-amber-500/20 hover:border-amber-500/40'
          : 'border-surface-border'
      }`}
    >
      <div className="p-5">
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {getDifficultyBadge(problem.difficulty)}
            {getLanguageBadge(problem.language)}

            <span className="rounded border border-surface-border bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-slate-300">
              {problem.topic}
            </span>

            {problem.pattern && (
              <span className="rounded border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                {problem.pattern}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Status Selector */}
            <select
              value={problem.status}
              onChange={(e) => onStatusChange(problem.id, e.target.value)}
              className={`rounded-lg border px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer transition-colors ${
                problem.status === 'Solved'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : problem.status === 'Needs Revision'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : problem.status === 'Attempted'
                  ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                  : 'border-surface-border bg-surface-subtle text-slate-400'
              }`}
            >
              <option value="Solved" className="bg-surface text-emerald-400">
                Solved ✓
              </option>
              <option value="Needs Revision" className="bg-surface text-amber-400">
                Needs Revision ⟳
              </option>
              <option value="Attempted" className="bg-surface text-indigo-400">
                Attempted ⋯
              </option>
              <option value="Not Started" className="bg-surface text-slate-400">
                Not Started
              </option>
            </select>

            <button
              onClick={() => onEdit(problem)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
              title="Edit problem details"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onDelete(problem)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              title="Delete problem"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title and URL */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight">
              {problem.problem_name}
            </h3>

            {problem.problem_url && (
              <a
                href={problem.problem_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5"
                title="Open LeetCode problem"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Complexities */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {problem.time_complexity && (
              <span className="rounded bg-surface-subtle px-2 py-0.5 text-[11px] text-slate-300 border border-surface-border">
                Time: <strong className="text-emerald-400">{problem.time_complexity}</strong>
              </span>
            )}
            {problem.space_complexity && (
              <span className="rounded bg-surface-subtle px-2 py-0.5 text-[11px] text-slate-300 border border-surface-border">
                Space: <strong className="text-sky-400">{problem.space_complexity}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Solved Date & Toggle */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-surface-border/40 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            {problem.solved_date ? (
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3 text-emerald-400" />
                Solved on: <strong className="text-slate-300">{problem.solved_date}</strong>
              </span>
            ) : (
              <span className="text-slate-500 italic">Not yet solved</span>
            )}
          </div>

          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>{expanded ? 'Hide Analysis' : 'View Analysis'}</span>
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Expandable Technical Drawer */}
        {expanded && hasDetails && (
          <div className="mt-4 pt-4 border-t border-surface-border space-y-3 text-xs animate-in fade-in duration-150">
            {problem.optimized_approach && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3.5 w-3.5" /> Optimized Approach & Intuition
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {problem.optimized_approach}
                </p>
              </div>
            )}

            {problem.brute_force_approach && (
              <div className="rounded-xl border border-surface-border bg-surface-subtle p-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Brute Force Approach:
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {problem.brute_force_approach}
                </p>
              </div>
            )}

            {problem.mistakes && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5 mb-1">
                  <Bug className="h-3.5 w-3.5" /> Mistakes Made & Edge Cases
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {problem.mistakes}
                </p>
              </div>
            )}

            {problem.revision_notes && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
                  <BookOpen className="h-3.5 w-3.5" /> Revision Takeaways
                </span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {problem.revision_notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
