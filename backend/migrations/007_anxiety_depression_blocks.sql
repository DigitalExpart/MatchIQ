-- ============================================
-- ANXIETY & DEPRESSION DISTRESS BLOCKS
-- User-side anxiety and depression feelings in relationship context
-- NOT clinical diagnoses - these are feeling states
-- ============================================

-- ============================================
-- USER ANXIETY DISTRESS - REFLECTION BLOCKS
-- ============================================

-- Stage 1-2 Reflection blocks
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'It sounds like your anxiety around this relationship is constantly running in the background and leaving you on edge.',
    ARRAY['user_anxiety_distress', 'anxiety', 'relationship'],
    ARRAY['anxious', 'worried', 'overwhelmed'],
    1,
    90
),
(
    'reflection',
    'I can hear how much mental energy your anxiety is taking up, and that exhaustion is real.',
    ARRAY['user_anxiety_distress', 'anxiety', 'exhaustion'],
    ARRAY['anxious', 'tired', 'overwhelmed'],
    1,
    88
),
(
    'reflection',
    'It sounds like your nervous system is staying on high alert, and that constant vigilance is draining.',
    ARRAY['user_anxiety_distress', 'anxiety', 'vigilance'],
    ARRAY['anxious', 'scared', 'tired'],
    1,
    92
),
(
    'reflection',
    'I hear that your anxiety spikes around uncertainty in this relationship, and that uncertainty feels impossible to sit with.',
    ARRAY['user_anxiety_distress', 'anxiety', 'uncertainty'],
    ARRAY['anxious', 'uncertain', 'scared'],
    1,
    90
),
(
    'reflection',
    'It sounds like your anxiety is trying to protect you from something—maybe abandonment, rejection, or being hurt again.',
    ARRAY['user_anxiety_distress', 'anxiety', 'protection'],
    ARRAY['anxious', 'scared', 'protective'],
    2,
    88
),
(
    'reflection',
    'I notice you''re tracking every signal, every text, every interaction for signs of what might go wrong, and that hypervigilance is exhausting.',
    ARRAY['user_anxiety_distress', 'anxiety', 'hypervigilance'],
    ARRAY['anxious', 'tired', 'overwhelmed'],
    2,
    85
),
(
    'reflection',
    'It sounds like your anxiety has become a constant companion in this relationship, and that presence takes up a lot of space.',
    ARRAY['user_anxiety_distress', 'anxiety', 'relationship'],
    ARRAY['anxious', 'overwhelmed', 'stuck'],
    2,
    88
),
(
    'reflection',
    'I hear that when things feel uncertain or unclear, your anxiety ramps up, and that pattern is really hard to break.',
    ARRAY['user_anxiety_distress', 'anxiety', 'patterns'],
    ARRAY['anxious', 'stuck', 'frustrated'],
    2,
    85
);

-- ============================================
-- USER ANXIETY DISTRESS - NORMALIZATION BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Many people find that past hurts or unstable relationships make their nervous system stay on high alert in new situations.',
    ARRAY['user_anxiety_distress', 'anxiety', 'past'],
    ARRAY['anxious', 'scared', 'protective'],
    1,
    90
),
(
    'normalization',
    'Anxiety in relationships often comes from a place of wanting to control outcomes because uncertainty feels too painful.',
    ARRAY['user_anxiety_distress', 'anxiety', 'control'],
    ARRAY['anxious', 'uncertain', 'scared'],
    1,
    88
),
(
    'normalization',
    'When you''ve been hurt before, your body and mind can stay in protection mode even when there''s no immediate threat.',
    ARRAY['user_anxiety_distress', 'anxiety', 'protection'],
    ARRAY['anxious', 'scared', 'protective'],
    1,
    92
),
(
    'normalization',
    'Relationship anxiety is really common, especially when you care deeply and the stakes feel high.',
    ARRAY['user_anxiety_distress', 'anxiety', 'relationship'],
    ARRAY['anxious', 'worried', 'uncertain'],
    1,
    85
),
(
    'normalization',
    'Anxiety can feel like it''s trying to help you by preparing for worst-case scenarios, but it often creates more suffering than it prevents.',
    ARRAY['user_anxiety_distress', 'anxiety', 'patterns'],
    ARRAY['anxious', 'tired', 'frustrated'],
    2,
    88
),
(
    'normalization',
    'Feeling anxious about someone leaving or rejecting you doesn''t mean they will—anxiety isn''t a prediction, it''s a response.',
    ARRAY['user_anxiety_distress', 'anxiety', 'fear'],
    ARRAY['anxious', 'scared', 'uncertain'],
    2,
    90
),
(
    'normalization',
    'Your anxiety might be trying to keep you safe, but sometimes it keeps you from being present in the relationship you actually have.',
    ARRAY['user_anxiety_distress', 'anxiety', 'presence'],
    ARRAY['anxious', 'disconnected', 'tired'],
    2,
    85
),
(
    'normalization',
    'Anxiety around relationships often increases when you''re not sure where you stand or what the other person is thinking.',
    ARRAY['user_anxiety_distress', 'anxiety', 'uncertainty'],
    ARRAY['anxious', 'uncertain', 'frustrated'],
    2,
    88
);

