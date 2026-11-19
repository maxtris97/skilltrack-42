import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'bg-brand-primary',
  showLabel = false,
  label = '',
  height = 'h-2',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-300">{label}</span>
          <span className="text-slate-400 font-mono">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-surface-border ${height}`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
