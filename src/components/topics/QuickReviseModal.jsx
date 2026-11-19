import React, { useState } from 'react';
import { X, Calendar, Check, Loader2, Sparkles, Brain, Clock } from 'lucide-react';
import RatingStars from './RatingStars';
import { getIndiaTodayDate } from '../../services/dashboardService';

const STATUS_OPTIONS = ['Not Started', 'Learning', 'Needs Practice', 'Confident'];

export default function QuickReviseModal({
  isOpen,
  onClose,
  topic,
  onSave,
  loading = false,
}) {
  if (!isOpen || !topic) return null;

  const today = getIndiaTodayDate();

  const getFutureDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [nextDate, setNextDate] = useState(topic.next_revision_date || getFutureDate(3));
  const [rating, setRating] = useState(topic.self_rating || 3);
  const [status, setStatus] = useState(topic.status || 'Needs Practice');
  const [revisionNotes, setRevisionNotes] = useState('');

  const handlePresetClick = (days) => {
    setNextDate(getFutureDate(days));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: topic.id,
      last_revised_at: today,
      next_revision_date: nextDate || null,
      self_rating: rating,
      status: status,
      personal_notes: revisionNotes.trim()
        ? topic.personal_notes
          ? `${topic.personal_notes}\n\n[Revised on ${today}]: ${revisionNotes.trim()}`
          : `[Revised on ${today}]: ${revisionNotes.trim()}`
        : topic.personal_notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Log Topic Revision</h2>
              <p className="text-xs text-slate-400 line-clamp-1">{topic.topic}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-surface-elevated hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Today revised notification */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Last revision date will be updated to today (<strong>{today}</strong>).</span>
          </div>

          {/* Self-Rating update */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              Updated Confidence Rating:
            </label>
            <RatingStars rating={rating} onChange={setRating} showLabel size="h-5 w-5" />
          </div>

          {/* Status update */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              Topic Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`rounded-xl border py-2 px-3 text-xs font-medium text-left transition-colors ${
                    status === opt
                      ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                      : 'border-surface-border bg-surface-subtle text-slate-400 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Next Revision Date Presets */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium block">
              When should you revise this again?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '+1 Day', days: 1 },
                { label: '+3 Days', days: 3 },
                { label: '+7 Days (1 Wk)', days: 7 },
                { label: '+14 Days (2 Wks)', days: 14 },
                { label: '+30 Days (1 Mo)', days: 30 },
              ].map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handlePresetClick(preset.days)}
                  className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-violet-500/50 hover:bg-surface-elevated transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="date"
              value={nextDate || ''}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Revision Takeaway Note */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              Quick Revision Reflection (Optional):
            </label>
            <textarea
              rows={2}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="What clicked during this revision? Any remaining doubt?"
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-surface-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Revision</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