-- ============================================
-- USER ANXIETY DISTRESS - INSIGHT/REFRAME BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Anxiety can cling to uncertainty, fear of abandonment, or inconsistent partners because your nervous system learned that unpredictability means danger.',
    ARRAY['user_anxiety_distress', 'anxiety', 'patterns'],
    ARRAY['anxious', 'scared', 'protective'],
    2,
    90
),
(
    'reframe',
    'When anxiety shows up, it''s often pointing to a need—maybe for reassurance, clarity, or a sense of security that hasn''t been established yet.',
    ARRAY['user_anxiety_distress', 'anxiety', 'needs'],
    ARRAY['anxious', 'uncertain', 'needing'],
    2,
    88
),
(
    'reframe',
    'Anxiety can become a habit—your mind rehearses worst-case scenarios so often that it starts to feel like preparation, even when it''s actually just suffering.',
    ARRAY['user_anxiety_distress', 'anxiety', 'patterns'],
    ARRAY['anxious', 'stuck', 'tired'],
    2,
    85
),
(
    'reframe',
    'Sometimes anxiety is trying to solve a problem that can''t be solved through worry—like guaranteeing someone won''t leave or that you won''t get hurt.',
    ARRAY['user_anxiety_distress', 'anxiety', 'control'],
    ARRAY['anxious', 'frustrated', 'stuck'],
    2,
    88
),
(
    'reframe',
    'Your anxiety might be protecting you from vulnerability, but it can also keep you from the connection you''re actually seeking.',
    ARRAY['user_anxiety_distress', 'anxiety', 'vulnerability'],
    ARRAY['anxious', 'scared', 'longing'],
    2,
    85
),
(
    'reframe',
    'Anxiety often increases when you''re trying to control something that''s inherently uncertain—like how someone feels about you or what will happen next.',
    ARRAY['user_anxiety_distress', 'anxiety', 'uncertainty'],
    ARRAY['anxious', 'uncertain', 'frustrated'],
    2,
    90
);

-- ============================================
-- USER ANXIETY DISTRESS - EXPLORATION BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'When does your anxiety spike the most—before messages, after fights, at night, or when things feel uncertain?',
    ARRAY['user_anxiety_distress', 'anxiety', 'triggers'],
    ARRAY['anxious', 'scared', 'uncertain'],
    1,
    90
),
(
    'exploration',
    'What are you most afraid will happen if your anxiety is right?',
    ARRAY['user_anxiety_distress', 'anxiety', 'fear'],
    ARRAY['anxious', 'scared', 'uncertain'],
    1,
    92
),
(
    'exploration',
    'When your anxiety is high, what helps even a little—talking to someone, writing, movement, or something else?',
    ARRAY['user_anxiety_distress', 'anxiety', 'coping'],
    ARRAY['anxious', 'overwhelmed', 'seeking'],
    1,
    85
),
(
    'exploration',
    'What would it feel like to be in a relationship where your anxiety wasn''t constantly activated?',
    ARRAY['user_anxiety_distress', 'anxiety', 'longing'],
    ARRAY['anxious', 'longing', 'hopeful'],
    1,
    88
),
(
    'exploration',
    'How long has this level of anxiety been present in your relationships?',
    ARRAY['user_anxiety_distress', 'anxiety', 'patterns'],
    ARRAY['anxious', 'reflective', 'curious'],
    2,
    85
),
(
    'exploration',
    'What do you think your anxiety is trying to protect you from?',
    ARRAY['user_anxiety_distress', 'anxiety', 'protection'],
    ARRAY['anxious', 'reflective', 'curious'],
    2,
    90
),
(
    'exploration',
    'When you notice your anxiety rising, what happens if you pause and name what you''re actually feeling underneath it?',
    ARRAY['user_anxiety_distress', 'anxiety', 'awareness'],
    ARRAY['anxious', 'curious', 'reflective'],
    2,
    85
),
(
    'exploration',
    'What would need to be true for you to feel more secure in this relationship?',
    ARRAY['user_anxiety_distress', 'anxiety', 'security'],
    ARRAY['anxious', 'uncertain', 'seeking'],
    2,
    88
);

