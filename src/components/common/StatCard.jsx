import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'text-indigo-400',
  bgColor = 'bg-indigo-500/10',
  borderColor = 'border-indigo-500/20',
}) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm transition-all duration-200 hover:border-surface-elevated hover:bg-surface-elevated/70">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${borderColor} ${bgColor} ${accentColor}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
}
