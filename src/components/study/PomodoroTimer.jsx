import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  CheckCircle2,
  Volume2,
  VolumeX,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { STUDY_SUBJECTS } from '../../services/studyService.js';

const PRESETS = [
  { id: '25m', label: '25m', name: 'Pomodoro', minutes: 25, type: 'focus' },
  { id: '45m', label: '45m', name: 'Deep Work', minutes: 45, type: 'focus' },
  { id: '50m', label: '50m', name: 'Focus Block', minutes: 50, type: 'focus' },
  { id: '60m', label: '60m', name: 'Power Hour', minutes: 60, type: 'focus' },
  { id: '5m_break', label: '5m', name: 'Short Break', minutes: 5, type: 'break' },
  { id: '15m_break', label: '15m', name: 'Long Break', minutes: 15, type: 'break' },
];

/**
 * Plays a pleasant synthesizer chime on completion using the Web Audio API.
 * No external media files or network required.
 */
function playCompletionChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Two-tone chime: D5 (587.33Hz) -> A5 (880Hz)
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.3);
    gain2.gain.setValueAtTime(0.2, now + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.3);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
}

export default function PomodoroTimer({
  onLogCompletedSession,
  availableTopics = [],
}) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[1]); // 45m Deep Work
  const [timerType, setTimerType] = useState('focus'); // 'focus' | 'break'
  const [totalSeconds, setTotalSeconds] = useState(45 * 60);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [subject, setSubject] = useState('DSA');
  const [topic, setTopic] = useState('');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [isCustom, setIsCustom] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const initialTitleRef = useRef(typeof document !== 'undefined' ? document.title : 'SkillTrack 42');

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setIsRunning(false);
    setIsCustom(false);
    setSelectedPreset(preset);
    setTimerType(preset.type);
    const secs = preset.minutes * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setSessionCompleted(false);
  };

  const handleCustomApply = () => {
    const mins = Math.max(1, Math.min(180, parseInt(customMinutes, 10) || 30));
    setIsRunning(false);
    setIsCustom(true);
    setTimerType('focus');
    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setSessionCompleted(false);
  };

  // Toggle Timer
  const togglePlay = () => {
    if (sessionCompleted) {
      setSecondsLeft(totalSeconds);
      setSessionCompleted(false);
    }
    setIsRunning((prev) => !prev);
  };

  // Reset Timer
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setSessionCompleted(false);
  };

  // Countdown interval & title update
  useEffect(() => {
    let timer = null;

    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      setSessionCompleted(true);
      if (soundEnabled) {
        playCompletionChime();
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft, soundEnabled]);

  // Sync document title with timer
  useEffect(() => {
    if (isRunning) {
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      document.title = `(${formatted}) ${timerType === 'focus' ? '🎯 Focus' : '☕ Break'} - SkillTrack 42`;
    } else {
      document.title = initialTitleRef.current;
    }
    return () => {
      document.title = initialTitleRef.current;
    };
  }, [isRunning, secondsLeft, timerType]);

  // Format time MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Progress percentage (0 to 100)
  const progressPercent = totalSeconds > 0 ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100) : 0;
  const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));

  const handleLogClick = () => {
    const minsToLog = sessionCompleted ? Math.round(totalSeconds / 60) : elapsedMinutes;
    onLogCompletedSession({
      subject,
      topic,
      duration_minutes: minsToLog,
      reflection: sessionCompleted
        ? `Completed ${minsToLog}-minute ${timerType === 'focus' ? 'Deep Work' : 'Focus'} session on ${topic || subject}.`
        : `Focus block (${minsToLog} mins) on ${topic || subject}.`,
      productivity_rating: sessionCompleted ? 5 : 4,
    });
    setSessionCompleted(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface p-6 shadow-xl">
      {/* Background radial glow */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20 transition-colors ${
          timerType === 'focus' ? 'bg-sky-500' : 'bg-emerald-500'
        }`}
      />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border/60">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              timerType === 'focus'
                ? 'border-sky-500/30 bg-sky-500/10 text-sky-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {timerType === 'focus' ? <Brain className="h-5 w-5" /> : <Coffee className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>Pomodoro & Deep Work Timer</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  timerType === 'focus'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {timerType === 'focus' ? 'Focus Mode' : 'Break Time'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Block distractions, maintain flow state, and record actual study minutes
            </p>
          </div>
        </div>

        {/* Audio Chime Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
            soundEnabled
              ? 'border-surface-border bg-surface-subtle text-slate-200 hover:text-white'
              : 'border-surface-border bg-surface text-slate-500 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Mute chime' : 'Enable completion chime'}
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-sky-400" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
        </button>
      </div>

      {/* Preset Selector */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
          Presets:
        </span>
        {PRESETS.map((p) => {
          const isSelected = !isCustom && selectedPreset.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? p.type === 'focus'
                    ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400/50'
                    : 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                  : 'border border-surface-border bg-surface-subtle text-slate-300 hover:bg-surface-elevated hover:text-white'
              }`}
            >
              {p.label} <span className="text-[10px] opacity-75">{p.name}</span>
            </button>
          );
        })}

        {/* Custom duration toggle */}
        <div className="flex items-center gap-1.5 ml-auto">
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="w-14 rounded-xl border border-surface-border bg-surface-subtle px-2 py-1 text-center text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
            placeholder="Mins"
          />
          <button
            onClick={handleCustomApply}
            className={`rounded-xl px-2.5 py-1 text-xs font-medium border transition-colors ${
              isCustom
                ? 'border-sky-500 bg-sky-600 text-white'
                : 'border-surface-border bg-surface-subtle text-slate-300 hover:text-white'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="my-8 flex flex-col items-center justify-center">
        {/* Large Digital Clock */}
        <div className="relative flex flex-col items-center">
          <span
            className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight select-none transition-colors ${
              isRunning
                ? timerType === 'focus'
                  ? 'text-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]'
                  : 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.25)]'
                : sessionCompleted
                ? 'text-emerald-300'
                : 'text-white'
            }`}
          >
            {timeFormatted}
          </span>

          <span className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-widest">
            {isRunning ? (timerType === 'focus' ? 'Focus in progress' : 'Rest & recharge') : sessionCompleted ? 'Session Complete!' : 'Ready'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 w-full max-w-md">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-border">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                timerType === 'focus' ? 'bg-sky-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] font-mono text-slate-500">
            <span>{progressPercent}% elapsed</span>
            <span>{Math.round(totalSeconds / 60)} mins total</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition-all ${
              isRunning
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : timerType === 'focus'
                ? 'bg-sky-600 text-white hover:bg-sky-500 shadow-sky-600/20'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" /> Start Focus
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-surface-border bg-surface-subtle px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-surface-elevated hover:text-white transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>

          {/* Quick Log button if elapsed > 0 */}
          {(elapsedMinutes > 0 || sessionCompleted) && (
            <button
              onClick={handleLogClick}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
              title="Log current minutes to history"
            >
              <PlusCircle className="h-4 w-4 text-indigo-400" />
              <span>Log {sessionCompleted ? Math.round(totalSeconds / 60) : elapsedMinutes}m</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Celebration Banner */}
      {sessionCompleted && (
        <div className="my-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block font-semibold text-sm">
                Focus Session Completed! 🎉
              </strong>
              <span>
                You completed {Math.round(totalSeconds / 60)} minutes of dedicated focus on{' '}
                {topic || subject}.
              </span>
            </div>
          </div>
          <button
            onClick={handleLogClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors shrink-0"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Save to Study History</span>
          </button>
        </div>
      )}

      {/* Bottom Session Subject & Topic Tagging */}
      <div className="mt-4 pt-4 border-t border-surface-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-slate-400 font-medium block">Active Focus Subject</label>
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

        <div className="space-y-1">
          <label className="text-slate-400 font-medium block">Topic or Feature</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Graph Traversals, Spring Security JWT, System Design..."
            className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
