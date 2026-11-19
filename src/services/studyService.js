import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { CURRICULUM_42_DAYS } from '../data/curriculum42Days.js';
import { getIndiaTodayDate } from './dashboardService.js';

export const STUDY_SUBJECTS = [
  'Java',
  'Python',
  'DSA',
  'Full-Stack',
  'Databases',
  'Spring Boot',
  'System Design',
  'Core CS',
  'Revision',
  'Other',
];

/**
 * Fetches all study logs for a user with optional filtering.
 */
export async function fetchStudyLogs(userId, options = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: [], error: null };
  }

  try {
    let query = supabase
      .from('study_logs')
      .select('id, user_id, study_date, subject, topic, duration_minutes, reflection, productivity_rating, created_at')
      .eq('user_id', userId)
      .order('study_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (options.subject && options.subject !== 'All Subjects') {
      query = query.eq('subject', options.subject);
    }
    if (options.startDate) {
      query = query.gte('study_date', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('study_date', options.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Error fetching study logs:', err);
    return { data: [], error: err.message || err };
  }
}

/**
 * Creates a new study log entry.
 */
export async function createStudyLog(userId, logData) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: null, error: new Error('Database not configured or missing user.') };
  }

  try {
    const durationMinutes = parseInt(logData.duration_minutes, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      return { data: null, error: new Error('Study duration must be greater than 0 minutes.') };
    }

    const rating = parseInt(logData.productivity_rating, 10);
    const clampedRating = isNaN(rating) ? 3 : Math.max(1, Math.min(5, rating));

    const studyDate = logData.study_date ? logData.study_date.trim() : getIndiaTodayDate();

    const payload = {
      user_id: userId,
      study_date: studyDate,
      subject: (logData.subject || 'Other').trim(),
      topic: (logData.topic || '').trim(),
      duration_minutes: durationMinutes,
      reflection: (logData.reflection || '').trim(),
      productivity_rating: clampedRating,
    };

    const { data, error } = await supabase
      .from('study_logs')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error creating study log:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Updates an existing study log entry.
 */
export async function updateStudyLog(logId, updates) {
  if (!isSupabaseConfigured || !supabase || !logId) {
    return { data: null, error: new Error('Database not configured or missing log ID.') };
  }

  try {
    const payload = {};

    if (updates.study_date !== undefined) payload.study_date = updates.study_date.trim();
    if (updates.subject !== undefined) payload.subject = updates.subject.trim();
    if (updates.topic !== undefined) payload.topic = updates.topic.trim();
    if (updates.reflection !== undefined) payload.reflection = updates.reflection.trim();

    if (updates.duration_minutes !== undefined) {
      const mins = parseInt(updates.duration_minutes, 10);
      if (isNaN(mins) || mins <= 0) {
        return { data: null, error: new Error('Study duration must be greater than 0 minutes.') };
      }
      payload.duration_minutes = mins;
    }

    if (updates.productivity_rating !== undefined) {
      const rating = parseInt(updates.productivity_rating, 10);
      payload.productivity_rating = isNaN(rating) ? 3 : Math.max(1, Math.min(5, rating));
    }

    const { data, error } = await supabase
      .from('study_logs')
      .update(payload)
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating study log:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Deletes a study log entry.
 */
export async function deleteStudyLog(logId) {
  if (!isSupabaseConfigured || !supabase || !logId) {
    return { error: new Error('Database not configured or missing log ID.') };
  }

  try {
    const { error } = await supabase
      .from('study_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error deleting study log:', err);
    return { error: err.message || err };
  }
}

/**
 * Fetches topic suggestions from curriculum and evaluated topics for autocomplete.
 */
export async function fetchStudyTopicSuggestions(userId) {
  const result = [];
  const seen = new Set();

  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data: userTopics } = await supabase
        .from('topic_understanding')
        .select('subject, topic')
        .eq('user_id', userId);

      (userTopics || []).forEach((t) => {
        const key = `${t.subject}::${t.topic}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push({ subject: t.subject, topic: t.topic });
        }
      });
    } catch (e) {
      console.warn('Could not fetch user evaluated topics for study suggestions:', e);
    }
  }

  CURRICULUM_42_DAYS.forEach((d) => {
    (d.tasks || []).forEach((t) => {
      if (t.subject && t.topic) {
        const key = `${t.subject}::${t.topic}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push({ subject: t.subject, topic: t.topic });
        }
      }
    });
  });

  return result.sort((a, b) => a.topic.localeCompare(b.topic));
}

/**
 * Calculates study metrics from an array of study logs.
 */
export function getStudyMetrics(logs = [], todayDate = getIndiaTodayDate()) {
  const totalSessions = logs.length;
  let totalMinutes = 0;
  let todayMinutes = 0;
  let ratingSum = 0;
  const subjectMap = {};
  const dailyMap = {};

  logs.forEach((log) => {
    const mins = log.duration_minutes || 0;
    totalMinutes += mins;

    if (log.study_date === todayDate) {
      todayMinutes += mins;
    }

    ratingSum += (log.productivity_rating || 3);

    const s = log.subject || 'Other';
    if (!subjectMap[s]) {
      subjectMap[s] = { minutes: 0, count: 0 };
    }
    subjectMap[s].minutes += mins;
    subjectMap[s].count += 1;

    const d = log.study_date;
    dailyMap[d] = (dailyMap[d] || 0) + mins;
  });

  const totalHours = (totalMinutes / 60).toFixed(1);
  const todayHours = (todayMinutes / 60).toFixed(1);
  const averageRating = totalSessions > 0 ? (ratingSum / totalSessions).toFixed(1) : null;
  const averageSessionMins = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const subjectBreakdown = Object.entries(subjectMap)
    .map(([subject, info]) => {
      const hours = (info.minutes / 60).toFixed(1);
      const percentage = totalMinutes > 0 ? Math.round((info.minutes / totalMinutes) * 100) : 0;
      return {
        subject,
        minutes: info.minutes,
        hours: Number(hours),
        percentage,
        count: info.count,
      };
    })
    .sort((a, b) => b.minutes - a.minutes);

  return {
    totalSessions,
    totalMinutes,
    totalHours: Number(totalHours),
    todayMinutes,
    todayHours: Number(todayHours),
    averageRating: averageRating ? Number(averageRating) : 0,
    averageSessionMins,
    subjectBreakdown,
    dailyMap,
  };
}
