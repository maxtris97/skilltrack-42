import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { CURRICULUM_42_DAYS } from '../data/curriculum42Days.js';

// In-flight guard to prevent multiple concurrent seeding calls in the client
let isSeedingInProgress = false;

/**
 * Checks whether the authenticated user has initialized their 42-day curriculum.
 * Returns dayCount, taskCount, and whether the curriculum is complete or partial.
 */
export async function checkCurriculumStatus(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { hasCurriculum: false, dayCount: 0, taskCount: 0, isPartial: false };
  }

  try {
    const { count: dayCount, error: dayErr } = await supabase
      .from('learning_days')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (dayErr) throw dayErr;

    const { count: taskCount, error: taskErr } = await supabase
      .from('learning_tasks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (taskErr) throw taskErr;

    const totalDays = dayCount || 0;
    const totalTasks = taskCount || 0;

    return {
      hasCurriculum: totalDays >= 42,
      dayCount: totalDays,
      taskCount: totalTasks,
      isPartial: totalDays > 0 && totalDays < 42,
    };
  } catch (err) {
    console.error('Error checking curriculum status:', err);
    return { hasCurriculum: false, dayCount: 0, taskCount: 0, isPartial: false, error: err.message };
  }
}

/**
 * Production Transactional Curriculum Seeder.
 * Exclusively executes the PostgreSQL RPC function `seed_user_curriculum`.
 *
 * Guarantees:
 * - Single atomic database transaction (all-or-nothing rollback).
 * - Concurrent-safe with per-user transaction advisory locks.
 * - Stable task identity via `curriculum_task_key` (D01-T01, etc.).
 * - Editing a task title never causes duplication.
 * - Custom tasks (with curriculum_task_key = NULL) remain untouched.
 * - No weak client-side fallbacks with non-atomic multiple inserts.
 */
export async function seedCurriculum(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return {
      success: false,
      error: 'Supabase is not configured or user is unauthenticated. Please check your credentials.',
    };
  }

  if (isSeedingInProgress) {
    return {
      success: false,
      error: 'Curriculum seeding is already in progress. Please wait for the current operation to finish.',
    };
  }

  isSeedingInProgress = true;

  try {
    const { data: rpcResult, error: rpcError } = await supabase.rpc('seed_user_curriculum', {
      p_days: CURRICULUM_42_DAYS,
    });

    if (rpcError) {
      // Check if function does not exist in PostgreSQL
      if (
        rpcError.code === 'PGRST202' ||
        rpcError.message?.includes('function') ||
        rpcError.message?.includes('does not exist')
      ) {
        throw new Error(
          "Database function 'seed_user_curriculum' is not installed in your Supabase project. " +
          "Please open your Supabase SQL Editor, run the entire 'supabase-schema.sql' script, and retry."
        );
      }
      throw new Error(rpcError.message || 'PostgreSQL curriculum seeding failed.');
    }

    if (!rpcResult || !rpcResult.success) {
      throw new Error('RPC completed without success confirmation.');
    }

    return {
      success: true,
      daysInserted: rpcResult.days_inserted ?? 0,
      daysExisting: rpcResult.days_existing ?? 0,
      tasksInserted: rpcResult.tasks_inserted ?? 0,
      tasksExisting: rpcResult.tasks_existing ?? 0,
      method: 'postgresql-rpc-atomic',
    };
  } catch (err) {
    console.error('Curriculum seeding RPC failure:', err);
    return {
      success: false,
      error: err.message || 'Seeding failed. Please check database permissions.',
    };
  } finally {
    isSeedingInProgress = false;
  }
}

/**
 * Fetches all curriculum days with nested tasks, optionally filtered by week_number.
 */
export async function fetchCurriculumDays(userId, weekNumber = null) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: [], error: null };
  }

  try {
    let query = supabase
      .from('learning_days')
      .select(`
        id,
        user_id,
        day_number,
        study_date,
        week_number,
        title,
        status,
        notes,
        created_at,
        updated_at,
        learning_tasks (
          id,
          learning_day_id,
          subject,
          topic,
          task_title,
          description,
          estimated_minutes,
          is_completed,
          task_status,
          original_date,
          scheduled_date,
          is_carried_forward,
          is_backlog,
          curriculum_task_key
        )
      `)
      .eq('user_id', userId)
      .order('day_number', { ascending: true });

    if (weekNumber !== null) {
      query = query.eq('week_number', weekNumber);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err) {
    console.error('Error fetching curriculum days:', err);
    return { data: [], error: err.message };
  }
}

/**
 * Updates a specific task's completion status.
 */
export async function toggleTaskCompletion(taskId, isCompleted) {
  if (!isSupabaseConfigured || !supabase || !taskId) {
    return { data: null, error: new Error('Cannot update: Supabase not configured.') };
  }

  try {
    const { data, error } = await supabase
      .from('learning_tasks')
      .update({
        is_completed: isCompleted,
        task_status: isCompleted ? 'Completed' : 'Not Started',
      })
      .eq('id', taskId)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}
