import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Loader2 } from 'lucide-react';
import ConfigWarningBanner from '../common/ConfigWarningBanner';

export default function ProtectedRoute() {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  // 1. Loading State (UIUXPro: stable skeleton without layout shift)
  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-canvas p-4 text-center"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-indigo animate-pulse mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          <span>Verifying session security...</span>
        </div>
      </div>
    );
  }

  // 2. Unconfigured Supabase State
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-canvas p-6 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <ConfigWarningBanner />
          <div className="text-center">
            <a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              View Authentication Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthenticated State
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 4. Authenticated State
  return <Outlet />;
}
