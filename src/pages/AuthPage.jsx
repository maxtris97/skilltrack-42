import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import ConfigWarningBanner from '../components/common/ConfigWarningBanner';

export default function AuthPage() {
  const { user, signIn, signUp, resetPassword, updatePassword, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Mode can be 'login' | 'register' | 'forgot' | 'update-password'
  const [mode, setMode] = useState('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Destination after login
  const from = location.state?.from?.pathname || '/';

  // Check if URL has recovery or reset mode parameters
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'update-password' || window.location.hash.includes('type=recovery')) {
      setMode('update-password');
    }
  }, [searchParams]);

  // If already authenticated and not updating password, redirect to destination
  useEffect(() => {
    if (user && mode !== 'update-password') {
      navigate(from, { replace: true });
    }
  }, [user, mode, navigate, from]);

  const clearAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleModeChange = (newMode) => {
    clearAlerts();
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!isConfigured) {
      setErrorMessage('Supabase credentials are not configured in your .env file.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Incorrect email or password. Please verify your credentials.');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMessage('Your email address has not been confirmed yet. Please check your inbox.');
          } else {
            setErrorMessage(error.message);
          }
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'register') {
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please re-enter.');
          setLoading(false);
          return;
        }

        const { data, error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('User already registered')) {
            setErrorMessage('An account with this email address already exists. Please sign in instead.');
          } else {
            setErrorMessage(error.message);
          }
        } else if (data?.user && !data?.session) {
          // Email confirmation is required by Supabase project settings
          setSuccessMessage(
            'Account created successfully! We sent a confirmation link to your email. Please verify it before signing in.'
          );
        } else {
          // Direct login without confirmation
          setSuccessMessage('Registration successful! Redirecting to your dashboard...');
          setTimeout(() => navigate(from, { replace: true }), 1000);
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(
            'Password reset link sent! Please check your email inbox to update your password.'
          );
        }
      } else if (mode === 'update-password') {
        if (password.length < 6) {
          setErrorMessage('New password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setLoading(false);
          return;
        }

        const { error } = await updatePassword(password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage('Password updated successfully! You can now access your dashboard.');
          setTimeout(() => navigate('/', { replace: true }), 1200);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4 sm:p-6 selection:bg-brand-primary selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-indigo mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SkillTrack <span className="text-indigo-400">42</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personal Placement & Technical Learning Platform
          </p>
        </div>

        {/* Configuration Warning Banner if variables are unset */}
        {!isConfigured && <ConfigWarningBanner />}

        {/* Auth Card */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 sm:p-8 shadow-xl">
          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && mode !== 'update-password' && (
            <div className="flex rounded-xl bg-surface-subtle p-1 mb-6 border border-surface-border">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Mode Heading for Forgot / Update Password */}
          {mode === 'forgot' && (
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your email address to receive a secure password recovery link.
              </p>
            </div>
          )}

          {mode === 'update-password' && (
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">Set New Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose a strong new password for your SkillTrack account.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
              role="alert"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name field (Registration only) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Full Name / Preferred Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full rounded-xl border border-surface-border bg-surface-subtle py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email field (Login, Register, Forgot) */}
            {mode !== 'update-password' && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@example.com"
                    className="w-full rounded-xl border border-surface-border bg-surface-subtle py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password field (Login, Register, Update Password) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    {mode === 'update-password' ? 'New Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-surface-border bg-surface-subtle py-2.5 pl-9 pr-9 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password field (Register, Update Password) */}
            {(mode === 'register' || mode === 'update-password') && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-surface-border bg-surface-subtle py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-glow-indigo transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In to Dashboard'}
                    {mode === 'register' && 'Register Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    {mode === 'update-password' && 'Save New Password'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login Button */}
          {(mode === 'forgot' || mode === 'update-password') && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Security / Technology Badge */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Protected with Supabase Authentication & PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
}
