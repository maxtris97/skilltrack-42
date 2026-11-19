import React, { useState, useEffect } from 'react';
import { X, Brain, Loader2, Sparkles, AlertCircle, HelpCircle, Bug, Code, BookOpen, Calendar } from 'lucide-react';
import RatingStars from './RatingStars';
import { fetchCurriculumTopicSuggestions } from '../../services/topicService';
import { getIndiaTodayDate, getIndiaFutureDate } from '../../services/dashboardService';

const SUBJECTS = [
  'Java',
  'Python',
  'DSA',
  'Full-Stack',
  'Databases',
  'Spring Boot',
  'System Design',
  'Programming',
  'Other',
];

const STATUS_OPTIONS = [
  { value: 'Not Started', desc: 'Have not studied yet' },
  { value: 'Learning', desc: 'Currently studying theory/syntax' },
  { value: 'Needs Practice', desc: 'Concept clear, but struggle in coding' },
  { value: 'Confident', desc: 'Can implement & explain independently' },
];

export default function TopicModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [subject, setSubject] = useState('Java');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [selfRating, setSelfRating] = useState(1);
  const [understoodNotes, setUnderstoodNotes] = useState('');
  const [gapsNotes, setGapsNotes] = useState('');
  const [questions, setQuestions] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [practiceExamples, setPracticeExamples] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [lastRevisedAt, setLastRevisedAt] = useState('');
  const [nextRevisionDate, setNextRevisionDate] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'gaps' | 'code' | 'revision'
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const list = fetchCurriculumTopicSuggestions();
      setSuggestions(list);
    } catch (e) {
      console.warn('Could not load topic suggestions:', e);
    }
  }, []);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setSubject(initialData.subject || 'Java');
      setTopic(initialData.topic || '');
      setStatus(initialData.status || 'Not Started');
      setSelfRating(initialData.self_rating || 1);
      setUnderstoodNotes(initialData.understood_notes || '');
      setGapsNotes(initialData.gaps_notes || '');
      setQuestions(initialData.questions || '');
      setMistakes(initialData.mistakes || '');
      setPracticeExamples(initialData.practice_examples || '');
      setPersonalNotes(initialData.personal_notes || '');
      setLastRevisedAt(initialData.last_revised_at || '');
      setNextRevisionDate(initialData.next_revision_date || '');
    } else {
      setSubject('Java');
      setTopic('');
      setStatus('Not Started');
      setSelfRating(1);
      setUnderstoodNotes('');
      setGapsNotes('');
      setQuestions('');
      setMistakes('');
      setPracticeExamples('');
      setPersonalNotes('');
      setLastRevisedAt('');
      setNextRevisionDate('');
    }
    setErrorMsg('');
    setActiveTab('notes');
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSelectSuggestion = (s) => {
    setTopic(s.topic);
    if (s.subject) setSubject(s.subject);
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      topic.trim().length > 0 &&
      s.topic.toLowerCase().includes(topic.toLowerCase().trim()) &&
      s.topic.toLowerCase() !== topic.toLowerCase().trim()
  );

  const handlePresetClick = (daysAhead) => {
    setNextRevisionDate(getIndiaFutureDate(daysAhead));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Topic name is required.');
      return;
    }

    const payload = {
      subject,
      topic: topic.trim(),
      status,
      self_rating: selfRating,
      understood_notes: understoodNotes,
      gaps_notes: gapsNotes,
      questions,
      mistakes,
      practice_examples: practiceExamples,
      personal_notes: personalNotes,
      last_revised_at: lastRevisedAt || null,
      next_revision_date: nextRevisionDate || null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {mode === 'edit' ? 'Edit Topic Evaluation' : 'Assess Topic Understanding'}
              </h2>
              <p className="text-xs text-slate-400">
                Honest self-assessment independent of task completion
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
          {/* Row 1: Subject & Topic Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1 relative">
              <label className="text-slate-300 font-medium block">
                Topic Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. Memory Model, Two Pointers, Spring Beans..."
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />

              {/* Autocomplete suggestion dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-surface-border bg-surface-elevated p-1.5 shadow-xl">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1">
                    Curriculum Suggestions:
                  </div>
                  {filteredSuggestions.slice(0, 6).map((s) => (
                    <button
                      key={`${s.subject}-${s.topic}`}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-violet-500/20 text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate">{s.topic}</span>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0">
                        {s.subject} (Day {s.suggestedDay})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Status & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-surface-border/70 bg-surface-subtle/50 p-3.5">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Self-Assessment Rating (1–5)
              </label>
              <RatingStars
                rating={selfRating}
                onChange={setSelfRating}
                showLabel
                size="h-5 w-5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Understanding Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value} ({opt.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tab Navigation for Detailed Notes */}
          <div className="flex border-b border-surface-border text-xs gap-1 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Understood & Gaps
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gaps')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'gaps'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bug className="h-3.5 w-3.5" />
              Doubts & Mistakes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              Practice Code / Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('revision')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'revision'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Revision Dates
            </button>
          </div>

          {/* Tab 1: Understood & Gaps */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  What I Understood (Core Concepts)
                </label>
                <textarea
                  rows={3}
                  value={understoodNotes}
                  onChange={(e) => setUnderstoodNotes(e.target.value)}
                  placeholder="Explain clearly in your own words: what is it, why does it matter, and how does it work?"
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  What I Did Not Understand / Knowledge Gaps
                </label>
                <textarea
                  rows={3}
                  value={gapsNotes}
                  onChange={(e) => setGapsNotes(e.target.value)}
                  placeholder="Where do you get confused or stuck? What edge cases or internal mechanics are unclear?"
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Doubts & Mistakes */}
          {activeTab === 'gaps' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
                  Questions & Doubts
                </label>
                <textarea
                  rows={3}
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  placeholder="What specific questions need research, instructor answers, or documentation lookup?"
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Bug className="h-3.5 w-3.5 text-rose-400" />
                  Mistakes Made & Traps
                </label>
                <textarea
                  rows={3}
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  placeholder="Syntax traps, off-by-one errors, wrong assumptions or runtime exceptions encountered."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Practice Code & Notes */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-indigo-400" />
                  Practice Examples / Code Snippets
                </label>
                <textarea
                  rows={4}
                  value={practiceExamples}
                  onChange={(e) => setPracticeExamples(e.target.value)}
                  placeholder="// Paste concise code snippets, patterns or minimal examples illustrating the concept..."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 font-mono text-[11px] text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Personal Notes & Reflections</label>
                <textarea
                  rows={2}
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="General notes, interview tips, analogies, or reminders."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Revision Schedule */}
          {activeTab === 'revision' && (
            <div className="space-y-4 rounded-xl border border-surface-border/70 bg-surface-subtle/50 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium block">Last Revised Date</label>
                  <input
                    type="date"
                    value={lastRevisedAt || ''}
                    onChange={(e) => setLastRevisedAt(e.target.value)}
                    className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setLastRevisedAt(getIndiaTodayDate())}
                    className="text-[10px] text-violet-400 hover:underline"
                  >
                    Set to today ({getIndiaTodayDate()})
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium block">Next Revision Date</label>
                  <input
                    type="date"
                    value={nextRevisionDate || ''}
                    onChange={(e) => setNextRevisionDate(e.target.value)}
                    className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {[
                      { label: '+1d', d: 1 },
                      { label: '+3d', d: 3 },
                      { label: '+7d', d: 7 },
                      { label: '+14d', d: 14 },
                    ].map((p) => (
                      <button
                        key={p.d}
                        type="button"
                        onClick={() => handlePresetClick(p.d)}
                        className="rounded border border-surface-border bg-surface px-1.5 py-0.5 text-[10px] text-slate-300 hover:border-violet-400"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'edit' ? 'Save Changes' : 'Record Evaluation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
