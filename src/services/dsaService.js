import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getIndiaTodayDate } from './dashboardService.js';

export const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Linked List',
  'Stack',
  'Queue',
  'Trees & BST',
  'Heap & Priority Queue',
  'Recursion & Backtracking',
  'Dynamic Programming',
  'Graphs',
  'Bit Manipulation',
  'Greedy',
  'Math & Geometry',
];

export const DSA_PATTERNS = [
  'Two Pointers',
  'Fast & Slow Pointers',
  'Sliding Window (Fixed)',
  'Sliding Window (Dynamic)',
  'Prefix Sum / Running Sum',
  'Binary Search on Array',
  'Binary Search on Answer Range',
  'Monotonic Stack',
  'In-place Reversal of LinkedList',
  'Top K Elements (Heap)',
  'K-way Merge',
  'Merge Intervals',
  'Tree Breadth-First Search (BFS)',
  'Tree Depth-First Search (DFS)',
  'Backtracking / Permutations / Subsets',
  '0/1 Knapsack / Subset DP',
  'Fibonacci Numbers / 1D DP',
  'Longest Common Subsequence (LCS)',
  'Longest Increasing Subsequence (LIS)',
  'Topological Sort',
  'Union Find / Disjoint Set',
  'Bitwise XOR manipulation',
  'Other / Custom Pattern',
];

export const BIG_O_COMPLEXITIES = [
  'O(1)',
  'O(log N)',
  'O(N)',
  'O(N log N)',
  'O(N^2)',
  'O(2^N)',
  'O(N!)',
];

/**
 * Fetches all DSA problems for the authenticated user.
 */
export async function fetchDsaProblems(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('dsa_problems')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Error fetching DSA problems:', err);
    return { data: [], error: err.message || err };
  }
}

/**
 * Creates a new DSA problem record.
 */
export async function createDsaProblem(userId, problemData) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: null, error: new Error('Database not configured or missing user.') };
  }

  try {
    const today = getIndiaTodayDate();
    const isSolved = problemData.status === 'Solved';
    const trimmedName = problemData.problem_name.trim();

    // Duplicate check: case-insensitive & trimmed
    const { data: existing } = await supabase
      .from('dsa_problems')
      .select('id, problem_name')
      .eq('user_id', userId)
      .ilike('problem_name', trimmedName);

    if (existing && existing.length > 0) {
      throw new Error(
        `A problem titled "${existing[0].problem_name}" has already been logged. You can edit the existing entry.`
      );
    }

    const payload = {
      user_id: userId,
      problem_name: trimmedName,
      problem_url: problemData.problem_url?.trim() || '',
      topic: problemData.topic || 'Arrays',
      pattern: problemData.pattern || '',
      difficulty: problemData.difficulty || 'Easy',
      language: problemData.language || 'Java',
      status: problemData.status || 'Not Started',
      approach: problemData.approach?.trim() || '',
      brute_force_approach: problemData.brute_force_approach?.trim() || '',
      optimized_approach: problemData.optimized_approach?.trim() || '',
      time_complexity: problemData.time_complexity?.trim() || '',
      space_complexity: problemData.space_complexity?.trim() || '',
      mistakes: problemData.mistakes?.trim() || '',
      revision_notes: problemData.revision_notes?.trim() || '',
      solved_date: isSolved ? problemData.solved_date || today : null,
    };

    const { data, error } = await supabase
      .from('dsa_problems')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(
          `A problem titled "${problemData.problem_name}" has already been logged. You can edit the existing entry.`
        );
      }
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error creating DSA problem:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Updates an existing DSA problem.
 */
