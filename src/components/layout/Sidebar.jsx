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

export default function Sidebar({ isCollapsed }) {
  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-surface-border bg-canvas/95 backdrop-blur-md transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-surface-border gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-indigo">
          <Sparkles className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap">
              SkillTrack <span className="text-indigo-400">42</span>
            </span>
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              Prep & Mastery
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface/80 border border-transparent'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-surface-border">
          <div className="rounded-xl border border-surface-border/80 bg-surface/50 p-3 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Target Period</span>
              <span className="text-emerald-400 font-semibold">42 Days</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Nov 20 – Dec 31, 2026
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-surface-border flex justify-center">
          <span className="text-[10px] font-bold text-indigo-400">42D</span>
        </div>
      )}
    </aside>
  );
}
