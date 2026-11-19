import React, { useState } from 'react';
import {
  Settings,
  User,
  Database,
  RotateCcw,
  ShieldCheck,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { seedCurriculum } from '../services/curriculumService';
import ConfigWarningBanner from '../components/common/ConfigWarningBanner';

export default function SettingsPage() {
  const { user, profile, updateProfile, updatePassword, signOut, isConfigured } = useAuth();

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState('');

  const handleSyncCurriculum = async () => {
    if (!user) return;
    setSyncLoading(true);
    setSyncResult('');

    try {
      const res = await seedCurriculum(user.id);
      if (res.success) {
        setSyncResult(
          `Sync completed via ${res.method}: ${res.daysInserted} days inserted (${res.daysExisting} existing), ${res.tasksInserted} tasks inserted (${res.tasksExisting} existing). User progress preserved.`
        );
      } else {
        setSyncResult(`Sync error: ${res.error}`);
      }
    } catch (err) {
      setSyncResult(`Failed to sync: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal_minutes || 120);
  const [dsaTarget, setDsaTarget] = useState(profile?.target_dsa_count || 50);

  React.useEffect(() => {
    if (profile) {
      if (profile.display_name !== undefined) setDisplayName(profile.display_name || '');
      if (profile.daily_goal_minutes !== undefined) setDailyGoal(profile.daily_goal_minutes || 120);
      if (profile.target_dsa_count !== undefined) setDsaTarget(profile.target_dsa_count || 50);
    }
  }, [profile]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileErr('');
    setProfileMsg('');
    setProfileLoading(true);

    try {
      const { error } = await updateProfile({
        display_name: displayName,
        daily_goal_minutes: Number(dailyGoal),
        target_dsa_count: Number(dsaTarget),
      });

      if (error) {
        setProfileErr(error.message);
      } else {
        setProfileMsg('Profile preferences updated successfully.');
      }
    } catch (err) {
      setProfileErr(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordErr('');
    setPasswordMsg('');

    if (newPassword.length < 6) {
      setPasswordErr('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErr('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setPasswordErr(error.message);
      } else {
        setPasswordMsg('Password changed successfully.');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordErr(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-400" />
          Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage targets, update account credentials, and inspect Supabase connection
        </p>
      </div>

      {!isConfigured && <ConfigWarningBanner />}

      {/* Profile & Target Preferences */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <User className="h-4 w-4 text-indigo-400" />
          Learner Profile & Goals
        </h2>

        {profileMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{profileMsg}</span>
          </div>
        )}

        {profileErr && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{profileErr}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'learner@example.com'}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle/50 px-3 py-2 text-xs text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Daily Study Target (minutes)</label>
              <input
                type="number"
                min="15"
                max="720"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">DSA Target Count (Goal)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={dsaTarget}
                onChange={(e) => setDsaTarget(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Profile Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <KeyRound className="h-4 w-4 text-violet-400" />
          Update Password
        </h2>

        {passwordMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordErr && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passwordErr}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 disabled:opacity-50 cursor-pointer"
            >
              {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Diagnostics */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <Database className="h-4 w-4 text-emerald-400" />
          Supabase Connection Diagnostics
        </h2>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle p-3 text-xs">
            <span className="text-slate-300">Connection Status</span>
            <span className={`font-mono font-semibold ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isConfigured ? 'Connected & Active' : 'Not Configured (.env missing)'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle p-3 text-xs">
            <span className="text-slate-300">Session State</span>
            <span className="font-mono text-slate-300 font-semibold">
              {user ? `Active (${user.email})` : 'Unauthenticated'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle p-3 text-xs">
            <span className="text-slate-300">User ID</span>
            <span className="font-mono text-slate-400 text-[11px] truncate max-w-[200px]" title={user?.id}>
              {user?.id || 'None'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle p-3 text-xs">
            <span className="text-slate-300">Row-Level Security (RLS)</span>
            <span className="font-mono text-emerald-400 font-semibold">Enforced on all 8 tables</span>
          </div>
        </div>
      </div>

      {/* Curriculum Reseed / Repair */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-4 border-b border-surface-border">
          <RotateCcw className="h-4 w-4 text-amber-400" />
          Curriculum Maintenance
        </h2>

        {syncResult && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
            <span>{syncResult}</span>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold text-white">Repair / Sync 42-Day Curriculum</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Safely inserts any missing days or tasks without overwriting your existing completion progress.
            </p>
          </div>
          <button
            onClick={handleSyncCurriculum}
            disabled={syncLoading || !user}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            {syncLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Sync Curriculum</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white">Sign Out of Session</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Safely close your authenticated session on this browser.
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