export async function updateDsaProblem(problemId, updates) {
  if (!isSupabaseConfigured || !supabase || !problemId) {
    return { data: null, error: new Error('Database not configured or missing problem ID.') };
  }

  try {
    const today = getIndiaTodayDate();
    const payload = {
      updated_at: new Date().toISOString(),
    };

    if (updates.problem_name !== undefined) payload.problem_name = updates.problem_name.trim();
    if (updates.problem_url !== undefined) payload.problem_url = updates.problem_url.trim();
    if (updates.topic !== undefined) payload.topic = updates.topic;
    if (updates.pattern !== undefined) payload.pattern = updates.pattern;
    if (updates.difficulty !== undefined) payload.difficulty = updates.difficulty;
    if (updates.language !== undefined) payload.language = updates.language;
    if (updates.status !== undefined) {
      payload.status = updates.status;
      if (updates.status === 'Solved') {
        // Preserve original solved_date if provided (e.g. editing an already solved problem);
        // otherwise default to current India date for new Solved transitions.
        payload.solved_date = updates.solved_date || today;
      } else {
        // Solved -> Attempted, Solved -> Needs Revision, Solved -> Not Started all clear solved_date
        payload.solved_date = null;
      }
    } else if (updates.solved_date !== undefined) {
      payload.solved_date = updates.solved_date;
    }
    if (updates.approach !== undefined) payload.approach = updates.approach.trim();
    if (updates.brute_force_approach !== undefined) payload.brute_force_approach = updates.brute_force_approach.trim();
    if (updates.optimized_approach !== undefined) payload.optimized_approach = updates.optimized_approach.trim();
    if (updates.time_complexity !== undefined) payload.time_complexity = updates.time_complexity.trim();
    if (updates.space_complexity !== undefined) payload.space_complexity = updates.space_complexity.trim();
    if (updates.mistakes !== undefined) payload.mistakes = updates.mistakes.trim();
    if (updates.revision_notes !== undefined) payload.revision_notes = updates.revision_notes.trim();
    if (updates.solved_date !== undefined) payload.solved_date = updates.solved_date;

    const { data, error } = await supabase
      .from('dsa_problems')
      .update(payload)
      .eq('id', problemId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating DSA problem:', err);
    return { data: null, error: err.message || err };
  }
}

/**
 * Deletes a DSA problem record.
 */
export async function deleteDsaProblem(problemId) {
  if (!isSupabaseConfigured || !supabase || !problemId) {
    return { error: new Error('Database not configured or missing problem ID.') };
  }

  try {
    const { error } = await supabase
      .from('dsa_problems')
      .delete()
      .eq('id', problemId);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error deleting DSA problem:', err);
    return { error: err.message || err };
  }
}

/**
 * Quick status updater (e.g. single click toggle between Solved, Needs Revision, Attempted).
 */
export async function quickUpdateDsaStatus(problemId, newStatus) {
  const today = getIndiaTodayDate();
  return updateDsaProblem(problemId, {
    status: newStatus,
    solved_date: newStatus === 'Solved' ? today : null,
  });
}

/**
 * Computes all DSA metrics from a list of problems.
 * CRITICAL RULE: Only status === 'Solved' counts toward solved targets!
 */
export function getDsaMetrics(problems = []) {
  const total = problems.length;
  let solved = 0;
  let needsRevision = 0;
  let attempted = 0;
  let notStarted = 0;

  const difficulty = { Easy: 0, Medium: 0, Hard: 0 };
  const patterns = {};
  const languages = { Java: 0, Python: 0, Both: 0 };

  problems.forEach((p) => {
    // Status counting - STRICT METRIC ISOLATION
    if (p.status === 'Solved') {
      solved += 1;
    } else if (p.status === 'Needs Revision') {
      needsRevision += 1;
    } else if (p.status === 'Attempted') {
      attempted += 1;
    } else {
      notStarted += 1;
    }

    // Difficulty counting
    if (p.difficulty && difficulty[p.difficulty] !== undefined) {
      difficulty[p.difficulty] += 1;
    }

    // Pattern counting
    if (p.pattern) {
      patterns[p.pattern] = (patterns[p.pattern] || 0) + 1;
    }

    // Language counting
    if (p.language && languages[p.language] !== undefined) {
      languages[p.language] += 1;
    }
  });

  const target50Progress = Math.min(100, Math.round((solved / 50) * 100));
  const stretch70Progress = Math.min(100, Math.round((solved / 70) * 100));

  // Top patterns sorted by frequency
  const topPatterns = Object.entries(patterns)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    solved,
    needsRevision,
    attempted,
    notStarted,
    target50Progress,
    stretch70Progress,
    difficulty,
    topPatterns,
    languages,
  };
}
