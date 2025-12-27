-- MyMatchIQ Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(20) DEFAULT 'free'
);

-- 2. Blueprints Table (Self-Assessment)
CREATE TABLE IF NOT EXISTS blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    profile_summary JSONB,
    completion_percentage INTEGER DEFAULT 0
);

-- 3. Scans Table (Assessments)
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scan_type VARCHAR(20) NOT NULL,
    person_name VARCHAR(255),
    interaction_type VARCHAR(50),
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    reflection_notes JSONB,
    categories_completed TEXT[],
    status VARCHAR(20) DEFAULT 'in_progress',
    dual_scan_session_id UUID,
    dual_scan_role VARCHAR(1),
    partner_scan_id UUID REFERENCES scans(id),
    is_unified BOOLEAN DEFAULT FALSE
);

-- 4. Scan Results Table
CREATE TABLE IF NOT EXISTS scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ai_version VARCHAR(20) NOT NULL,
    overall_score INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_scores JSONB NOT NULL,
    ai_analysis JSONB NOT NULL,
    red_flags JSONB DEFAULT '[]'::jsonb,
    inconsistencies JSONB DEFAULT '[]'::jsonb,
    profile_mismatches JSONB DEFAULT '[]'::jsonb,
    explanation_metadata JSONB
);

-- 5. Red Flags Table
CREATE TABLE IF NOT EXISTS red_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    scan_result_id UUID REFERENCES scan_results(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    signal TEXT NOT NULL,
    evidence JSONB,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    pattern_hash VARCHAR(64)
);

-- 6. Pattern Knowledge Base
CREATE TABLE IF NOT EXISTS pattern_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_hash VARCHAR(64) UNIQUE NOT NULL,
    pattern_type VARCHAR(50) NOT NULL,
    pattern_data JSONB NOT NULL,
    occurrence_count INTEGER DEFAULT 1,
    avg_score DECIMAL(5,2),
    score_std_dev DECIMAL(5,2),
    flag_rate DECIMAL(5,4),
    avg_confidence DECIMAL(5,4),
    outcome_distribution JSONB,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. AI Logic Versions
CREATE TABLE IF NOT EXISTS ai_logic_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    scoring_config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    activated_at TIMESTAMP WITH TIME ZONE,
    changes JSONB
);

-- 8. User Feedback
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_result_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    was_accurate BOOLEAN,
    feedback_text TEXT,
    score_accuracy INTEGER,
    explanation_helpfulness INTEGER,
    flag_relevance INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_blueprints_user_active ON blueprints(user_id, is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_scans_user_status ON scans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scans_dual_session ON scans(dual_scan_session_id) WHERE dual_scan_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_scans_created ON scans(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scan_results_scan ON scan_results(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_category ON scan_results(category);
CREATE INDEX IF NOT EXISTS idx_scan_results_score ON scan_results(overall_score);

CREATE INDEX IF NOT EXISTS idx_red_flags_severity ON red_flags(severity);
CREATE INDEX IF NOT EXISTS idx_red_flags_user_severity ON red_flags(user_id, severity);
CREATE INDEX IF NOT EXISTS idx_red_flags_pattern_hash ON red_flags(pattern_hash);

CREATE INDEX IF NOT EXISTS idx_pattern_kb_type ON pattern_knowledge_base(pattern_type);
CREATE INDEX IF NOT EXISTS idx_pattern_kb_occurrence ON pattern_knowledge_base(occurrence_count DESC);

CREATE INDEX IF NOT EXISTS idx_user_feedback_accurate ON user_feedback(was_accurate);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user ON user_feedback(user_id);

-- JSONB indexes for common queries
CREATE INDEX IF NOT EXISTS idx_scans_answers_gin ON scans USING GIN(answers);
CREATE INDEX IF NOT EXISTS idx_blueprints_answers_gin ON blueprints USING GIN(answers);
CREATE INDEX IF NOT EXISTS idx_scan_results_category_scores_gin ON scan_results USING GIN(category_scores);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE red_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (users can only see their own data)
-- Note: Adjust these based on your authentication setup

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own blueprints" ON blueprints
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own blueprints" ON blueprints
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own scans" ON scans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own scans" ON scans
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own scan results" ON scan_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM scans
            WHERE scans.id = scan_results.scan_id
            AND scans.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can view own red flags" ON red_flags
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own feedback" ON user_feedback
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own feedback" ON user_feedback
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

