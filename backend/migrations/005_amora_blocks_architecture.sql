-- ============================================
-- AMORA BLOCKS ARCHITECTURE
-- Block-based response system for rich, varied, non-repetitive responses
-- ============================================

-- Drop old templates table approach, use blocks
DROP TABLE IF EXISTS amora_response_blocks CASCADE;

-- Create the blocks table
CREATE TABLE IF NOT EXISTS amora_response_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_type VARCHAR(20) NOT NULL CHECK (block_type IN ('reflection', 'normalization', 'exploration', 'reframe')),
    
    -- Content
    text TEXT NOT NULL,
    
    -- Semantic search
    embedding vector(384),
    
    -- Filtering metadata
    topics TEXT[] NOT NULL DEFAULT '{}',  -- heartbreak, cheating, divorce, etc.
    emotions TEXT[] NOT NULL DEFAULT '{}',  -- sad, hurt, anxious, confused, angry, etc.
    stage INTEGER DEFAULT 1 CHECK (stage >= 1 AND stage <= 4),  -- Progressive depth
    
    -- Context matching
    relationship_statuses TEXT[] DEFAULT '{}',  -- single, dating, married, separated, divorced, complicated
    
    -- Quality & management
    priority INTEGER DEFAULT 50,  -- Higher = prefer when multiple match
    active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS amora_blocks_embedding_idx 
ON amora_response_blocks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS amora_blocks_type_idx ON amora_response_blocks(block_type) WHERE active = true;
CREATE INDEX IF NOT EXISTS amora_blocks_topics_idx ON amora_response_blocks USING GIN(topics);
CREATE INDEX IF NOT EXISTS amora_blocks_emotions_idx ON amora_response_blocks USING GIN(emotions);
CREATE INDEX IF NOT EXISTS amora_blocks_stage_idx ON amora_response_blocks(stage) WHERE active = true;

-- Create trigger for updated_at
CREATE TRIGGER update_amora_blocks_updated_at 
BEFORE UPDATE ON amora_response_blocks 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- REFLECTION BLOCKS (Emotional Mirroring)
-- ============================================

-- Heartbreak / Breakup (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'I can hear how much pain you''re carrying right now, and I''m so sorry you''re going through this.',
    ARRAY['heartbreak', 'breakup'],
    ARRAY['sad', 'hurt', 'devastated'],
    1,
    90
),
(
    'reflection',
    'Breakups can feel like your whole world is shifting, and that''s incredibly disorienting.',
    ARRAY['heartbreak', 'breakup'],
    ARRAY['confused', 'lost', 'overwhelmed'],
    1,
    85
),
(
    'reflection',
    'It sounds like you''re carrying a lot of grief right now, and that takes real courage to face.',
    ARRAY['heartbreak', 'breakup'],
    ARRAY['sad', 'hurt', 'grieving'],
    1,
    88
);

-- Heartbreak (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'I notice you''re still thinking about them a lot, and that''s a natural part of processing loss.',
    ARRAY['heartbreak', 'breakup', 'moving_on'],
    ARRAY['sad', 'longing', 'stuck'],
    2,
    85
),
(
    'reflection',
    'It sounds like you''re noticing patterns in how this affected you, which shows real self-awareness.',
    ARRAY['heartbreak', 'breakup', 'patterns'],
    ARRAY['reflective', 'confused', 'hurt'],
    2,
    82
);

-- Cheating / Infidelity (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'Finding out someone betrayed your trust like that is devastating, and what you''re feeling is completely valid.',
    ARRAY['cheating', 'infidelity', 'betrayal'],
    ARRAY['hurt', 'angry', 'betrayed'],
    1,
    95
),
(
    'reflection',
    'It sounds like you''re dealing with a lot of conflicting emotions right now—anger, hurt, maybe even confusion about what to do next.',
    ARRAY['cheating', 'infidelity', 'betrayal'],
    ARRAY['angry', 'hurt', 'confused'],
    1,
    92
),
(
    'reflection',
    'Betrayal shakes the foundation of trust, and what you''re feeling—all of it—makes complete sense.',
    ARRAY['cheating', 'infidelity', 'trust'],
    ARRAY['hurt', 'devastated', 'betrayed'],
    1,
    90
);

