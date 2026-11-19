import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

/**
 * Returns the current date in Indian Standard Time (IST / Asia/Kolkata) as 'YYYY-MM-DD'.
 */
export function getIndiaTodayDate() {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  } catch (err) {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Fetches all live aggregated dashboard metrics for the authenticated user.
 * Zero hardcoded statistics: all figures derived from actual Supabase records.
 */
export async function fetchDashboardData(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return {
      hasData: false,
      completedDays: 0,
      totalDays: 42,
      studyHours: '0.0',
      dsaSolved: 0,
      pendingTasks: 0,
      totalCurriculumTasks: 0,
      completedCurriculumTasks: 0,
      overallProgress: 0,
      totalTopicsTracked: 0,
      confidentTopicsCount: 0,
      needsPracticeCount: 0,
      learningTopicsCount: 0,
      dueRevisionCount: 0,
      overdueRevisionCount: 0,
      upcomingRevisionCount: 0,
      subjectBreakdown: [],
      todayFocus: null,
      backlogCount: 0,
    };
  }

  try {
    const todayDate = getIndiaTodayDate();

    // 1. Fetch days
    const { data: days, error: daysErr } = await supabase
      .from('learning_days')
      .select('id, day_number, study_date, title, status, notes')
      .eq('user_id', userId)
      .order('day_number', { ascending: true });

    if (daysErr) throw daysErr;

    // 2. Fetch non-backlog tasks
    const { data: tasks, error: tasksErr } = await supabase
      .from('learning_tasks')
      .select('id, learning_day_id, subject, topic, task_title, description, estimated_minutes, is_completed, task_status, scheduled_date, is_backlog')
      .eq('user_id', userId);

    if (tasksErr) throw tasksErr;

    // 3. Fetch study logs for total hours
    const { data: studyLogs, error: logsErr } = await supabase
      .from('study_logs')
      .select('duration_minutes')
      .eq('user_id', userId);

    if (logsErr) throw logsErr;

    // 4. Fetch DSA problems (strictly 'Solved')
    const { data: dsaProblems, error: dsaErr } = await supabase
      .from('dsa_problems')
      .select('id, status')
      .eq('user_id', userId);

    if (dsaErr) throw dsaErr;

    // 5. Fetch Topic Understanding counts and revision schedules
    const { data: topics, error: topicsErr } = await supabase
      .from('topic_understanding')
      .select('id, status, self_rating, next_revision_date, last_revised_at')
      .eq('user_id', userId);

    if (topicsErr) throw topicsErr;

    // --- Calculations ---

    // Total study minutes from real study_logs
    const totalMinutes = (studyLogs || []).reduce((acc, log) => acc + (log.duration_minutes || 0), 0);
    const studyHours = (totalMinutes / 60).toFixed(1);

    // DSA metrics: strictly count 'Solved'
    const dsaSolved = (dsaProblems || []).filter((p) => p.status === 'Solved').length;

    // Tasks metrics
    const nonBacklogTasks = (tasks || []).filter((t) => !t.is_backlog);
    const backlogCount = (tasks || []).filter((t) => t.is_backlog).length;
    const completedTasks = nonBacklogTasks.filter((t) => t.is_completed).length;
    const pendingTasks = nonBacklogTasks.filter((t) => !t.is_completed).length;
    const totalTasksCount = nonBacklogTasks.length;
    const overallProgress = totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;

    // Completed days: days marked 'Completed' OR days where all tasks are completed
    let completedDaysCount = 0;
    if (days && days.length > 0) {
      completedDaysCount = days.filter((d) => {
        if (d.status === 'Completed') return true;
        const dayTasks = nonBacklogTasks.filter((t) => t.learning_day_id === d.id);
        return dayTasks.length > 0 && dayTasks.every((t) => t.is_completed);
      }).length;
    }

    // Topic confidence and revision metrics
    const totalTopicsTracked = (topics || []).length;
    const confidentTopicsCount = (topics || []).filter((t) => t.status === 'Confident').length;
    const needsPracticeCount = (topics || []).filter((t) => t.status === 'Needs Practice').length;
    const learningTopicsCount = (topics || []).filter((t) => t.status === 'Learning').length;
    const dueRevisionCount = (topics || []).filter(
      (t) => t.next_revision_date && t.next_revision_date <= todayDate
    ).length;
    const overdueRevisionCount = (topics || []).filter(
      (t) => t.next_revision_date && t.next_revision_date < todayDate
    ).length;
    const upcomingRevisionCount = (topics || []).filter(
      (t) => t.next_revision_date && t.next_revision_date > todayDate
    ).length;

    // Subject breakdown calculation
    const subjectMap = {};
    nonBacklogTasks.forEach((t) => {
      const subj = t.subject || 'Other';
      if (!subjectMap[subj]) {
        subjectMap[subj] = { total: 0, completed: 0 };
      }
      subjectMap[subj].total += 1;
      if (t.is_completed) {
        subjectMap[subj].completed += 1;
      }
    });

    const subjectBreakdown = Object.entries(subjectMap).map(([subject, stats]) => ({
      subject,
      total: stats.total,
      completed: stats.completed,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    })).sort((a, b) => b.total - a.total);

    // Determine Today's Focus
    // Find day matching Indian local date. If current date is before Day 1 (Nov 20, 2026), default to Day 1.
    let todayDay = null;
    if (days && days.length > 0) {
      todayDay = days.find((d) => d.study_date === todayDate) || days[0];
      if (todayDay) {
        // Attach today's scheduled tasks (excluding backlog)
        const scheduledTasks = (tasks || []).filter(
          (t) => (t.learning_day_id === todayDay.id || t.scheduled_date === todayDay.study_date) && !t.is_backlog
        );
        todayDay = {
          ...todayDay,
          tasks: scheduledTasks,
          isUpcoming: todayDate < todayDay.study_date,
        };
      }
    }

    return {
      hasData: (days && days.length > 0) || (tasks && tasks.length > 0),
      completedDays: completedDaysCount,
      totalDays: days?.length || 42,
      studyHours,
      dsaSolved,
      pendingTasks,
      totalCurriculumTasks: totalTasksCount,
      completedCurriculumTasks: completedTasks,
      overallProgress,
      totalTopicsTracked,
      confidentTopicsCount,
      needsPracticeCount,
      learningTopicsCount,
      dueRevisionCount,
      overdueRevisionCount,
      upcomingRevisionCount,
      subjectBreakdown,
      todayFocus: todayDay,
      backlogCount,
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return {
      hasData: false,
      error: err.message,
      completedDays: 0,
      totalDays: 42,
      studyHours: '0.0',
      dsaSolved: 0,
      pendingTasks: 0,
      totalCurriculumTasks: 0,
      completedCurriculumTasks: 0,
      overallProgress: 0,
      totalTopicsTracked: 0,
      confidentTopicsCount: 0,
      needsPracticeCount: 0,
      learningTopicsCount: 0,
      dueRevisionCount: 0,
      overdueRevisionCount: 0,
      upcomingRevisionCount: 0,
      subjectBreakdown: [],
      todayFocus: null,
      backlogCount: 0,
    };
  }
}
