import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flame, Menu, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar, onOpenMobileNav, isSidebarCollapsed }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Calculate day difference relative to start date Nov 20, 2026
  const startDate = new Date('2026-11-20T00:00:00');
  const now = new Date();
  const diffTime = now - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const currentDayNumber = diffDays >= 1 && diffDays <= 42 ? diffDays : (diffDays > 42 ? 42 : 1);

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Learner';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-border bg-canvas/80 px-4 backdrop-blur-md lg:px-8">
      {/* Left: Hamburger for mobile + Toggle for desktop sidebar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface text-slate-300 transition-colors hover:bg-surface-elevated hover:text-white lg:hidden cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface text-slate-300 transition-colors hover:bg-surface-elevated hover:text-white lg:flex cursor-pointer"
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Roadmap Day Pill */}
        <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 shadow-sm">
          <Flame className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Roadmap: <strong className="text-white">Day {currentDayNumber}</strong> of 42</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Right: Quick Stats & User Profile / Logout */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-surface-border bg-surface/60 px-3 py-1.5 text-xs text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Goal: <span className="font-semibold text-emerald-400">Dec 31, 2026</span></span>
        </div>

        {/* User Chip */}
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-200">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-sm">
            {initial}
          </div>
          <span className="font-medium hidden sm:inline max-w-[120px] truncate" title={displayName}>
            {displayName}
          </span>
        </div>

        {/* Sign Out Button */}
        {user && (
          <button
            onClick={handleSignOut}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