-- ============================================
-- USER DEPRESSION DISTRESS - REFLECTION BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reflection',
    'It sounds like this breakup has taken a lot of color out of your days and left things feeling heavy and empty.',
    ARRAY['user_depression_distress', 'depression', 'breakup'],
    ARRAY['sad', 'empty', 'heavy'],
    1,
    92
),
(
    'reflection',
    'I can hear how much energy it takes just to get through the day, and that exhaustion is real.',
    ARRAY['user_depression_distress', 'depression', 'exhaustion'],
    ARRAY['tired', 'heavy', 'empty'],
    1,
    90
),
(
    'reflection',
    'It sounds like you''re carrying a heaviness that makes everything feel harder, and that weight is exhausting.',
    ARRAY['user_depression_distress', 'depression', 'heaviness'],
    ARRAY['heavy', 'tired', 'empty'],
    1,
    92
),
(
    'reflection',
    'I hear that things that used to bring you joy don''t feel the same anymore, and that loss of feeling is really hard.',
    ARRAY['user_depression_distress', 'depression', 'numbness'],
    ARRAY['numb', 'empty', 'sad'],
    1,
    88
),
(
    'reflection',
    'It sounds like you''re moving through your days but not really feeling present, like you''re going through motions.',
    ARRAY['user_depression_distress', 'depression', 'numbness'],
    ARRAY['numb', 'disconnected', 'empty'],
    2,
    90
),
(
    'reflection',
    'I notice you''re describing a sense of pointlessness, and that feeling can make it hard to find motivation for anything.',
    ARRAY['user_depression_distress', 'depression', 'hopelessness'],
    ARRAY['hopeless', 'empty', 'heavy'],
    2,
    92
),
(
    'reflection',
    'It sounds like this low mood has been persistent, and that persistence makes it feel like it might never lift.',
    ARRAY['user_depression_distress', 'depression', 'persistence'],
    ARRAY['hopeless', 'heavy', 'stuck'],
    2,
    88
),
(
    'reflection',
    'I hear that you''re struggling to see the point in things that used to matter, and that shift is disorienting.',
    ARRAY['user_depression_distress', 'depression', 'meaning'],
    ARRAY['empty', 'hopeless', 'lost'],
    2,
    85
);

-- ============================================
-- USER DEPRESSION DISTRESS - NORMALIZATION BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'normalization',
    'Feeling low, numb, or unmotivated after big relationship losses is very common, even if it''s also really hard to live with.',
    ARRAY['user_depression_distress', 'depression', 'breakup'],
    ARRAY['sad', 'empty', 'heavy'],
    1,
    92
),
(
    'normalization',
    'When a relationship ends or changes dramatically, it can feel like losing part of your identity, and that loss can create a deep sense of emptiness.',
    ARRAY['user_depression_distress', 'depression', 'identity'],
    ARRAY['empty', 'lost', 'sad'],
    1,
    90
),
(
    'normalization',
    'Depression-like feelings after breakups often come from grief loops—your mind keeps replaying what was lost, what could have been, what you miss.',
    ARRAY['user_depression_distress', 'depression', 'grief'],
    ARRAY['sad', 'heavy', 'stuck'],
    1,
    88
),
(
    'normalization',
    'It''s normal to feel numb or disconnected when you''re processing a lot of pain—sometimes your system shuts down to protect you.',
    ARRAY['user_depression_distress', 'depression', 'numbness'],
    ARRAY['numb', 'disconnected', 'empty'],
    1,
    90
),
(
    'normalization',
    'When motivation disappears, it''s often because the things that used to drive you feel meaningless or out of reach.',
    ARRAY['user_depression_distress', 'depression', 'motivation'],
    ARRAY['empty', 'hopeless', 'heavy'],
    2,
    88
),
(
    'normalization',
    'Feeling like nothing matters can be a sign that you''re in deep grief or that your nervous system is overwhelmed and needs rest.',
    ARRAY['user_depression_distress', 'depression', 'meaning'],
    ARRAY['empty', 'hopeless', 'tired'],
    2,
    90
),
(
    'normalization',
    'The heaviness you''re describing often comes from carrying unresolved emotions or from your body holding onto stress and grief.',
    ARRAY['user_depression_distress', 'depression', 'heaviness'],
    ARRAY['heavy', 'tired', 'stuck'],
    2,
    85
),
(
    'normalization',
    'When you can''t feel joy or pleasure, it doesn''t mean those things are gone forever—sometimes your system needs time to reset.',
    ARRAY['user_depression_distress', 'depression', 'numbness'],
    ARRAY['numb', 'empty', 'hopeful'],
    2,
    88
);

