-- =========================================================================
-- SkillTrack 42: Master Database Schema & Row-Level Security
-- Idempotent, safe for repeated execution
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 0. SHARED UPDATED_AT TRIGGER FUNCTION
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- -------------------------------------------------------------------------
-- 1. USER PROFILES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT DEFAULT '',
    daily_goal_minutes INTEGER DEFAULT 120,
    target_dsa_count INTEGER DEFAULT 50,
    stretch_dsa_count INTEGER DEFAULT 70,
    theme_preference TEXT DEFAULT 'dark',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- SECURED handle_new_user() SECURITY DEFINER trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data ->> 'display_name',
            pg_catalog.split_part(COALESCE(NEW.email, ''), '@', 1)
        )
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 2. 42 LEARNING DAYS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 42),
    study_date DATE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 6),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_day_number UNIQUE (user_id, day_number),
    CONSTRAINT unique_user_study_date UNIQUE (user_id, study_date),
    CONSTRAINT unique_user_day_id UNIQUE (user_id, id)
);

DROP TRIGGER IF EXISTS trg_learning_days_updated_at ON public.learning_days;
CREATE TRIGGER trg_learning_days_updated_at
    BEFORE UPDATE ON public.learning_days
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- 3. LEARNING TASKS TABLE (With Backlog / Post-Day 42 Carry-Forward Support)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    learning_day_id UUID, -- Nullable to allow backlog tasks carried forward beyond Day 42
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    task_title TEXT NOT NULL,
    description TEXT DEFAULT '',
    estimated_minutes INTEGER DEFAULT 30,
    is_completed BOOLEAN DEFAULT FALSE,
    task_status TEXT NOT NULL DEFAULT 'Not Started' CHECK (task_status IN ('Not Started', 'In Progress', 'Completed', 'Needs Revision')),
    original_date DATE NOT NULL,
    scheduled_date DATE NOT NULL,
    is_carried_forward BOOLEAN DEFAULT FALSE,
    is_backlog BOOLEAN DEFAULT FALSE, -- Flag for tasks carried beyond Day 42 into unscheduled backlog
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Composite FK: Enforces learning_day belongs to the EXACT SAME user (matches if learning_day_id is not null)
    CONSTRAINT fk_tasks_learning_day_user FOREIGN KEY (user_id, learning_day_id)
        REFERENCES public.learning_days(user_id, id) ON DELETE CASCADE,
    CONSTRAINT unique_user_task_id UNIQUE (user_id, id),
    CONSTRAINT unique_user_day_task_title UNIQUE (user_id, learning_day_id, task_title)
);

DROP TRIGGER IF EXISTS trg_learning_tasks_updated_at ON public.learning_tasks;
CREATE TRIGGER trg_learning_tasks_updated_at
    BEFORE UPDATE ON public.learning_tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- 4. TASK RESCHEDULE HISTORY (AUDIT TRAIL)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.task_reschedule_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE, -- Nullable if moved to unscheduled backlog
    reason TEXT DEFAULT '',
    rescheduled_at TIMESTAMPTZ DEFAULT NOW(),
    -- Composite FK: Enforces referenced task belongs to the EXACT SAME user
    CONSTRAINT fk_reschedule_task_user FOREIGN KEY (user_id, task_id)
        REFERENCES public.learning_tasks(user_id, id) ON DELETE CASCADE
);

-- -------------------------------------------------------------------------
-- 5. TOPIC UNDERSTANDING TRACKER (MASTERY INDEPENDENT OF TASKS)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topic_understanding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'Learning', 'Needs Practice', 'Confident')),
    self_rating INTEGER DEFAULT 1 CHECK (self_rating BETWEEN 1 AND 5),
    understood_notes TEXT DEFAULT '',
    gaps_notes TEXT DEFAULT '',
    questions TEXT DEFAULT '',
    mistakes TEXT DEFAULT '',
    practice_required TEXT DEFAULT '',
    last_revised_at DATE,
    next_revision_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_subject_topic UNIQUE (user_id, subject, topic)
);

DROP TRIGGER IF EXISTS trg_topic_understanding_updated_at ON public.topic_understanding;
CREATE TRIGGER trg_topic_understanding_updated_at
    BEFORE UPDATE ON public.topic_understanding
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- 6. DSA PROBLEMS TRACKER (Strict 'Solved' metric isolation)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    problem_name TEXT NOT NULL,
    problem_url TEXT DEFAULT '',
    topic TEXT NOT NULL,
    pattern TEXT DEFAULT '',
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    language TEXT NOT NULL CHECK (language IN ('Java', 'Python', 'Both')),
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'Attempted', 'Solved', 'Needs Revision')),
    approach TEXT DEFAULT '',
    brute_force_approach TEXT DEFAULT '',
    optimized_approach TEXT DEFAULT '',
    time_complexity TEXT DEFAULT '',
    space_complexity TEXT DEFAULT '',
    mistakes TEXT DEFAULT '',
    revision_notes TEXT DEFAULT '',
    solved_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_dsa_problems_updated_at ON public.dsa_problems;
CREATE TRIGGER trg_dsa_problems_updated_at
    BEFORE UPDATE ON public.dsa_problems
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- 7. LEARNING NOTES AND CODING JOURNAL
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    code_snippet TEXT DEFAULT '',
    mistakes TEXT DEFAULT '',
    key_takeaways TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_learning_notes_updated_at ON public.learning_notes;