-- Cheating Self (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'It takes courage to be honest about this, and I hear that you''re carrying a lot of guilt and confusion.',
    ARRAY['cheating_self', 'guilt', 'infidelity'],
    ARRAY['guilty', 'ashamed', 'confused'],
    1,
    90
),
(
    'reflection',
    'It sounds like you''re struggling with what this means about you and your relationship, and that''s heavy to carry.',
    ARRAY['cheating_self', 'guilt', 'identity'],
    ARRAY['guilty', 'confused', 'ashamed'],
    1,
    88
);

-- Divorce / Separation (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'Divorce is one of the most difficult transitions a person can go through, and it makes sense that you''re feeling overwhelmed.',
    ARRAY['divorce', 'separation', 'ending'],
    ARRAY['sad', 'overwhelmed', 'scared'],
    1,
    92
),
(
    'reflection',
    'It sounds like you''re navigating a major life change, and that uncertainty can be exhausting.',
    ARRAY['divorce', 'separation', 'uncertainty'],
    ARRAY['anxious', 'scared', 'uncertain'],
    1,
    88
),
(
    'reflection',
    'I hear that this ending is bringing up a lot of complex feelings—grief, relief, fear, maybe all at once.',
    ARRAY['divorce', 'separation', 'grief'],
    ARRAY['sad', 'conflicted', 'overwhelmed'],
    1,
    90
);

-- Marriage Strain (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'It sounds like things have been really tense between you two, and that constant stress takes a toll.',
    ARRAY['marriage', 'marriage_strain', 'conflict'],
    ARRAY['stressed', 'frustrated', 'tired'],
    1,
    88
),
(
    'reflection',
    'I can hear how exhausted you are from trying to make this work, and that exhaustion is real.',
    ARRAY['marriage', 'marriage_strain', 'trying'],
    ARRAY['tired', 'frustrated', 'hopeless'],
    1,
    90
);

-- Talking Stage / Situationship (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'Not knowing where you stand with someone can create a lot of mental and emotional energy, and that uncertainty is frustrating.',
    ARRAY['talking_stage', 'situationship', 'unclear'],
    ARRAY['confused', 'frustrated', 'anxious'],
    1,
    92
),
(
    'reflection',
    'It sounds like you''re in that uncomfortable space of wanting clarity but not knowing how to ask for it.',
    ARRAY['talking_stage', 'situationship', 'unclear'],
    ARRAY['anxious', 'confused', 'uncertain'],
    1,
    88
),
(
    'reflection',
    'I hear that you''re feeling stuck in limbo—not quite together, not quite apart—and that ambiguity is hard.',
    ARRAY['situationship', 'unclear', 'limbo'],
    ARRAY['frustrated', 'confused', 'stuck'],
    1,
    90
);

-- Lust vs Love (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'Trying to sort out whether what you feel is attraction, connection, or something deeper can be really confusing.',
    ARRAY['lust_vs_love', 'feelings', 'confusion'],
    ARRAY['confused', 'uncertain', 'questioning'],
    1,
    88
),
(
    'reflection',
    'It sounds like you''re noticing the difference between physical chemistry and emotional connection, and that''s insightful.',
    ARRAY['lust_vs_love', 'chemistry', 'connection'],
    ARRAY['confused', 'curious', 'uncertain'],
    1,
    85
);

-- Pretense / Inauthenticity (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'It sounds like you''re feeling a disconnect between who you really are and who you''re showing up as, and that can be exhausting.',
    ARRAY['pretense', 'inauthenticity', 'masks'],
    ARRAY['tired', 'disconnected', 'fake'],
    1,
    90
),
(
    'reflection',
    'I hear that you don''t feel like you can be yourself with them, and that lack of authenticity weighs on you.',
    ARRAY['pretense', 'inauthenticity', 'authenticity'],
    ARRAY['frustrated', 'disconnected', 'lonely'],
    1,
    88
);

