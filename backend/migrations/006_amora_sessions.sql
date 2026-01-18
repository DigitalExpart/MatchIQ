-- Amora Coaching Sessions Migration
-- Run this in your Supabase SQL Editor

-- 1. Create amora_sessions table
CREATE TABLE IF NOT EXISTS amora_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    primary_topic VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE,
    follow_up_enabled BOOLEAN DEFAULT FALSE,
    follow_up_time VARCHAR(5), -- HH:MM format
    last_follow_up_at TIMESTAMP WITH TIME ZONE,
    summary_text TEXT,
    next_plan_text TEXT
);

-- 2. Create amora_session_messages table
CREATE TABLE IF NOT EXISTS amora_session_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES amora_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'amora')),
    message_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb -- topics, emotion, response_style, block_ids, etc.
);

-- 3. Create amora_session_feedback table for like/dislike/regenerate tracking
CREATE TABLE IF NOT EXISTS amora_session_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES amora_sessions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES amora_session_messages(id) ON DELETE CASCADE,
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'regenerate')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_amora_sessions_user ON amora_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_amora_sessions_status ON amora_sessions(status) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_amora_sessions_followup ON amora_sessions(user_id, follow_up_enabled, status) 
    WHERE follow_up_enabled = TRUE AND status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_amora_sessions_updated ON amora_sessions(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_amora_messages_session ON amora_session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_amora_messages_created ON amora_session_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_amora_messages_sender ON amora_session_messages(sender);

CREATE INDEX IF NOT EXISTS idx_amora_feedback_session ON amora_session_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_amora_feedback_message ON amora_session_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_amora_feedback_type ON amora_session_feedback(feedback_type);

-- JSONB indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_amora_messages_metadata_gin ON amora_session_messages USING GIN(metadata);

-- Enable Row Level Security (RLS)
ALTER TABLE amora_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE amora_session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE amora_session_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sessions" ON amora_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own sessions" ON amora_sessions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own session messages" ON amora_session_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM amora_sessions
            WHERE amora_sessions.id = amora_session_messages.session_id
            AND amora_sessions.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own session messages" ON amora_session_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM amora_sessions
            WHERE amora_sessions.id = amora_session_messages.session_id
            AND amora_sessions.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can view own session feedback" ON amora_session_feedback
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own session feedback" ON amora_session_feedback
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
