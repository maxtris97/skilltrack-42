import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { CURRICULUM_42_DAYS } from '../data/curriculum42Days.js';

export const NOTE_SUBJECTS = [
  'Java',
  'Python',
  'DSA',
  'Full-Stack',
  'Databases',
  'Spring Boot',
  'System Design',
  'Programming',
  'Git & DevOps',
  'Other',
];

/**
 * Fetches all notes for the authenticated user.
 */
export async function fetchNotes(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('learning_notes')
      .select(`
        id,
        user_id,
        topic_id,
        title,
        subject,
        topic,
        content,
        code_snippet,
        mistakes,
        key_takeaways,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Error fetching learning notes:', err);
    return { data: [], error: err.message || err };
  }
}

/**
 * Creates a new learning note.
 */
export async function createNote(userId, noteData) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: null, error: new Error('Database not configured or missing user.') };
  }

  try {
    const payload = {
      user_id: userId,
      topic_id: noteData.topic_id || null,
      title: noteData.title.trim(),
      subject: noteData.subject || 'Programming',
      topic: noteData.topic.trim(),
      content: noteData.content.trim(),
      code_snippet: noteData.code_snippet?.trim() || '',
      mistakes: noteData.mistakes?.trim() || '',
      key_takeaways: noteData.key_takeaways?.trim() || '',
    };

    const { data, error } = await supabase
      .from('learning_notes')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error creating note:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Updates an existing learning note.
 */
export async function updateNote(noteId, updates) {
  if (!isSupabaseConfigured || !supabase || !noteId) {
    return { data: null, error: new Error('Database not configured or missing note ID.') };
  }

  try {
    const payload = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.subject !== undefined) payload.subject = updates.subject;
    if (updates.topic !== undefined) payload.topic = updates.topic.trim();
    if (updates.topic_id !== undefined) payload.topic_id = updates.topic_id || null;
    if (updates.content !== undefined) payload.content = updates.content.trim();
    if (updates.code_snippet !== undefined) payload.code_snippet = updates.code_snippet.trim();
    if (updates.mistakes !== undefined) payload.mistakes = updates.mistakes.trim();
    if (updates.key_takeaways !== undefined) payload.key_takeaways = updates.key_takeaways.trim();

    const { data, error } = await supabase
      .from('learning_notes')
      .update(payload)
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating note:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Deletes a note.
 */
export async function deleteNote(noteId) {
  if (!isSupabaseConfigured || !supabase || !noteId) {
    return { error: new Error('Database not configured or missing note ID.') };
  }

  try {
    const { error } = await supabase
      .from('learning_notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error deleting note:', err);
    return { error: err.message || err };
  }
}

/**
 * Fetches available topics from topic_understanding and curriculum for autocomplete/dropdown.
 */
export async function fetchAvailableTopicsForNotes(userId) {
  const result = [];
  const seen = new Set();

  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data: userTopics } = await supabase
        .from('topic_understanding')
        .select('id, subject, topic')
        .eq('user_id', userId);

      (userTopics || []).forEach((t) => {
        const key = `${t.subject}::${t.topic}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            id: t.id,
            subject: t.subject,
            topic: t.topic,
            isEvaluated: true,
          });
        }
      });
    } catch (e) {
      console.warn('Could not fetch user evaluated topics for notes:', e);
    }
  }

  // Also include curriculum topic templates
  CURRICULUM_42_DAYS.forEach((d) => {
    (d.tasks || []).forEach((t) => {
      if (t.subject && t.topic) {
        const key = `${t.subject}::${t.topic}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            id: null,
            subject: t.subject,
            topic: t.topic,
            isEvaluated: false,
          });
        }
      }
    });
  });

  return result.sort((a, b) => a.topic.localeCompare(b.topic));
}

/**
 * Calculates summary metrics from a list of notes.
 */
export function getNoteMetrics(notes = []) {
  const total = notes.length;
  let withCode = 0;
  let withMistakes = 0;
  let withTakeaways = 0;
  const subjects = {};

  notes.forEach((n) => {
    if (n.code_snippet && n.code_snippet.trim()) withCode += 1;
    if (n.mistakes && n.mistakes.trim()) withMistakes += 1;
    if (n.key_takeaways && n.key_takeaways.trim()) withTakeaways += 1;

    const s = n.subject || 'Other';
    subjects[s] = (subjects[s] || 0) + 1;
  });

  const subjectBreakdown = Object.entries(subjects)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    withCode,
    withMistakes,
    withTakeaways,
    subjectBreakdown,
  };
}
