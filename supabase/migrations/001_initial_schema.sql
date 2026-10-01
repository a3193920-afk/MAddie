-- Supabase / PostgreSQL Schema for CampusCalm
-- Privacy-first campus mental wellness companion with RLS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Anonymous-first, minimal PII)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_alias VARCHAR(50) DEFAULT 'Calm Scholar',
    academic_year VARCHAR(20),
    department VARCHAR(100),
    residence_type VARCHAR(30) CHECK (residence_type IN ('hostel', 'day_scholar', 'pg', 'family')),
    preferred_language VARCHAR(30) DEFAULT 'en_hinglish',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Consents & Privacy Settings Table
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    ai_conversations BOOLEAN DEFAULT TRUE,
    mood_tracking BOOLEAN DEFAULT TRUE,
    journal_analysis_opt_in BOOLEAN DEFAULT FALSE,
    behavior_insights_opt_in BOOLEAN DEFAULT TRUE,
    menstrual_tracking_opt_in BOOLEAN DEFAULT FALSE,
    anonymous_community_opt_in BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Daily Check-ins (Mood, Stress, Sleep, Energy)
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INT CHECK (mood_score BETWEEN 1 AND 5),
    stress_score INT CHECK (stress_score BETWEEN 1 AND 5),
    energy_score INT CHECK (energy_score BETWEEN 1 AND 5),
    sleep_quality VARCHAR(30),
    sleep_hours NUMERIC(4, 2),
    stressors TEXT[],
    notes_hash TEXT, -- Never store raw sensitive thoughts in plaintext
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Encrypted Journal Entries (Client-Side AES-256-GCM)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    ciphertext TEXT NOT NULL, -- Encrypted locally via Web Crypto API
    iv VARCHAR(64) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    mood_tag INT,
    stress_tag INT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Chat Sessions & Messages
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mode VARCHAR(50) DEFAULT 'Help me understand',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    safety_level VARCHAR(30) DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Interventions & Outcome Feedback ("What worked for me?")
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration_minutes INT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS intervention_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    intervention_id VARCHAR(50) REFERENCES interventions(id),
    rating VARCHAR(20) CHECK (rating IN ('worse', 'same', 'a_little', 'a_lot')),
    stress_before INT,
    stress_after INT,
    mood_before INT,
    mood_after INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Personal Baseline Metrics
CREATE TABLE IF NOT EXISTS baseline_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_name VARCHAR(50) NOT NULL,
    rolling_baseline_value NUMERIC(6, 2) NOT NULL,
    current_value NUMERIC(6, 2) NOT NULL,
    deviation_percent NUMERIC(6, 2),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Safety Events (Audit trail for crisis safety intercepts)
CREATE TABLE IF NOT EXISTS safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    risk_tier VARCHAR(50) NOT NULL,
    trigger_rule VARCHAR(100),
    hard_stop_enforced BOOLEAN DEFAULT TRUE,
    resources_presented TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Anonymous Community
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_alias VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    reactions JSONB DEFAULT '{"hug": 0, "relate": 0, "strength": 0}'::jsonb,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Menstrual Cycle Tracking (Consent-only)
CREATE TABLE IF NOT EXISTS cycle_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cycle_start_date DATE NOT NULL,
    cycle_duration INT DEFAULT 28,
    symptoms TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseline_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and edit own profile" ON profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own consents" ON consents
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and add own mood entries" ON mood_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and add own journal entries" ON journal_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cycle entries" ON cycle_entries
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