CREATE TRIGGER trg_learning_notes_updated_at
    BEFORE UPDATE ON public.learning_notes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- 8. STUDY TIME TRACKER
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    study_date DATE NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT DEFAULT '',
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    reflection TEXT DEFAULT '',
    productivity_rating INTEGER DEFAULT 3 CHECK (productivity_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_learning_days_user_date ON public.learning_days(user_id, study_date);
CREATE INDEX IF NOT EXISTS idx_learning_tasks_user_day ON public.learning_tasks(user_id, learning_day_id);
CREATE INDEX IF NOT EXISTS idx_learning_tasks_scheduled ON public.learning_tasks(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_learning_tasks_backlog ON public.learning_tasks(user_id, is_backlog);
CREATE INDEX IF NOT EXISTS idx_topic_understanding_user_status ON public.topic_understanding(user_id, status);
CREATE INDEX IF NOT EXISTS idx_dsa_problems_user_status ON public.dsa_problems(user_id, status);
CREATE INDEX IF NOT EXISTS idx_learning_notes_user_subject ON public.learning_notes(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_study_logs_user_date ON public.study_logs(user_id, study_date);

-- -------------------------------------------------------------------------
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reschedule_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_understanding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_logs ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
        'user_profiles', 'learning_days', 'learning_tasks', 'task_reschedule_history',
        'topic_understanding', 'dsa_problems', 'learning_notes', 'study_logs'
    )
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "%s_select" ON public.%s;
            DROP POLICY IF EXISTS "%s_insert" ON public.%s;
            DROP POLICY IF EXISTS "%s_update" ON public.%s;
            DROP POLICY IF EXISTS "%s_delete" ON public.%s;

            CREATE POLICY "%s_select" ON public.%s FOR SELECT USING (auth.uid() = %s);
            CREATE POLICY "%s_insert" ON public.%s FOR INSERT WITH CHECK (auth.uid() = %s);
            CREATE POLICY "%s_update" ON public.%s FOR UPDATE USING (auth.uid() = %s) WITH CHECK (auth.uid() = %s);
            CREATE POLICY "%s_delete" ON public.%s FOR DELETE USING (auth.uid() = %s);
        ',
        tbl, tbl, tbl, tbl, tbl, tbl, tbl, tbl,
        tbl, tbl, CASE WHEN tbl = 'user_profiles' THEN 'id' ELSE 'user_id' END,
        tbl, tbl, CASE WHEN tbl = 'user_profiles' THEN 'id' ELSE 'user_id' END,
        tbl, tbl, CASE WHEN tbl = 'user_profiles' THEN 'id' ELSE 'user_id' END, CASE WHEN tbl = 'user_profiles' THEN 'id' ELSE 'user_id' END,
        tbl, tbl, CASE WHEN tbl = 'user_profiles' THEN 'id' ELSE 'user_id' END);
    END LOOP;
END $$;

-- -------------------------------------------------------------------------
-- 11. TRANSACTIONAL CURRICULUM SEEDING RPC FUNCTION
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.seed_user_curriculum(p_days jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_day_elem jsonb;
    v_task_elem jsonb;
    v_day_id UUID;
    v_existing_task_id UUID;
    v_days_inserted INT := 0;
    v_days_existing INT := 0;
    v_tasks_inserted INT := 0;
    v_tasks_existing INT := 0;
BEGIN
    -- 1. Enforce authenticated user identity
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to seed curriculum';
    END IF;

    -- 2. Transactionally process days and tasks
    FOR v_day_elem IN SELECT * FROM jsonb_array_elements(p_days)
    LOOP
        -- Check if day already exists for this user
        SELECT id INTO v_day_id
        FROM public.learning_days
        WHERE user_id = v_user_id
          AND day_number = (v_day_elem->>'day_number')::INT;

        IF v_day_id IS NULL THEN
            INSERT INTO public.learning_days (
                user_id,
                day_number,
                study_date,
                week_number,
                title,
                status,
                notes
            ) VALUES (
                v_user_id,
                (v_day_elem->>'day_number')::INT,
                (v_day_elem->>'study_date')::DATE,
                (v_day_elem->>'week_number')::INT,
                v_day_elem->>'title',
                'Not Started',
                ''
            )
            RETURNING id INTO v_day_id;

            v_days_inserted := v_days_inserted + 1;
        ELSE
            v_days_existing := v_days_existing + 1;
        END IF;

        -- Process associated tasks for this day
        IF v_day_elem ? 'tasks' AND jsonb_typeof(v_day_elem->'tasks') = 'array' THEN
            FOR v_task_elem IN SELECT * FROM jsonb_array_elements(v_day_elem->'tasks')
            LOOP
                -- Check if task already exists for this day and user with matching title
                SELECT id INTO v_existing_task_id
                FROM public.learning_tasks
                WHERE user_id = v_user_id
                  AND learning_day_id = v_day_id
                  AND task_title = v_task_elem->>'task_title';

                IF v_existing_task_id IS NULL THEN
                    INSERT INTO public.learning_tasks (
                        user_id,
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
                    ) VALUES (
                        v_user_id,
                        v_day_id,
                        v_task_elem->>'subject',
                        v_task_elem->>'topic',
                        v_task_elem->>'task_title',
                        COALESCE(v_task_elem->>'description', ''),
                        COALESCE((v_task_elem->>'estimated_minutes')::INT, 30),
                        FALSE,
                        'Not Started',
                        (v_day_elem->>'study_date')::DATE,
                        (v_day_elem->>'study_date')::DATE,
                        FALSE,
                        FALSE
                    );

                    v_tasks_inserted := v_tasks_inserted + 1;
                ELSE
                    v_tasks_existing := v_tasks_existing + 1;
                END IF;
            END LOOP;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'days_inserted', v_days_inserted,
        'days_existing', v_days_existing,
        'tasks_inserted', v_tasks_inserted,
        'tasks_existing', v_tasks_existing
    );
END;
$$;