-- Jealousy / Trust Issues (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'Jealousy can feel overwhelming and consuming, and it sounds like it''s taking up a lot of space in your mind.',
    ARRAY['jealousy', 'insecurity', 'trust'],
    ARRAY['jealous', 'anxious', 'insecure'],
    1,
    90
),
(
    'reflection',
    'It sounds like trust feels fragile right now, and that uncertainty creates a lot of anxiety.',
    ARRAY['trust', 'jealousy', 'insecurity'],
    ARRAY['anxious', 'uncertain', 'jealous'],
    1,
    88
),
(
    'reflection',
    'I hear that you''re struggling with feeling secure in this relationship, and that insecurity is painful.',
    ARRAY['jealousy', 'insecurity', 'trust'],
    ARRAY['insecure', 'hurt', 'anxious'],
    1,
    85
);

-- Loneliness / Feeling Unlovable (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'Feeling fundamentally alone, even when you want connection, is one of the hardest things to sit with.',
    ARRAY['loneliness', 'isolation', 'alone'],
    ARRAY['lonely', 'sad', 'isolated'],
    1,
    92
),
(
    'reflection',
    'It sounds like you''re wondering if you''re worthy of love, and that question can feel really heavy.',
    ARRAY['unlovable', 'worthiness', 'self_doubt'],
    ARRAY['sad', 'hopeless', 'unworthy'],
    1,
    95
),
(
    'reflection',
    'I hear that you''re feeling unseen and disconnected, and that loneliness runs deep.',
    ARRAY['loneliness', 'unseen', 'disconnected'],
    ARRAY['lonely', 'sad', 'invisible'],
    1,
    90
);

-- Communication / Fights (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'It sounds like conversations keep turning into conflicts, and that cycle is exhausting.',
    ARRAY['fights', 'conflict', 'communication'],
    ARRAY['frustrated', 'tired', 'hopeless'],
    1,
    88
),
(
    'reflection',
    'I hear that you''re trying to communicate but it doesn''t feel like you''re being heard, and that''s really frustrating.',
    ARRAY['communication', 'not_heard', 'misunderstood'],
    ARRAY['frustrated', 'angry', 'unheard'],
    1,
    90
);

-- ============================================
-- NORMALIZATION BLOCKS (Context & Validation)
-- ============================================

-- Heartbreak (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Grief after a breakup isn''t linear—some days feel okay, others feel impossible, and that''s completely normal.',
    ARRAY['heartbreak', 'breakup', 'grief'],
    ARRAY['sad', 'hurt', 'overwhelmed'],
    1,
    85
),
(
    'normalization',
    'It''s natural to wonder if you''ll ever feel okay again. Healing takes time, and there''s no "should" about how fast that happens.',
    ARRAY['heartbreak', 'breakup', 'healing'],
    ARRAY['sad', 'hopeless', 'uncertain'],
    1,
    88
);

-- Heartbreak (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Sometimes the hardest part isn''t the end itself, but learning who you are without them.',
    ARRAY['heartbreak', 'identity', 'moving_on'],
    ARRAY['lost', 'confused', 'searching'],
    2,
    82
);

-- Cheating / Infidelity (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'When trust is broken like this, it shakes everything—not just the relationship, but your sense of reality and safety.',
    ARRAY['cheating', 'infidelity', 'trust'],
    ARRAY['betrayed', 'confused', 'lost'],
    1,
    90
),
(
    'normalization',
    'It''s common to cycle between anger, hurt, and even moments of wanting to forgive. All of those reactions are valid.',
    ARRAY['cheating', 'infidelity', 'betrayal'],
    ARRAY['angry', 'hurt', 'conflicted'],
    1,
    88
);

