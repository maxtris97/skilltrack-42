import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  Bug,
  BookOpen,
  Zap,
} from 'lucide-react';
import {
  DSA_TOPICS,
  DSA_PATTERNS,
  BIG_O_COMPLEXITIES,
} from '../../services/dsaService';
import { getIndiaTodayDate } from '../../services/dashboardService';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const STATUSES = ['Not Started', 'Attempted', 'Solved', 'Needs Revision'];
const LANGUAGES = ['Java', 'Python', 'Both'];

export default function DsaModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [problemName, setProblemName] = useState('');
  const [problemUrl, setProblemUrl] = useState('');
  const [topic, setTopic] = useState('Arrays');
  const [pattern, setPattern] = useState('Two Pointers');
  const [difficulty, setDifficulty] = useState('Easy');
  const [language, setLanguage] = useState('Java');
  const [status, setStatus] = useState('Solved');
  const [approach, setApproach] = useState('');
  const [bruteForceApproach, setBruteForceApproach] = useState('');
  const [optimizedApproach, setOptimizedApproach] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [mistakes, setMistakes] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [solvedDate, setSolvedDate] = useState('');
  const [activeTab, setActiveTab] = useState('approaches'); // 'approaches' | 'mistakes' | 'notes'
  const [errorMsg, setErrorMsg] = useState('');

  const today = getIndiaTodayDate();

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setProblemName(initialData.problem_name || '');
      setProblemUrl(initialData.problem_url || '');
      setTopic(initialData.topic || 'Arrays');
      setPattern(initialData.pattern || 'Two Pointers');
      setDifficulty(initialData.difficulty || 'Easy');
      setLanguage(initialData.language || 'Java');
      setStatus(initialData.status || 'Solved');
      setApproach(initialData.approach || '');
      setBruteForceApproach(initialData.brute_force_approach || '');
      setOptimizedApproach(initialData.optimized_approach || '');
      setTimeComplexity(initialData.time_complexity || 'O(N)');
      setSpaceComplexity(initialData.space_complexity || 'O(1)');
      setMistakes(initialData.mistakes || '');
      setRevisionNotes(initialData.revision_notes || '');
      setSolvedDate(initialData.solved_date || '');
    } else {
      setProblemName('');
      setProblemUrl('');
      setTopic('Arrays');
      setPattern('Two Pointers');
      setDifficulty('Easy');
      setLanguage('Java');
      setStatus('Solved');
      setApproach('');
      setBruteForceApproach('');
      setOptimizedApproach('');
      setTimeComplexity('O(N)');
      setSpaceComplexity('O(1)');
      setMistakes('');
      setRevisionNotes('');
      setSolvedDate(today);
    }
    setErrorMsg('');
    setActiveTab('approaches');
  }, [initialData, mode, isOpen, today]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problemName.trim()) {
      setErrorMsg('Problem name is required.');
      return;
    }

    const payload = {
      problem_name: problemName.trim(),
      problem_url: problemUrl.trim(),
      topic,
      pattern,
      difficulty,
      language,
      status,
      approach,
      brute_force_approach: bruteForceApproach,
      optimized_approach: optimizedApproach,
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      mistakes,
      revision_notes: revisionNotes,
      solved_date: status === 'Solved' ? solvedDate || today : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {mode === 'edit' ? 'Edit DSA Problem' : 'Log DSA Problem'}
              </h2>
              <p className="text-xs text-slate-400">
                Track problem-solving intuition, patterns, and complexity
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
          {/* Row 1: Problem Name & LeetCode URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Problem Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                placeholder="e.g. Two Sum, 3Sum, Valid Palindrome..."
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center justify-between">
                <span>Problem URL (LeetCode / GfG)</span>
                {problemUrl && (
                  <a
                    href={problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    Test link <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </label>
              <input
                type="url"
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Row 2: Topic & Pattern */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Topic Category</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {DSA_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Algorithm Pattern</label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {DSA_PATTERNS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Difficulty, Language & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-surface-border/70 bg-surface-subtle/50 p-3.5">
            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">Difficulty</label>
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : d === 'Medium'
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-surface-border bg-surface text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">Language</label>
              <div className="flex gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLanguage(l)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                      language === l
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold'
                        : 'border-surface-border bg-surface text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (e.target.value === 'Solved' && !solvedDate) {
                    setSolvedDate(today);
                  }
                }}
                className="w-full rounded-xl border border-surface-border bg-surface px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st} {st === 'Solved' ? '✓ (Counts to Target)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Solved Date (if Solved) */}
          {status === 'Solved' && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-medium">Solved Date:</span>
              </div>
              <input
                type="date"
                value={solvedDate || today}
                onChange={(e) => setSolvedDate(e.target.value)}
                className="rounded-lg border border-surface-border bg-surface px-2.5 py-1 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-surface-border text-xs gap-1 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('approaches')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'approaches'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Approaches & Complexities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mistakes')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'mistakes'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bug className="h-3.5 w-3.5" />
              Mistakes & Edge Cases
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Revision Notes
            </button>
          </div>

          {/* Tab 1: Approaches & Complexities */}
          {activeTab === 'approaches' && (
            <div className="space-y-3">
              {/* Complexities Quick Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-surface-border bg-surface-subtle p-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium block">
                    Time Complexity
                  </label>
                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    placeholder="e.g. O(N) or O(N log N)"
                    className="w-full rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <div className="flex gap-1 flex-wrap mt-1">
                    {BIG_O_COMPLEXITIES.slice(0, 5).map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setTimeComplexity(comp)}
                        className="rounded border border-surface-border bg-surface px-1.5 py-0.5 text-[10px] text-slate-400 hover:border-emerald-400 hover:text-white font-mono"
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium block">
                    Space Complexity
                  </label>
                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    placeholder="e.g. O(1) or O(N)"
                    className="w-full rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <div className="flex gap-1 flex-wrap mt-1">
                    {['O(1)', 'O(N)', 'O(log N)', 'O(K)'].map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setSpaceComplexity(comp)}
                        className="rounded border border-surface-border bg-surface px-1.5 py-0.5 text-[10px] text-slate-400 hover:border-emerald-400 hover:text-white font-mono"
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optimized Approach */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Optimized Approach / Key Intuition
                </label>
                <textarea
                  rows={3}
                  value={optimizedApproach}
                  onChange={(e) => setOptimizedApproach(e.target.value)}
                  placeholder="Explain the optimal data structure and algorithmic pattern (e.g. Using HashMap to store complements in single pass)..."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Brute Force Approach */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium text-[11px] text-slate-400">
                  Brute Force Approach (Initial thinking)
                </label>
                <textarea
                  rows={2}
                  value={bruteForceApproach}
                  onChange={(e) => setBruteForceApproach(e.target.value)}
                  placeholder="e.g. Nested loops checking all pairs (O(N^2) time, O(1) space)..."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Mistakes & Edge Cases */}
          {activeTab === 'mistakes' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Bug className="h-3.5 w-3.5 text-rose-400" />
                  Mistakes Made, Traps & Edge Cases
                </label>
                <textarea
                  rows={5}
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  placeholder="What failed during your first attempt? Off-by-one errors? Integer overflow? Duplicate elements? Empty array? Null pointers?"
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Revision Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                  Takeaways & Revision Notes
                </label>
                <textarea
                  rows={5}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Summary reminder: When to apply this pattern in future problems? Core invariant or template code?"
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'edit' ? 'Save Changes' : 'Record Problem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
