import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

/**
 * Creates a custom user-defined task.
 * Custom tasks have curriculum_task_key = NULL.
 */
export async function createCustomTask(userId, dayId, taskData) {
  if (!isSupabaseConfigured || !supabase || !userId || !dayId) {
    return { data: null, error: new Error('Cannot create task: Supabase unconfigured or invalid parameters.') };
  }

  try {
    // 1. Fetch day details to get the study_date
    const { data: day, error: dayErr } = await supabase
      .from('learning_days')
      .select('study_date')
      .eq('id', dayId)
      .eq('user_id', userId)
      .single();

    if (dayErr || !day) {
      throw new Error('Associated learning day not found or unauthorized.');
    }

    const { data, error } = await supabase
      .from('learning_tasks')
      .insert({
        user_id: userId,
        learning_day_id: dayId,
        subject: taskData.subject || 'Programming',
        topic: taskData.topic || 'General Practice',
        task_title: taskData.task_title.trim(),
        description: taskData.description?.trim() || '',
        estimated_minutes: Number(taskData.estimated_minutes) || 30,
        is_completed: false,
        task_status: 'Not Started',
        original_date: day.study_date,
        scheduled_date: day.study_date,
        is_carried_forward: false,
        is_backlog: false,
        curriculum_task_key: null, // Strictly null for custom tasks
      })
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('Error creating custom task:', err);
    return { data: null, error: err };
  }
}

/**
 * Updates an existing task's properties (title, description, duration, subject, topic).
 * Original curriculum_task_key is immutably preserved.
 */
export async function updateTask(taskId, updates) {
  if (!isSupabaseConfigured || !supabase || !taskId) {
    return { data: null, error: new Error('Cannot update task: missing parameters.') };
  }

  try {
    const payload = {};
    if (updates.task_title !== undefined) payload.task_title = updates.task_title.trim();
    if (updates.description !== undefined) payload.description = updates.description.trim();
    if (updates.estimated_minutes !== undefined) payload.estimated_minutes = Number(updates.estimated_minutes);
    if (updates.subject !== undefined) payload.subject = updates.subject;
    if (updates.topic !== undefined) payload.topic = updates.topic;
    if (updates.task_status !== undefined) payload.task_status = updates.task_status;
    if (updates.is_completed !== undefined) {
      payload.is_completed = updates.is_completed;
      if (updates.task_status === undefined) {
        payload.task_status = updates.is_completed ? 'Completed' : 'Not Started';
      }
    }

    const { data, error } = await supabase
      .from('learning_tasks')
      .update(payload)
      .eq('id', taskId)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('Error updating task:', err);
    return { data: null, error: err };
  }
}

/**
 * Deletes a task by ID.
 */
export async function deleteTask(taskId) {
  if (!isSupabaseConfigured || !supabase || !taskId) {
    return { error: new Error('Cannot delete: missing parameters.') };
  }

  try {
    const { error } = await supabase
      .from('learning_tasks')
      .delete()
      .eq('id', taskId);

    return { error };
  } catch (err) {
    console.error('Error deleting task:', err);
    return { error: err };
  }
}

/**
 * Transactional Task Carry-Forward / Reschedule using PostgreSQL RPC `reschedule_task`.
 * Moves an unfinished task to another future day OR into the unscheduled backlog.
 * Writes to `task_reschedule_history` in the same atomic transaction.
 */
export async function rescheduleTask(taskId, destinationDayId, newScheduledDate, isBacklog, reason = '') {
  if (!isSupabaseConfigured || !supabase || !taskId) {
    return { success: false, error: 'Cannot reschedule: Supabase unconfigured or task missing.' };
  }

  try {
    const { data, error } = await supabase.rpc('reschedule_task', {
      p_task_id: taskId,
      p_destination_day_id: isBacklog ? null : destinationDayId,
      p_new_scheduled_date: isBacklog ? null : newScheduledDate,
      p_is_backlog: Boolean(isBacklog),
      p_reason: reason.trim(),
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error in rescheduleTask RPC:', err);
    return { success: false, error: err.message || 'Rescheduling failed.' };
  }
}

/**
 * Updates learning day notes.
 */
export async function updateDayNotes(dayId, notes) {
  if (!isSupabaseConfigured || !supabase || !dayId) {
    return { data: null, error: new Error('Cannot update day notes: missing parameters.') };
  }

  try {
    const { data, error } = await supabase
      .from('learning_days')
      .update({ notes: notes || '' })
      .eq('id', dayId)
      .select('id, notes, updated_at')
      .single();

    return { data, error };
  } catch (err) {
    console.error('Error updating day notes:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetches basic day list (Day number, date, title) for the carry-forward modal selector.
 */
export async function fetchAllDaysBasic(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('learning_days')
      .select('id, day_number, study_date, title')
      .eq('user_id', userId)
      .order('day_number', { ascending: true });

    return { data: data || [], error };
  } catch (err) {
    console.error('Error fetching basic days:', err);
    return { data: [], error: err.message };
  }
}

/**
 * Fetches audit reschedule history for a specific task.
 */
export async function fetchTaskRescheduleHistory(taskId) {
  if (!isSupabaseConfigured || !supabase || !taskId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('task_reschedule_history')
      .select('*')
      .eq('task_id', taskId)
      .order('rescheduled_at', { ascending: false });

    return { data: data || [], error };
  } catch (err) {
    console.error('Error fetching reschedule history:', err);
    return { data: [], error: err.message };
  }
}
