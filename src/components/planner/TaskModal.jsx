import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const SUBJECT_OPTIONS = [
  'Java',
  'Python',
  'Java & Python',
  'Logical Thinking',
  'DSA (Java)',
  'DSA (Java/Python)',
  'Web Fundamentals',
  'Frontend',
  'Backend',
  'Full-Stack Architecture',
  'Databases',
  'Backend (Java)',
  'System Design',
  'Revision Test',
  'Other',
];

export default function TaskModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  task = null, // Task object if mode === 'edit'
  dayNumber = null,
  onSave,
  onClose,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('DSA (Java)');
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState(45);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (task && mode === 'edit') {
      setTitle(task.task_title || '');
      setDescription(task.description || '');
      setSubject(task.subject || 'DSA (Java)');
      setTopic(task.topic || '');
      setMinutes(task.estimated_minutes || 45);
    } else {
      setTitle('');
      setDescription('');
      setSubject('DSA (Java)');
      setTopic('');
      setMinutes(45);
    }
    setErrorMsg('');
  }, [task, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Task title is required.');
      return;
    }

    if (Number(minutes) < 5) {
      setErrorMsg('Estimated duration must be at least 5 minutes.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        task_title: title.trim(),
        description: description.trim(),
        subject,
        topic: topic.trim() || 'General Practice',
        estimated_minutes: Number(minutes),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  const isOriginalCurriculum = Boolean(task?.curriculum_task_key);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {mode === 'create' ? `Add Task to Day ${dayNumber}` : 'Edit Task'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isOriginalCurriculum
                ? `Curriculum Task (${task.curriculum_task_key}) — Identity is safely preserved.`
                : 'Custom learning task for your preparation.'}
            </p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solve Two Sum using HashMap in Java"
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {SUBJECT_OPTIONS.map((subj) => (
                  <option key={subj} value={subj} className="bg-slate-900 text-white">
                    {subj}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Hashing, Arrays, OOP"
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="480"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Description & Learning Instructions
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts to practice, test cases, or problem link..."
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
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-indigo hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'create' ? 'Create Task' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
