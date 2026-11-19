import React, { useState } from 'react';
import { ArrowLeftRight, X, Loader2, AlertCircle, Calendar, Archive } from 'lucide-react';

export default function CarryForwardModal({
  isOpen,
  task,
  allDays = [],
  onReschedule,
  onClose,
}) {
  const [targetType, setTargetType] = useState('day'); // 'day' | 'backlog'
  const [selectedDayId, setSelectedDayId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !task) return null;

  // Filter to days that are in the future relative to the task's scheduled_date
  const futureDays = allDays.filter((d) => d.id !== task.learning_day_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const isBacklog = targetType === 'backlog';

    if (!isBacklog && !selectedDayId) {
      setErrorMsg('Please select a destination learning day.');
      return;
    }

    setLoading(true);

    try {
      const destinationDay = allDays.find((d) => d.id === selectedDayId);
      const newScheduledDate = destinationDay?.study_date || null;

      const res = await onReschedule({
        taskId: task.id,
        destinationDayId: isBacklog ? null : selectedDayId,
        newScheduledDate,
        isBacklog,
        reason: reason.trim(),
      });

      if (res?.success) {
        onClose();
      } else {
        setErrorMsg(res?.error || 'Failed to reschedule task.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Rescheduling error.');
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Carry Forward Task</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Reschedule unfinished work with audit history tracking.
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

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-surface-border bg-surface-subtle p-3 text-xs">
          <span className="text-[11px] text-slate-400 block uppercase tracking-wider mb-1">
            Task to Reschedule:
          </span>
          <span className="font-semibold text-white block">{task.task_title}</span>
          <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Currently scheduled: {task.scheduled_date}</span>
            {task.is_carried_forward && (
              <span className="text-amber-400 font-semibold">(Already carried forward)</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Target Mode Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Reschedule Destination
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetType('day')}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  targetType === 'day'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-surface-border bg-surface text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="h-4 w-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-semibold block">Future Learning Day</span>
                  <span className="text-[10px] text-slate-400">Pick a specific roadmap day</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('backlog')}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  targetType === 'backlog'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-surface-border bg-surface text-slate-400 hover:text-slate-200'
                }`}
              >
                <Archive className="h-4 w-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold block">Unscheduled Backlog</span>
                  <span className="text-[10px] text-slate-400">Move past Day 42 / Hold</span>
                </div>
              </button>
            </div>
          </div>

          {/* Select Day Dropdown (if targetType === 'day') */}
          {targetType === 'day' && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Select Destination Day <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={selectedDayId}
                onChange={(e) => setSelectedDayId(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Choose destination day --</option>
                {futureDays.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                    Day {d.day_number} ({d.study_date}) — {d.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Reason / Revision Note (Optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Needed more time to understand sliding window edge cases"
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
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
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-amber hover:bg-amber-500 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm Reschedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
