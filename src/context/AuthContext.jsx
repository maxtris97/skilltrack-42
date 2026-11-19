import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  /**
   * Fetch or auto-provision the user profile record
   */
  const fetchProfile = useCallback(async (userId, fallbackDisplayName = '') => {
    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user profile:', error.message);
      }

      if (data) {
        setProfile(data);
        return data;
      }

      // If profile record does not exist yet (e.g., trigger delayed), create it
      const newProfile = {
        id: userId,
        display_name: fallbackDisplayName || 'Learner',
        daily_goal_minutes: 120,
        target_dsa_count: 50,
        stretch_dsa_count: 70,
        theme_preference: 'dark',
      };

      const { data: inserted, error: insertError } = await supabase
        .from('user_profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .single();

      if (!insertError && inserted) {
        setProfile(inserted);
        return inserted;
      }
    } catch (err) {
      console.warn('Exception during profile retrieval:', err);
    }
    return null;
  }, []);

  // Initialize auth state and attach listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;

      if (error) {
        console.warn('Error getting session:', error.message);
      }

      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        fetchProfile(
          initialSession.user.id,
          initialSession.user.user_metadata?.display_name
        );
      }
      setLoading(false);
    });

    // 2. Listen to auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }

      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        await fetchProfile(
          currentSession.user.id,
          currentSession.user.user_metadata?.display_name
        );
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  /**
   * User Registration
   */
  const signUp = async (email, password, displayName) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || splitEmail(email),
        },
      },
    });

    if (!error && data?.user) {
      await fetchProfile(data.user.id, displayName);
    }

    return { data, error };
  };

  /**
   * User Login
   */
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data?.user) {
      await fetchProfile(data.user.id);
    }

    return { data, error };
  };

  /**
   * User Logout
   */
  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error };
  };

  /**
   * Password Reset Email Request
   */
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    const redirectTo = `${window.location.origin}/auth?mode=update-password`;
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  };

  /**
   * Update Password (when authenticated or in recovery mode)
   */
  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (!error) {
      setRecoveryMode(false);
    }

    return { data, error };
  };

  /**
   * Update Profile Details (display name, goals)
   */
  const updateProfile = async (updates) => {
    if (!isSupabaseConfigured || !supabase || !user) {
      return { data: null, error: new Error('Cannot update profile: unauthenticated.') };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    recoveryMode,
    isConfigured: isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile: () => fetchProfile(user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function splitEmail(email) {
  return email ? email.split('@')[0] : 'Learner';
}
