import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CURRICULUM_42_DAYS } from '../data/curriculum42Days';

// Guard against simultaneous duplicate seeding requests
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
 * Transactional curriculum seeding using PostgreSQL RPC function.
 * If RPC is not yet created in the database, falls back to safe client-side batching.
 * Idempotent: Never overwrites existing user progress, notes, or modified tasks.
 */
export async function seedCurriculum(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { success: false, error: 'Supabase is not configured or user is unauthenticated.' };
  }

  if (isSeedingInProgress) {
    return { success: false, error: 'A curriculum seeding operation is already in progress.' };
  }

  isSeedingInProgress = true;

  try {
    // 1. Primary Path: Call PostgreSQL RPC function `seed_user_curriculum`
    const { data: rpcResult, error: rpcError } = await supabase.rpc('seed_user_curriculum', {
      p_days: CURRICULUM_42_DAYS,
    });

    if (!rpcError && rpcResult) {
      return {
        success: true,
        daysInserted: rpcResult.days_inserted ?? 0,
        daysExisting: rpcResult.days_existing ?? 0,
        tasksInserted: rpcResult.tasks_inserted ?? 0,
        tasksExisting: rpcResult.tasks_existing ?? 0,
        method: 'rpc',
      };
    }

    // If RPC failed due to function not existing, fallback to safe client-side idempotent seeding
    console.warn('RPC seed_user_curriculum not found or errored. Using fallback idempotent seeder:', rpcError?.message);

    let daysInserted = 0;
    let daysExisting = 0;
    let tasksInserted = 0;
    let tasksExisting = 0;

    // Fetch existing days to avoid duplicate inserts
    const { data: existingDays, error: fetchErr } = await supabase
      .from('learning_days')
      .select('id, day_number')
      .eq('user_id', userId);

    if (fetchErr) throw fetchErr;

    const dayMap = new Map((existingDays || []).map((d) => [d.day_number, d.id]));

    // 2. Insert any missing days
    for (const day of CURRICULUM_42_DAYS) {
      let dayId = dayMap.get(day.day_number);

      if (!dayId) {
        const { data: newDay, error: insertDayErr } = await supabase
          .from('learning_days')
          .insert({
            user_id: userId,
            day_number: day.day_number,
            study_date: day.study_date,
            week_number: day.week_number,
            title: day.title,
            status: 'Not Started',
            notes: '',
          })
          .select('id')
          .single();

        if (insertDayErr) throw insertDayErr;
        dayId = newDay.id;
        dayMap.set(day.day_number, dayId);
        daysInserted++;
      } else {
        daysExisting++;
      }

      // 3. Insert any missing tasks for this day
      if (day.tasks && day.tasks.length > 0) {
        const { data: existingTasks } = await supabase
          .from('learning_tasks')
          .select('id, task_title')
          .eq('user_id', userId)
          .eq('learning_day_id', dayId);

        const taskSet = new Set((existingTasks || []).map((t) => t.task_title));

        for (const task of day.tasks) {
          if (!taskSet.has(task.task_title)) {
            const { error: insertTaskErr } = await supabase
              .from('learning_tasks')
              .insert({
                user_id: userId,
                learning_day_id: dayId,
                subject: task.subject,
                topic: task.topic,
                task_title: task.task_title,
                description: task.description || '',
                estimated_minutes: task.estimated_minutes || 30,
                is_completed: false,
                task_status: 'Not Started',
                original_date: day.study_date,
                scheduled_date: day.study_date,
                is_carried_forward: false,
                is_backlog: false,
              });

            if (insertTaskErr) throw insertTaskErr;
            tasksInserted++;
          } else {
            tasksExisting++;
          }
        }
      }
    }

    return {
      success: true,
      daysInserted,
      daysExisting,
      tasksInserted,
      tasksExisting,
      method: 'client-fallback',
    };
  } catch (err) {
    console.error('Fatal error during curriculum seeding:', err);
    return { success: false, error: err.message || 'Seeding failed' };
  } finally {
    isSeedingInProgress = false;
  }
}

/**
 * Fetches all curriculum days with their nested tasks, optionally filtered by week_number.
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
          is_backlog
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
 * Updates a specific task's completion status without affecting other fields.
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
