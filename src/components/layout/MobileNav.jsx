import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  Brain,
  Code2,
  BookOpen,
  Clock,
  BarChart3,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: '42-Day Planner', path: '/planner', icon: CalendarCheck2 },
  { name: 'Topic Mastery', path: '/topics', icon: Brain },
  { name: 'DSA Tracker', path: '/dsa', icon: Code2 },
  { name: 'Notes & Journal', path: '/notes', icon: BookOpen },
  { name: 'Study Time', path: '/study-time', icon: Clock },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { name: 'Settings & Profile', path: '/settings', icon: Settings },
];

export default function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex w-72 max-w-[80vw] flex-1 flex-col border-r border-surface-border bg-canvas/98 p-4 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-indigo">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">SkillTrack 42</h2>
              <p className="text-[10px] text-slate-400">Nov 20 – Dec 31, 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border bg-surface text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-surface border border-transparent'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-border text-center text-xs text-slate-500">
          Personal Placement Tracker
        </div>
      </div>
    </div>
  );
}