-- ============================================
-- USER DEPRESSION DISTRESS - INSIGHT/REFRAME BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'reframe',
    'Grief loops and rumination can keep you stuck in low mood because your mind keeps returning to what was lost instead of what''s possible.',
    ARRAY['user_depression_distress', 'depression', 'grief'],
    ARRAY['sad', 'stuck', 'heavy'],
    2,
    90
),
(
    'reframe',
    'Loss of identity after breakups or long-term relationship strain can create depression-like feelings because you''re mourning who you were in that context.',
    ARRAY['user_depression_distress', 'depression', 'identity'],
    ARRAY['empty', 'lost', 'sad'],
    2,
    92
),
(
    'reframe',
    'When you feel numb or empty, it might be your system''s way of protecting you from feeling too much pain all at once.',
    ARRAY['user_depression_distress', 'depression', 'numbness'],
    ARRAY['numb', 'empty', 'protective'],
    2,
    88
),
(
    'reframe',
    'The pointlessness you''re feeling might be pointing to a need to reconnect with what actually matters to you, separate from the relationship.',
    ARRAY['user_depression_distress', 'depression', 'meaning'],
    ARRAY['empty', 'hopeless', 'searching'],
    2,
    85
),
(
    'reframe',
    'Depression-like feelings after relationship loss often come from losing not just the person, but the future you imagined together.',
    ARRAY['user_depression_distress', 'depression', 'grief'],
    ARRAY['sad', 'lost', 'heavy'],
    2,
    90
),
(
    'reframe',
    'When motivation disappears, it''s often because the things that used to drive you were tied to the relationship or the person you lost.',
    ARRAY['user_depression_distress', 'depression', 'motivation'],
    ARRAY['empty', 'lost', 'searching'],
    2,
    88
);

-- ============================================
-- USER DEPRESSION DISTRESS - EXPLORATION BLOCKS
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority) VALUES
(
    'exploration',
    'What small things still feel even a little grounding or real to you, even if they''re small?',
    ARRAY['user_depression_distress', 'depression', 'grounding'],
    ARRAY['empty', 'searching', 'curious'],
    1,
    92
),
(
    'exploration',
    'How long has this heaviness been present? Was there a specific moment or event that seemed to deepen it?',
    ARRAY['user_depression_distress', 'depression', 'timeline'],
    ARRAY['heavy', 'reflective', 'curious'],
    1,
    90
),
(
    'exploration',
    'When you think about what you''ve lost, what feels most significant—the person, the future you imagined, or something else?',
    ARRAY['user_depression_distress', 'depression', 'loss'],
    ARRAY['sad', 'reflective', 'grieving'],
    1,
    88
),
(
    'exploration',
    'Do you have any support offline—friends, family, a therapist, or anyone you can talk to about what you''re going through?',
    ARRAY['user_depression_distress', 'depression', 'support'],
    ARRAY['lonely', 'seeking', 'curious'],
    1,
    95
),
(
    'exploration',
    'What used to bring you joy or energy before this? Even if it doesn''t feel the same now, what was it?',
    ARRAY['user_depression_distress', 'depression', 'joy'],
    ARRAY['empty', 'reflective', 'curious'],
    2,
    85
),
(
    'exploration',
    'When you notice the numbness or emptiness, what happens if you try to name what you''re actually feeling underneath it?',
    ARRAY['user_depression_distress', 'depression', 'awareness'],
    ARRAY['numb', 'curious', 'reflective'],
    2,
    88
),
(
    'exploration',
    'What would it feel like to reconnect with parts of yourself that existed before this relationship or this loss?',
    ARRAY['user_depression_distress', 'depression', 'identity'],
    ARRAY['lost', 'searching', 'hopeful'],
    2,
    85
),
(
    'exploration',
    'If this heaviness could speak, what would it be trying to tell you?',
    ARRAY['user_depression_distress', 'depression', 'meaning'],
    ARRAY['heavy', 'curious', 'reflective'],
    2,
    90
);

COMMENT ON TABLE amora_response_blocks IS 'Block-based response architecture for rich, varied, non-repetitive Amora responses. Includes user-side anxiety and depression distress topics (feeling states, not clinical diagnoses).';