-- Cheating Self (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Infidelity is complicated and rarely about just one thing. Often it''s a symptom of something deeper that wasn''t being addressed.',
    ARRAY['cheating_self', 'guilt', 'complexity'],
    ARRAY['guilty', 'confused', 'ashamed'],
    1,
    85
),
(
    'normalization',
    'Guilt can be a sign that your actions don''t align with your values, and that discomfort is worth exploring.',
    ARRAY['cheating_self', 'guilt', 'values'],
    ARRAY['guilty', 'ashamed', 'conflicted'],
    1,
    88
);

-- Divorce / Separation (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Divorce can bring grief for what was, relief about what''s ending, and fear about what''s next—all at the same time.',
    ARRAY['divorce', 'separation', 'mixed_emotions'],
    ARRAY['sad', 'relieved', 'scared'],
    1,
    90
),
(
    'normalization',
    'Ending a marriage doesn''t mean failure—sometimes it means recognizing that staying would cost more than leaving.',
    ARRAY['divorce', 'separation', 'ending'],
    ARRAY['sad', 'guilty', 'conflicted'],
    1,
    88
);

-- Marriage Strain (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Most long-term relationships go through seasons where connection feels hard. That doesn''t mean it''s over, but it does mean something needs attention.',
    ARRAY['marriage', 'marriage_strain', 'distance'],
    ARRAY['disconnected', 'worried', 'tired'],
    1,
    85
),
(
    'normalization',
    'Conflict in marriage often isn''t about the thing you''re arguing about—it''s usually about unmet needs or communication patterns.',
    ARRAY['marriage', 'conflict', 'communication'],
    ARRAY['frustrated', 'tired', 'stuck'],
    1,
    88
);

-- Talking Stage / Situationship (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Situationships often exist because one or both people are avoiding vulnerability or commitment, and that ambiguity protects something.',
    ARRAY['situationship', 'unclear', 'ambiguity'],
    ARRAY['frustrated', 'confused', 'stuck'],
    1,
    88
),
(
    'normalization',
    'It''s completely reasonable to want clarity about where you stand. Wanting to know isn''t "too much" or "needy."',
    ARRAY['talking_stage', 'situationship', 'clarity'],
    ARRAY['anxious', 'uncertain', 'frustrated'],
    1,
    90
);

-- Lust vs Love (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Lust and love can coexist, but lust alone often fades once novelty wears off, while love grows through shared vulnerability and time.',
    ARRAY['lust_vs_love', 'chemistry', 'connection'],
    ARRAY['confused', 'uncertain', 'curious'],
    1,
    85
),
(
    'normalization',
    'Sometimes intense physical chemistry can feel like love, especially at first. The difference usually shows up when things get difficult.',
    ARRAY['lust_vs_love', 'attraction', 'confusion'],
    ARRAY['confused', 'uncertain', 'questioning'],
    1,
    88
);

-- Pretense / Inauthenticity (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Relationships where you can''t be yourself eventually feel lonely, even when you''re physically together.',
    ARRAY['pretense', 'inauthenticity', 'loneliness'],
    ARRAY['lonely', 'disconnected', 'fake'],
    1,
    88
),
(
    'normalization',
    'Hiding parts of yourself can start as self-protection, but over time it creates distance.',
    ARRAY['pretense', 'inauthenticity', 'masks'],
    ARRAY['tired', 'disconnected', 'protective'],
    1,
    85
);

-- Jealousy / Trust (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Jealousy often signals an unmet need—maybe for reassurance, security, or a sense of being chosen.',
    ARRAY['jealousy', 'insecurity', 'needs'],
    ARRAY['jealous', 'anxious', 'insecure'],
    1,
    88
),
(
    'normalization',
    'Trust issues don''t always mean something is wrong now—sometimes they''re echoes of past wounds that haven''t healed.',
    ARRAY['trust', 'jealousy', 'past'],
    ARRAY['anxious', 'uncertain', 'triggered'],
    1,
    90
);

