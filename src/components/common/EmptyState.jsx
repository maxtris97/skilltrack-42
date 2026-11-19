import React from 'react';
import { Sparkles } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'Get started by creating your first record.',
  icon: Icon = Sparkles,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface/30 p-8 text-center sm:p-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-surface text-indigo-400 shadow-sm mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
