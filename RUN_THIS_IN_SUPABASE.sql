-- ============================================
-- COPY THIS ENTIRE FILE AND RUN IN SUPABASE SQL EDITOR
-- ============================================
-- This creates the amora_templates table with 8 initial templates
-- Time: ~30 seconds to run
-- ============================================

-- Create vector extension if not exists
CREATE EXTENSION IF NOT EXISTS vector;

-- Create templates table
CREATE TABLE IF NOT EXISTS amora_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    emotional_state VARCHAR(100),
    confidence_level VARCHAR(10) NOT NULL CHECK (confidence_level IN ('LOW', 'MEDIUM', 'HIGH')),
    example_questions TEXT[] NOT NULL,
    response_template TEXT NOT NULL,
    embedding vector(384),
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast semantic search
CREATE INDEX IF NOT EXISTS amora_templates_embedding_idx 
ON amora_templates USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS amora_templates_confidence_idx ON amora_templates(confidence_level) WHERE active = true;
CREATE INDEX IF NOT EXISTS amora_templates_category_idx ON amora_templates(category) WHERE active = true;
CREATE INDEX IF NOT EXISTS amora_templates_priority_idx ON amora_templates(priority DESC) WHERE active = true;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_amora_templates_updated_at 
BEFORE UPDATE ON amora_templates 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert initial templates (LOW confidence)
INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'confusion',
    'high_confusion',
    'LOW',
    ARRAY[
        'I''m confused about my relationship',
        'I don''t know what to do',
        'I''m so confused',
        'I don''t know how I feel'
    ],
    'It sounds like you''re feeling really uncertain right now, and that can be exhausting. What specifically feels most confusing to you?',
    90
),
(
    'venting',
    'high_frustration',
    'LOW',
    ARRAY[
        'I just need to talk',
        'I''m so frustrated',
        'This is so hard',
        'I can''t deal with this anymore'
    ],
    'I hear you, and I''m here to listen. It sounds like this has been weighing on you. What''s been the hardest part?',
    95
),
(
    'anxiety',
    'high_anxiety',
    'LOW',
    ARRAY[
        'I''m so anxious about this',
        'I''m worried about us',
        'What if things don''t work out',
        'I''m scared'
    ],
    'I can sense the anxiety you''re feeling, and that''s completely understandable. When you think about what worries you most, what comes up?',
    85
);

-- Insert templates (MEDIUM confidence)
INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'love',
    'mixed',
    'MEDIUM',
    ARRAY[
        'How do I know if I''m in love',
        'Am I in love',
        'Do I love them',
        'Is this love'
    ],
    'Understanding your feelings can be complex. You might consider: Do you think about them often when they''re not around? Do you feel genuinely happy when you''re together? How do you feel when you''re apart?',
    80
),
(
    'readiness',
    'mixed',
    'MEDIUM',
    ARRAY[
        'Am I ready for a relationship',
        'Should I be in a relationship',
        'Am I ready to commit'
    ],
    'Readiness is something only you can determine. It might help to reflect: Do you feel emotionally available? Can you handle conflict constructively? What draws you to being in a relationship right now?',
    75
);

-- Insert templates (HIGH confidence)
INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'communication',
    'low_emotion',
    'HIGH',
    ARRAY[
        'How can I improve communication',
        'How do I communicate better',
        'What makes good communication',
        'How to talk to my partner'
    ],
    'Effective communication often involves active listening, expressing feelings clearly with "I" statements, and creating safe space for dialogue. It might help to focus on understanding before being understood. What aspect of communication feels most challenging?',
    70
),
(
    'trust',
    'low_emotion',
    'HIGH',
    ARRAY[
        'How do I build trust',
        'How to trust again',
        'What is trust in relationships'
    ],
    'Trust may develop through consistent actions, open communication, and mutual respect. It could involve being reliable, transparent, and creating opportunities for vulnerability in safe ways. What''s your experience with trust been like?',
    65
),
(
    'boundaries',
    'low_emotion',
    'HIGH',
    ARRAY[
        'How do I set boundaries',
        'What are healthy boundaries',
        'How to say no'
    ],
    'Healthy boundaries might help define what''s acceptable in a relationship. Setting them could involve communicating your needs clearly, respecting your partner''s limits, and recognizing that boundaries may evolve over time. What boundaries feel important to you?',
    60
);

-- Add greeting template
INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'greeting',
    'neutral',
    'LOW',
    ARRAY[
        'Hi',
        'Hello',
        'Hey',
        'What can you do',
        'Who are you',
        'What''s your name'
    ],
    'I''m Amora. I''m here to help you think through relationships and emotions at your own pace. What''s been on your mind lately?',
    100
);

-- Verify insertion
SELECT category, confidence_level, priority, active 
FROM amora_templates 
ORDER BY priority DESC;

-- ============================================
-- EXPECTED RESULT: 8 rows showing categories:
-- greeting (LOW, priority 100)
-- venting (LOW, priority 95)
-- confusion (LOW, priority 90)
-- anxiety (LOW, priority 85)
-- love (MEDIUM, priority 80)
-- readiness (MEDIUM, priority 75)
-- communication (HIGH, priority 70)
-- trust (HIGH, priority 65)
-- boundaries (HIGH, priority 60)
-- ============================================
