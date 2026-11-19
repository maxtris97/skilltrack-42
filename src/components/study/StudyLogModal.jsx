import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar,
  Layers,
  Star,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { STUDY_SUBJECTS } from '../../services/studyService.js';
import { getIndiaTodayDate } from '../../services/dashboardService.js';

const QUICK_MINUTES = [15, 25, 30, 45, 60, 90, 120];

const RATING_DESCRIPTIONS = {
  1: 'Distracted — struggled with focus or frequent interruptions',
  2: 'Sluggish — completed basic reading but slow progress',
  3: 'Steady — decent focus, understood core concepts',
  4: 'High Flow — uninterrupted coding, resolved blockers quickly',
  5: 'Deep Flow / Peak — exceptional clarity, maximum output',
};

export default function StudyLogModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  prefillData = null,
  availableTopics = [],
  onClose,
  onSubmit,
  loading = false,
}) {
  const [studyDate, setStudyDate] = useState(getIndiaTodayDate());
  const [subject, setSubject] = useState('DSA');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [productivityRating, setProductivityRating] = useState(4);
  const [reflection, setReflection] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initialData) {
      setStudyDate(initialData.study_date || getIndiaTodayDate());
      setSubject(initialData.subject || 'DSA');
      setTopic(initialData.topic || '');
      setDurationMinutes(initialData.duration_minutes || 45);
      setProductivityRating(initialData.productivity_rating || 3);
      setReflection(initialData.reflection || '');
    } else if (prefillData) {
      setStudyDate(prefillData.study_date || getIndiaTodayDate());
      setSubject(prefillData.subject || 'DSA');
      setTopic(prefillData.topic || '');
      setDurationMinutes(prefillData.duration_minutes || 45);
      setProductivityRating(prefillData.productivity_rating || 4);
      setReflection(prefillData.reflection || '');
    } else {
      setStudyDate(getIndiaTodayDate());
      setSubject('DSA');
      setTopic('');
      setDurationMinutes(45);
      setProductivityRating(4);
      setReflection('');
    }
    setErrorMsg('');
    setShowTopicSuggestions(false);
  }, [isOpen, mode, initialData, prefillData]);

  if (!isOpen) return null;

  const handleSelectTopic = (item) => {
    setTopic(item.topic);
    if (item.subject) setSubject(item.subject);
    setShowTopicSuggestions(false);
  };

  const filteredTopicSuggestions = availableTopics.filter(
    (t) =>
      topic.trim().length > 0 &&
      t.topic.toLowerCase().includes(topic.toLowerCase().trim()) &&
      t.topic.toLowerCase() !== topic.toLowerCase().trim()
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      setErrorMsg('Please enter a valid study duration greater than 0 minutes.');
      return;
    }
    if (!studyDate) {
      setErrorMsg('Please select a valid study date.');
      return;
    }

    const payload = {
      study_date: studyDate,
      subject,
      topic: topic.trim(),
      duration_minutes: duration,
      productivity_rating: productivityRating,
      reflection: reflection.trim(),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg my-8 rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {mode === 'edit' ? 'Edit Study Session' : 'Log Study Session'}
              </h2>
              <p className="text-xs text-slate-400">
                Track dedicated learning hours, reflections, and deep work focus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-surface-elevated hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Date & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-sky-400" />
                Study Date (IST) <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={studyDate}
                onChange={(e) => setStudyDate(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-sky-400" />
                Subject <span className="text-rose-400">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                {STUDY_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Topic / Description */}
          <div className="space-y-1 relative">
            <label className="text-slate-300 font-medium block">
              Topic or Project Task (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setShowTopicSuggestions(true);
              }}
              onFocus={() => setShowTopicSuggestions(true)}
              placeholder="e.g. Dynamic Programming, Redux Toolkit, Spring Boot REST..."
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />

            {showTopicSuggestions && filteredTopicSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-surface-border bg-surface-elevated p-1.5 shadow-xl">
                <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1">
                  Suggested Topics:
                </div>
                {filteredTopicSuggestions.slice(0, 5).map((t) => (
                  <button
                    key={`${t.subject}-${t.topic}`}
                    type="button"
                    onClick={() => handleSelectTopic(t)}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-sky-500/20 text-xs text-slate-200 flex items-center justify-between"
                  >
                    <span className="truncate">{t.topic}</span>
                    <span className="text-[10px] text-slate-400 ml-2 shrink-0">{t.subject}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Row 3: Duration with Quick Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-400" />
                Duration (Minutes) <span className="text-rose-400">*</span>
              </label>
              <span className="font-mono text-sky-400 font-semibold text-xs">
                {(durationMinutes / 60).toFixed(1)} hrs ({durationMinutes} mins)
              </span>
            </div>

            <input
              type="number"
              min="1"
              max="720"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-medium text-slate-500 uppercase mr-1">Quick:</span>
              {QUICK_MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDurationMinutes(m)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-mono transition-colors ${
                    parseInt(durationMinutes, 10) === m
                      ? 'bg-sky-600 text-white font-bold'
                      : 'border border-surface-border bg-surface-subtle text-slate-300 hover:text-white hover:bg-surface-elevated'
                  }`}
                >
                  +{m}m
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Productivity Rating (1 - 5 Stars) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                Productivity Rating (1–5)
              </label>
              <span className="text-amber-400 font-semibold font-mono text-xs">
                {productivityRating} / 5 Stars
              </span>
            </div>

            <div className="flex items-center gap-1 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setProductivityRating(star)}
                  className="p-1 text-slate-600 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= productivityRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic">
              {RATING_DESCRIPTIONS[productivityRating]}
            </p>
          </div>

          {/* Row 5: Reflection Notes */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              Session Reflection (Optional)
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you build, solve, or debug during this session? Any breakthroughs or sticky problems?"
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'edit' ? 'Update Session' : 'Save Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