-- Loneliness / Unlovable (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Feeling unlovable is a story we tell ourselves, often based on old wounds, not current truth.',
    ARRAY['unlovable', 'worthiness', 'beliefs'],
    ARRAY['sad', 'hopeless', 'unworthy'],
    1,
    90
),
(
    'normalization',
    'Loneliness can exist even in relationships—it''s less about being alone and more about feeling unseen or misunderstood.',
    ARRAY['loneliness', 'isolation', 'unseen'],
    ARRAY['lonely', 'isolated', 'misunderstood'],
    1,
    88
);

-- Communication / Fights (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'When the same argument keeps happening, it usually means there''s an underlying issue that hasn''t been named or addressed.',
    ARRAY['fights', 'patterns', 'communication'],
    ARRAY['frustrated', 'stuck', 'tired'],
    1,
    88
),
(
    'normalization',
    'Feeling unheard in a relationship often creates more damage than the original disagreement.',
    ARRAY['communication', 'not_heard', 'misunderstood'],
    ARRAY['frustrated', 'angry', 'unheard'],
    1,
    90
);

-- ============================================
-- EXPLORATION BLOCKS (Gentle Questions)
-- ============================================

-- Heartbreak (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What part of this loss feels hardest to sit with right now?',
    ARRAY['heartbreak', 'breakup', 'grief'],
    ARRAY['sad', 'hurt', 'overwhelmed'],
    1,
    85
),
(
    'exploration',
    'When you think about moving forward, what comes up for you?',
    ARRAY['heartbreak', 'breakup', 'moving_on'],
    ARRAY['sad', 'uncertain', 'stuck'],
    1,
    82
),
(
    'exploration',
    'What do you find yourself missing most—the person, or the feeling of being with someone?',
    ARRAY['heartbreak', 'breakup', 'longing'],
    ARRAY['sad', 'longing', 'lonely'],
    1,
    88
);

-- Heartbreak (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'Looking back, what needs of yours weren''t being met in that relationship?',
    ARRAY['heartbreak', 'patterns', 'needs'],
    ARRAY['reflective', 'hurt', 'searching'],
    2,
    80
),
(
    'exploration',
    'What are you learning about yourself through this experience?',
    ARRAY['heartbreak', 'growth', 'identity'],
    ARRAY['reflective', 'curious', 'growing'],
    2,
    78
);

-- Cheating / Infidelity (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'Right now, what feels most important—understanding why it happened, or deciding what you want to do next?',
    ARRAY['cheating', 'infidelity', 'decision'],
    ARRAY['confused', 'hurt', 'betrayed'],
    1,
    90
),
(
    'exploration',
    'When you imagine staying vs. leaving, which one feels more aligned with who you want to be?',
    ARRAY['cheating', 'infidelity', 'decision'],
    ARRAY['conflicted', 'uncertain', 'hurt'],
    1,
    88
),
(
    'exploration',
    'What would it take for you to feel safe with them again, if anything?',
    ARRAY['cheating', 'trust', 'safety'],
    ARRAY['hurt', 'uncertain', 'betrayed'],
    1,
    85
);

-- Cheating Self (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What was happening in your relationship or in yourself before this happened?',
    ARRAY['cheating_self', 'context', 'patterns'],
    ARRAY['guilty', 'confused', 'reflective'],
    1,
    88
),
(
    'exploration',
    'What need were you trying to meet by stepping outside your relationship?',
    ARRAY['cheating_self', 'needs', 'understanding'],
    ARRAY['guilty', 'confused', 'searching'],
    1,
    85
),
(
    'exploration',
    'What do you want to do with this guilt you''re carrying?',
    ARRAY['cheating_self', 'guilt', 'action'],
    ARRAY['guilty', 'ashamed', 'stuck'],
    1,
    82
);

