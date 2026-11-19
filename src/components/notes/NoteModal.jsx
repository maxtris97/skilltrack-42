import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Code,
  Bug,
  Sparkles,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { NOTE_SUBJECTS, fetchAvailableTopicsForNotes } from '../../services/noteService';
import { useAuth } from '../../context/AuthContext';

export default function NoteModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  prefillTopic = null,
  prefillTopicId = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Java');
  const [topic, setTopic] = useState('');
  const [topicId, setTopicId] = useState(null);
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState('');
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'code' | 'takeaways'
  const [availableTopics, setAvailableTopics] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      fetchAvailableTopicsForNotes(user.id).then((topics) => setAvailableTopics(topics || []));
    }
  }, [user]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title || '');
      setSubject(initialData.subject || 'Java');
      setTopic(initialData.topic || '');
      setTopicId(initialData.topic_id || null);
      setContent(initialData.content || '');
      setCodeSnippet(initialData.code_snippet || '');
      setMistakes(initialData.mistakes || '');
      setKeyTakeaways(initialData.key_takeaways || '');
    } else {
      setTitle('');
      setSubject('Java');
      setTopic(prefillTopic || '');
      setTopicId(prefillTopicId || null);
      setContent('');
      setCodeSnippet('');
      setMistakes('');
      setKeyTakeaways('');
    }
    setErrorMsg('');
    setActiveTab('content');
  }, [initialData, mode, isOpen, prefillTopic, prefillTopicId]);

  if (!isOpen) return null;

  const handleSelectTopicSuggestion = (t) => {
    setTopic(t.topic);
    if (t.subject) setSubject(t.subject);
    if (t.id) setTopicId(t.id);
    else setTopicId(null);
    setShowSuggestions(false);
  };

  const filteredTopicSuggestions = availableTopics.filter(
    (t) =>
      topic.trim().length > 0 &&
      t.topic.toLowerCase().includes(topic.toLowerCase().trim()) &&
      t.topic.toLowerCase() !== topic.toLowerCase().trim()
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Note title is required.');
      return;
    }
    if (!topic.trim()) {
      setErrorMsg('Topic name is required.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Note content / explanation is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      subject,
      topic: topic.trim(),
      topic_id: topicId,
      content: content.trim(),
      code_snippet: codeSnippet.trim(),
      mistakes: mistakes.trim(),
      key_takeaways: keyTakeaways.trim(),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {mode === 'edit' ? 'Edit Learning Note' : 'Create Learning Note'}
              </h2>
              <p className="text-xs text-slate-400">
                Document technical explanations, syntax nuances, code snippets & traps
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
          {/* Row 1: Note Title */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium block">
              Note Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JVM Memory Allocation: Stack vs Heap & Garbage Collection Basics"
              className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Row 2: Subject & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {NOTE_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1 relative">
              <label className="text-slate-300 font-medium flex items-center justify-between">
                <span>
                  Topic Name <span className="text-rose-400">*</span>
                </span>
                {topicId && (
                  <span className="text-[10px] text-violet-400 font-medium flex items-center gap-1">
                    <LinkIcon className="h-2.5 w-2.5" /> Linked to Topic Evaluation
                  </span>
                )}
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setTopicId(null);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. Memory Model, Polymorphism, React Hooks..."
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />

              {/* Topic autocomplete dropdown */}
              {showSuggestions && filteredTopicSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-surface-border bg-surface-elevated p-1.5 shadow-xl">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1">
                    Available Topics:
                  </div>
                  {filteredTopicSuggestions.slice(0, 6).map((s) => (
                    <button
                      key={`${s.subject}-${s.topic}`}
                      type="button"
                      onClick={() => handleSelectTopicSuggestion(s)}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate">{s.topic}</span>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0">
                        {s.subject} {s.isEvaluated ? '• (Evaluated)' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-surface-border text-xs gap-1 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'content'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Explanation & Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              Code Snippet
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('takeaways')}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'takeaways'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bug className="h-3.5 w-3.5" />
              Mistakes & Takeaways
            </button>
          </div>

          {/* Tab 1: Content */}
          {activeTab === 'content' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Technical Explanation (In your own words) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a clear, thorough explanation as if explaining to another engineer: concepts, mechanics, execution flow, and why it works..."
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>
          )}

          {/* Tab 2: Code Snippet */}
          {activeTab === 'code' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-indigo-400" />
                Concise Code Snippet / Pattern Template (Optional)
              </label>
              <textarea
                rows={7}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste clean, runnable example code or standard boilerplate..."
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 font-mono text-[11px] text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {/* Tab 3: Mistakes & Takeaways */}
          {activeTab === 'takeaways' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Bug className="h-3.5 w-3.5 text-rose-400" />
                  Common Traps, Edge Cases & Mistakes
                </label>
                <textarea
                  rows={3}
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  placeholder="What misconceptions or syntax traps to avoid? (e.g. == vs .equals(), shallow copy vs deep copy)..."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Key Takeaways / Rule of Thumb
                </label>
                <textarea
                  rows={3}
                  value={keyTakeaways}
                  onChange={(e) => setKeyTakeaways(e.target.value)}
                  placeholder="Bullet points summarizing the core principle to remember during placement interviews..."
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'edit' ? 'Save Changes' : 'Save Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
