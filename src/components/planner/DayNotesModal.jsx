import React, { useState, useEffect } from 'react';
import { FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DayNotesModal({
  isOpen,
  day,
  onSaveNotes,
  onClose,
}) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (day) {
      setNotes(day.notes || '');
      setSavedSuccess(false);
      setErrorMsg('');
    }
  }, [day, isOpen]);

  if (!isOpen || !day) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSavedSuccess(false);

    try {
      const res = await onSaveNotes(day.id, notes);
      if (res?.error) {
        setErrorMsg(res.error.message || 'Failed to save notes.');
      } else {
        setSavedSuccess(true);
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error saving notes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Day {day.day_number} Learning Notes
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {day.study_date} • {day.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Notes saved successfully to database!</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Reflection & Key Takeaways
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {notes.length} characters
              </span>
            </div>
            <textarea
              rows="6"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What clicked today? What doubts or edge cases did you encounter? Summary of solutions..."
              className="w-full rounded-xl border border-surface-border bg-surface-subtle p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-surface-border bg-surface px-4 py-2 text-xs font-medium text-slate-300 hover:bg-surface-elevated hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-indigo hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Notes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