-- Divorce / Separation (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What part of this transition feels most overwhelming right now?',
    ARRAY['divorce', 'separation', 'overwhelm'],
    ARRAY['overwhelmed', 'scared', 'anxious'],
    1,
    88
),
(
    'exploration',
    'When you think about life after this, what comes up—fear, relief, both?',
    ARRAY['divorce', 'separation', 'future'],
    ARRAY['scared', 'uncertain', 'hopeful'],
    1,
    85
),
(
    'exploration',
    'What do you need most as you navigate this ending?',
    ARRAY['divorce', 'separation', 'needs'],
    ARRAY['overwhelmed', 'sad', 'lost'],
    1,
    82
);

-- Marriage Strain (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What does connection with your partner usually look like when it feels good? What''s missing now?',
    ARRAY['marriage', 'marriage_strain', 'connection'],
    ARRAY['disconnected', 'sad', 'frustrated'],
    1,
    85
),
(
    'exploration',
    'When you imagine things improving, what would need to change?',
    ARRAY['marriage', 'marriage_strain', 'hope'],
    ARRAY['hopeful', 'uncertain', 'tired'],
    1,
    82
),
(
    'exploration',
    'What keeps you from bringing this up with them directly?',
    ARRAY['marriage', 'communication', 'fear'],
    ARRAY['scared', 'frustrated', 'stuck'],
    1,
    80
);

-- Talking Stage / Situationship (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What would having clarity about where you stand give you?',
    ARRAY['talking_stage', 'situationship', 'clarity'],
    ARRAY['confused', 'anxious', 'frustrated'],
    1,
    88
),
(
    'exploration',
    'If they can''t or won''t define the relationship, what does that tell you?',
    ARRAY['situationship', 'clarity', 'avoidance'],
    ARRAY['frustrated', 'hurt', 'uncertain'],
    1,
    90
),
(
    'exploration',
    'What''s keeping you in this ambiguous space—hope, fear, attachment?',
    ARRAY['situationship', 'stuck', 'ambiguity'],
    ARRAY['confused', 'stuck', 'frustrated'],
    1,
    85
);

-- Lust vs Love (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'When you''re apart, what do you miss—the person themselves, or the feeling they give you?',
    ARRAY['lust_vs_love', 'feelings', 'distinction'],
    ARRAY['confused', 'uncertain', 'questioning'],
    1,
    88
),
(
    'exploration',
    'Do you feel more drawn to who they are, or to how they make you feel about yourself?',
    ARRAY['lust_vs_love', 'connection', 'attraction'],
    ARRAY['confused', 'curious', 'uncertain'],
    1,
    85
),
(
    'exploration',
    'If the physical chemistry faded, what would be left?',
    ARRAY['lust_vs_love', 'chemistry', 'foundation'],
    ARRAY['uncertain', 'questioning', 'curious'],
    1,
    82
);

-- Pretense / Inauthenticity (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What parts of yourself do you feel you can''t show them?',
    ARRAY['pretense', 'inauthenticity', 'hiding'],
    ARRAY['disconnected', 'lonely', 'fake'],
    1,
    88
),
(
    'exploration',
    'What do you imagine would happen if you showed up fully as yourself?',
    ARRAY['pretense', 'authenticity', 'fear'],
    ARRAY['scared', 'uncertain', 'protective'],
    1,
    85
),
(
    'exploration',
    'What would it feel like to be in a relationship where you didn''t have to perform or hide?',
    ARRAY['pretense', 'authenticity', 'safety'],
    ARRAY['longing', 'tired', 'hopeful'],
    1,
    80
);

-- Jealousy / Trust (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What specifically triggers the jealousy—situations, people, your own thoughts?',
    ARRAY['jealousy', 'triggers', 'patterns'],
    ARRAY['jealous', 'anxious', 'insecure'],
    1,
    88
),
(
    'exploration',
    'When you feel jealous, what are you most afraid of?',
    ARRAY['jealousy', 'fear', 'insecurity'],
    ARRAY['jealous', 'scared', 'anxious'],
    1,
    90
),
(
    'exploration',
    'What would help you feel more secure in this relationship?',
    ARRAY['jealousy', 'trust', 'security'],
    ARRAY['insecure', 'anxious', 'uncertain'],
    1,
    85
);

