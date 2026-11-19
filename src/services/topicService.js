import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getIndiaTodayDate } from './dashboardService.js';
import { CURRICULUM_42_DAYS } from '../data/curriculum42Days.js';

/**
 * Fetches all evaluated topics for the given user, joined with related note counts.
 */
export async function fetchTopics(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: [], error: null };
  }

  try {
    // 1. Fetch all topic evaluations
    const { data: topics, error: topicsErr } = await supabase
      .from('topic_understanding')
      .select(`
        id,
        user_id,
        subject,
        topic,
        status,
        self_rating,
        understood_notes,
        gaps_notes,
        questions,
        mistakes,
        practice_required,
        practice_examples,
        personal_notes,
        last_revised_at,
        next_revision_date,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (topicsErr) throw topicsErr;

    // 2. Fetch learning notes to count notes linked to each topic
    const { data: notes, error: notesErr } = await supabase
      .from('learning_notes')
      .select('id, topic_id, topic')
      .eq('user_id', userId);

    if (notesErr) {
      console.warn('Could not fetch related notes count:', notesErr);
    }

    // Map note counts by topic_id and by topic name
    const noteCountMap = {};
    (notes || []).forEach((n) => {
      if (n.topic_id) {
        noteCountMap[n.topic_id] = (noteCountMap[n.topic_id] || 0) + 1;
      }
      if (n.topic) {
        const key = n.topic.toLowerCase().trim();
        noteCountMap[key] = (noteCountMap[key] || 0) + 1;
      }
    });

    const enrichedTopics = (topics || []).map((t) => {
      const byId = noteCountMap[t.id] || 0;
      const byName = noteCountMap[t.topic.toLowerCase().trim()] || 0;
      return {
        ...t,
        notesCount: Math.max(byId, byName),
      };
    });

    return { data: enrichedTopics, error: null };
  } catch (err) {
    console.error('Error fetching topics:', err);
    return { data: [], error: err.message };
  }
}

/**
 * Creates a new topic evaluation for the authenticated user.
 */
export async function createTopic(userId, topicData) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: null, error: new Error('Database not configured or missing user.') };
  }

  try {
    const payload = {
      user_id: userId,
      subject: topicData.subject || 'Programming',
      topic: topicData.topic.trim(),
      status: topicData.status || 'Not Started',
      self_rating: Number(topicData.self_rating) || 1,
      understood_notes: topicData.understood_notes?.trim() || '',
      gaps_notes: topicData.gaps_notes?.trim() || '',
      questions: topicData.questions?.trim() || '',
      mistakes: topicData.mistakes?.trim() || '',
      practice_required: topicData.practice_required?.trim() || '',
      practice_examples: topicData.practice_examples?.trim() || '',
      personal_notes: topicData.personal_notes?.trim() || '',
      last_revised_at: topicData.last_revised_at || null,
      next_revision_date: topicData.next_revision_date || null,
    };

    const { data, error } = await supabase
      .from('topic_understanding')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(
          `A topic evaluation for "${topicData.topic}" under "${topicData.subject}" already exists. Please edit the existing entry.`
        );
      }
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error creating topic:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Updates an existing topic evaluation.
 */
export async function updateTopic(topicId, topicData) {
  if (!isSupabaseConfigured || !supabase || !topicId) {
    return { data: null, error: new Error('Database not configured or missing topic ID.') };
  }

  try {
    const payload = {
      updated_at: new Date().toISOString(),
    };

    if (topicData.subject !== undefined) payload.subject = topicData.subject;
    if (topicData.topic !== undefined) payload.topic = topicData.topic.trim();
    if (topicData.status !== undefined) payload.status = topicData.status;
    if (topicData.self_rating !== undefined) payload.self_rating = Number(topicData.self_rating);
    if (topicData.understood_notes !== undefined) payload.understood_notes = topicData.understood_notes.trim();
    if (topicData.gaps_notes !== undefined) payload.gaps_notes = topicData.gaps_notes.trim();
    if (topicData.questions !== undefined) payload.questions = topicData.questions.trim();
    if (topicData.mistakes !== undefined) payload.mistakes = topicData.mistakes.trim();
    if (topicData.practice_required !== undefined) payload.practice_required = topicData.practice_required.trim();
    if (topicData.practice_examples !== undefined) payload.practice_examples = topicData.practice_examples.trim();
    if (topicData.personal_notes !== undefined) payload.personal_notes = topicData.personal_notes.trim();
    if (topicData.last_revised_at !== undefined) payload.last_revised_at = topicData.last_revised_at || null;
    if (topicData.next_revision_date !== undefined) payload.next_revision_date = topicData.next_revision_date || null;

    const { data, error } = await supabase
      .from('topic_understanding')
      .update(payload)
      .eq('id', topicId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating topic:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Deletes a topic evaluation.
 */
export async function deleteTopic(topicId) {
  if (!isSupabaseConfigured || !supabase || !topicId) {
    return { error: new Error('Database not configured or missing topic ID.') };
  }

  try {
    const { error } = await supabase
      .from('topic_understanding')
      .delete()
      .eq('id', topicId);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error deleting topic:', err);
    return { error: err.message || err };
  }
}

/**
 * Quick action to record revision today and set the next revision date.
 */
export async function quickReviseTopic(topicId, nextRevisionDate) {
  if (!isSupabaseConfigured || !supabase || !topicId) {
    return { data: null, error: new Error('Database not configured or missing topic ID.') };
  }

  try {
    const today = getIndiaTodayDate();
    const { data, error } = await supabase
      .from('topic_understanding')
      .update({
        last_revised_at: today,
        next_revision_date: nextRevisionDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', topicId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error recording topic revision:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Computes topic revision & confidence summary metrics from a list of topics.
 */
export function getTopicRevisionMetrics(topics = [], todayDate = getIndiaTodayDate()) {
  const total = topics.length;
  let confident = 0;
  let needsPractice = 0;
  let learning = 0;
  let notStarted = 0;
  let dueToday = 0;
  let overdue = 0;
  let upcoming = 0;

  topics.forEach((t) => {
    if (t.status === 'Confident') confident += 1;
    else if (t.status === 'Needs Practice') needsPractice += 1;
    else if (t.status === 'Learning') learning += 1;
    else if (t.status === 'Not Started') notStarted += 1;

    if (t.next_revision_date) {
      if (t.next_revision_date === todayDate) {
        dueToday += 1;
      } else if (t.next_revision_date < todayDate) {
        overdue += 1;
      } else {
        upcoming += 1;
      }
    }
  });

  return {
    total,
    confident,
    needsPractice,
    learning,
    notStarted,
    dueToday,
    overdue,
    dueOrOverdue: dueToday + overdue,
    upcoming,
    unscheduled: total - (dueToday + overdue + upcoming),
  };
}

/**
 * Extracts unique topic suggestions from the 42-day curriculum.
 */
export function fetchCurriculumTopicSuggestions() {
  const map = new Map();

  CURRICULUM_42_DAYS.forEach((day) => {
    (day.tasks || []).forEach((t) => {
      if (t.topic && t.subject) {
        const key = `${t.subject}::${t.topic}`.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            subject: t.subject,
            topic: t.topic,
            suggestedDay: day.day_number,
          });
        }
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.topic.localeCompare(b.topic));
}