-- Loneliness / Unlovable (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'When did you first start believing you might be unlovable?',
    ARRAY['unlovable', 'beliefs', 'origin'],
    ARRAY['sad', 'hopeless', 'reflective'],
    1,
    85
),
(
    'exploration',
    'What would it feel like to be truly seen and accepted by someone?',
    ARRAY['unlovable', 'loneliness', 'longing'],
    ARRAY['lonely', 'longing', 'hopeful'],
    1,
    82
),
(
    'exploration',
    'What makes you feel most alone—being physically by yourself, or feeling misunderstood?',
    ARRAY['loneliness', 'isolation', 'connection'],
    ARRAY['lonely', 'isolated', 'disconnected'],
    1,
    88
);

-- Communication / Fights (Stage 1)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What usually happens right before things escalate into a fight?',
    ARRAY['fights', 'patterns', 'escalation'],
    ARRAY['frustrated', 'angry', 'tired'],
    1,
    88
),
(
    'exploration',
    'When you''re arguing, what are you really trying to get them to understand?',
    ARRAY['fights', 'communication', 'needs'],
    ARRAY['frustrated', 'unheard', 'angry'],
    1,
    90
),
(
    'exploration',
    'What would "being heard" actually look like for you?',
    ARRAY['communication', 'not_heard', 'needs'],
    ARRAY['frustrated', 'unheard', 'longing'],
    1,
    85
);

-- ============================================
-- REFRAME BLOCKS (Soft Perspective)
-- ============================================

-- Heartbreak (Stage 2-3)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Sometimes the relationship ending isn''t about you not being enough—it''s about two people growing in different directions.',
    ARRAY['heartbreak', 'breakup', 'meaning'],
    ARRAY['sad', 'hurt', 'questioning'],
    2,
    80
),
(
    'reframe',
    'Grief isn''t just about losing them—it''s also about mourning the future you imagined together.',
    ARRAY['heartbreak', 'grief', 'loss'],
    ARRAY['sad', 'lost', 'grieving'],
    2,
    78
);

-- Cheating (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Betrayal often says more about the betrayer''s capacity for honesty and integrity than it does about your worthiness.',
    ARRAY['cheating', 'betrayal', 'worthiness'],
    ARRAY['hurt', 'betrayed', 'questioning'],
    2,
    85
);

-- Divorce (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Endings can also be beginnings—the closing of one chapter creates space for something new.',
    ARRAY['divorce', 'separation', 'new_beginning'],
    ARRAY['sad', 'scared', 'hopeful'],
    2,
    78
);

-- Loneliness (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Learning to be with yourself—not just alone, but truly present—is one of the most valuable skills for any relationship.',
    ARRAY['loneliness', 'solitude', 'growth'],
    ARRAY['lonely', 'reflective', 'growing'],
    2,
    75
);

-- Jealousy (Stage 2)
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Jealousy often points to something you need more of—not necessarily from them, but for yourself.',
    ARRAY['jealousy', 'needs', 'self'],
    ARRAY['jealous', 'reflective', 'curious'],
    2,
    80
);

COMMENT ON TABLE amora_response_blocks IS 'Block-based response architecture for rich, varied, non-repetitive Amora responses';
COMMENT ON COLUMN amora_response_blocks.block_type IS 'Type of response block: reflection, normalization, exploration, or reframe';
COMMENT ON COLUMN amora_response_blocks.topics IS 'Relationship topics this block addresses (heartbreak, cheating, divorce, etc.)';
COMMENT ON COLUMN amora_response_blocks.emotions IS 'Emotional states this block resonates with';
COMMENT ON COLUMN amora_response_blocks.stage IS 'Progressive depth stage (1=orienting, 2=exploration, 3+=deeper meaning)';
