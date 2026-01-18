-- Migration 009 Part 3 Continued: Remaining Topics
-- Adds blocks for: pretense, inauthenticity, marriage_strain, talking_stage, unclear, unlovable
-- Continues from 009_expand_core_topics_PART3_remaining.sql

-- ============================================================================
-- PRETENSE (Current: 7, Need: 23 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 7 exploration (4s1, 3s2), 4 reframe (s2)
-- ============================================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- PRETENSE - Reflection blocks (6)
('reflection', 'It sounds like you''re feeling like you have to pretend to be someone you''re not in this relationship, and that inauthenticity is really exhausting.', ARRAY['pretense', 'inauthenticity', 'exhaustion'], ARRAY['tired', 'sad'], 1, 50, true),
('reflection', 'When you feel like you''re wearing a mask or playing a role, it can make you question who you really are and what you actually want, and that confusion is really difficult.', ARRAY['pretense', 'identity', 'confusion'], ARRAY['confused', 'lost'], 2, 50, true),
('reflection', 'It sounds like part of you knows you''re not being authentic, but another part is afraid of what might happen if you show your real self, and that fear is really challenging.', ARRAY['pretense', 'fear', 'authenticity'], ARRAY['worried', 'confused'], 2, 50, true),
('reflection', 'Pretending to be someone you''re not can make you feel like you''re losing yourself, and that sense of disconnection from who you really are is really painful.', ARRAY['pretense', 'self', 'disconnection'], ARRAY['sad', 'lost'], 2, 50, true),
('reflection', 'It sounds like you''re caught between wanting to be yourself and feeling like you need to be different to be loved or accepted, and that conflict is really hard.', ARRAY['pretense', 'conflict', 'self_worth'], ARRAY['confused', 'hurt'], 2, 50, true),
('reflection', 'When you''re pretending, it can make you wonder if your partner would still want you if they knew the real you, and that fear is really unsettling.', ARRAY['pretense', 'fear', 'acceptance'], ARRAY['worried', 'hurt'], 2, 50, true),

-- PRETENSE - Normalization blocks (6)
('normalization', 'Many people find themselves pretending to be someone they''re not in relationships, especially if they''ve learned that their authentic self isn''t acceptable or lovable. That pretense is exhausting, but it''s also understandable.', ARRAY['pretense', 'normal', 'understanding'], ARRAY['relieved', 'tired'], 1, 50, true),
('normalization', 'It''s common to feel like you need to be different to be loved, especially if you''ve experienced rejection or judgment for being yourself in the past. That fear is real, even though it''s painful to live with.', ARRAY['pretense', 'fear', 'past'], ARRAY['worried', 'hurt'], 2, 50, true),
('normalization', 'Pretending often comes from a place of wanting to be accepted and loved, but it can make you feel like you''re not really being seen or known, which can be lonely even when you''re in a relationship.', ARRAY['pretense', 'loneliness', 'acceptance'], ARRAY['lonely', 'sad'], 2, 50, true),
('normalization', 'Some people pretend because they''re afraid their real self isn''t enough, but the truth is that you deserve to be loved for who you are, not for who you think you need to be.', ARRAY['pretense', 'self_worth', 'acceptance'], ARRAY['hurt', 'hopeful'], 2, 50, true),
('normalization', 'It''s normal to feel exhausted from pretending, because maintaining a facade takes a lot of energy. That exhaustion is a sign that being inauthentic isn''t sustainable long-term.', ARRAY['pretense', 'exhaustion', 'sustainability'], ARRAY['tired', 'reflective'], 2, 50, true),
('normalization', 'Many people who pretend find that they start to lose touch with who they really are, almost like the mask becomes so familiar that they forget what''s underneath. Reconnecting with your authentic self takes time and self-reflection.', ARRAY['pretense', 'identity', 'self'], ARRAY['lost', 'reflective'], 2, 50, true),

-- PRETENSE - Exploration blocks (7)
('exploration', 'What makes you feel like you need to pretend? Fear of rejection, past experiences, or something else?', ARRAY['pretense', 'fear', 'awareness'], ARRAY['reflective', 'worried'], 1, 50, true),
('exploration', 'What parts of yourself are you hiding or pretending aren''t there?', ARRAY['pretense', 'self', 'awareness'], ARRAY['reflective', 'honest'], 2, 50, true),
('exploration', 'What would it feel like to show your real self to your partner? What are you afraid might happen?', ARRAY['pretense', 'fear', 'authenticity'], ARRAY['worried', 'reflective'], 2, 50, true),
('exploration', 'How has pretending affected how you see yourself or what you want in relationships?', ARRAY['pretense', 'self', 'growth'], ARRAY['reflective', 'sad'], 2, 50, true),
('exploration', 'What would it look like to start being more authentic, even in small ways?', ARRAY['pretense', 'authenticity', 'growth'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What do you think you need to feel safe enough to be yourself in this relationship?', ARRAY['pretense', 'safety', 'needs'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'If you could give yourself permission to be authentic, what would that look like?', ARRAY['pretense', 'permission', 'authenticity'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- PRETENSE - Reframe blocks (4)
('reframe', 'Pretending to be someone you''re not often comes from a fear that your authentic self isn''t enough or won''t be accepted. But the truth is, you deserve to be loved for who you are, not for who you think you need to be. Pretending might feel safer in the short term, but it''s exhausting and unsustainable long-term. Being authentic means risking rejection, but it also means being seen and known, which is what real connection requires.', ARRAY['pretense', 'authenticity', 'self_worth', 'connection'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'If you''re pretending because you''re afraid your partner won''t accept the real you, that''s information. A relationship where you can''t be yourself isn''t really a relationship—it''s a performance. You deserve to be with someone who loves and accepts you for who you are, not for who you''re pretending to be. If your partner can''t accept the real you, that doesn''t mean you''re not enough—it means you''re not compatible.', ARRAY['pretense', 'acceptance', 'compatibility', 'self_worth'], ARRAY['determined', 'reflective'], 2, 50, true),
('reframe', 'Being authentic doesn''t mean you have to share everything all at once or be completely vulnerable immediately. It can be a gradual process of showing more of yourself over time, testing the waters to see how your partner responds. But it does mean moving away from pretending and toward being genuine. That process can be scary, but it''s also liberating—there''s a relief that comes from not having to maintain a facade.', ARRAY['pretense', 'authenticity', 'process', 'freedom'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Pretending often comes from past experiences of rejection or judgment, and those old wounds can make you believe that your authentic self isn''t acceptable. But those past experiences don''t define your worth or your ability to be loved. Working through pretense often involves healing those old wounds and learning that you''re worthy of love exactly as you are. It also means finding people who can see and appreciate your authentic self.', ARRAY['pretense', 'past', 'healing', 'self_worth'], ARRAY['hopeful', 'compassionate'], 2, 50, true),

-- ============================================================================
-- INAUTHENTICITY (Current: 5, Need: 25 more to reach 30)
-- Distribution: 7 reflection (4s1, 3s2), 7 normalization (4s1, 3s2), 7 exploration (4s1, 3s2), 4 reframe (s2)
-- ============================================================================

-- INAUTHENTICITY - Reflection blocks (7)
('reflection', 'It sounds like you''re feeling like you can''t be your real self in this relationship, and that inauthenticity is making you feel disconnected and lonely.', ARRAY['inauthenticity', 'disconnection', 'loneliness'], ARRAY['lonely', 'sad'], 1, 50, true),
('reflection', 'When you feel like you''re not being authentic, it can make you question who you really are and what you actually want, and that confusion is really difficult.', ARRAY['inauthenticity', 'identity', 'confusion'], ARRAY['confused', 'lost'], 2, 50, true),
('reflection', 'It sounds like part of you knows you''re not showing your true self, but you''re afraid of what might happen if you do, and that fear is really challenging.', ARRAY['inauthenticity', 'fear', 'authenticity'], ARRAY['worried', 'confused'], 2, 50, true),
('reflection', 'Being inauthentic can make you feel like you''re living a lie, and that sense of not being genuine is really painful.', ARRAY['inauthenticity', 'lying', 'pain'], ARRAY['sad', 'guilty'], 2, 50, true),
('reflection', 'It sounds like you''re caught between wanting to be yourself and feeling like you need to be different to fit in or be accepted, and that conflict is exhausting.', ARRAY['inauthenticity', 'conflict', 'acceptance'], ARRAY['tired', 'confused'], 2, 50, true),
('reflection', 'When you''re not being authentic, it can make you wonder if your partner even knows the real you, and that question is really unsettling.', ARRAY['inauthenticity', 'connection', 'uncertainty'], ARRAY['worried', 'lonely'], 2, 50, true),
('reflection', 'It sounds like the inauthenticity is making you feel like you''re losing yourself, and that sense of disconnection from who you really are is really painful.', ARRAY['inauthenticity', 'self', 'loss'], ARRAY['sad', 'lost'], 2, 50, true),

-- INAUTHENTICITY - Normalization blocks (7)
('normalization', 'Many people struggle with being authentic in relationships, especially if they''ve learned that their true self isn''t acceptable or lovable. That struggle is common, even though it''s painful.', ARRAY['inauthenticity', 'normal', 'common'], ARRAY['relieved', 'sad'], 1, 50, true),
('normalization', 'It''s common to feel like you need to be different to be loved, especially if you''ve experienced rejection or judgment for being yourself. That fear is real, even though it''s painful to live with.', ARRAY['inauthenticity', 'fear', 'past'], ARRAY['worried', 'hurt'], 2, 50, true),
('normalization', 'Being inauthentic often comes from a place of wanting to be accepted and loved, but it can make you feel like you''re not really being seen or known, which can be lonely even when you''re in a relationship.', ARRAY['inauthenticity', 'loneliness', 'acceptance'], ARRAY['lonely', 'sad'], 2, 50, true),
('normalization', 'Some people feel inauthentic because they''re afraid their real self isn''t enough, but the truth is that you deserve to be loved for who you are, not for who you think you need to be.', ARRAY['inauthenticity', 'self_worth', 'acceptance'], ARRAY['hurt', 'hopeful'], 2, 50, true),
('normalization', 'It''s normal to feel exhausted from being inauthentic, because maintaining a facade takes a lot of energy. That exhaustion is a sign that being inauthentic isn''t sustainable long-term.', ARRAY['inauthenticity', 'exhaustion', 'sustainability'], ARRAY['tired', 'reflective'], 2, 50, true),
('normalization', 'Many people who feel inauthentic find that they start to lose touch with who they really are, almost like the mask becomes so familiar that they forget what''s underneath. Reconnecting with your authentic self takes time and self-reflection.', ARRAY['inauthenticity', 'identity', 'self'], ARRAY['lost', 'reflective'], 2, 50, true),
('normalization', 'Feeling inauthentic can make you question whether your relationship is real, since you''re not showing your real self. That questioning is valid, and it''s worth exploring whether you can be more authentic in this relationship or if you need to find one where you can.', ARRAY['inauthenticity', 'relationship', 'authenticity'], ARRAY['reflective', 'worried'], 2, 50, true),

-- INAUTHENTICITY - Exploration blocks (7)
('exploration', 'What makes you feel like you can''t be your real self? Fear, past experiences, or something else?', ARRAY['inauthenticity', 'fear', 'awareness'], ARRAY['reflective', 'worried'], 1, 50, true),
('exploration', 'What parts of yourself are you hiding or not showing?', ARRAY['inauthenticity', 'self', 'awareness'], ARRAY['reflective', 'honest'], 2, 50, true),
('exploration', 'What would it feel like to be more authentic? What are you afraid might happen?', ARRAY['inauthenticity', 'fear', 'authenticity'], ARRAY['worried', 'reflective'], 2, 50, true),
('exploration', 'How has being inauthentic affected how you see yourself or what you want in relationships?', ARRAY['inauthenticity', 'self', 'growth'], ARRAY['reflective', 'sad'], 2, 50, true),
('exploration', 'What would it look like to start being more authentic, even in small ways?', ARRAY['inauthenticity', 'authenticity', 'growth'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What do you think you need to feel safe enough to be yourself?', ARRAY['inauthenticity', 'safety', 'needs'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'If you could give yourself permission to be authentic, what would that look like?', ARRAY['inauthenticity', 'permission', 'authenticity'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- INAUTHENTICITY - Reframe blocks (4)
('reframe', 'Being authentic means showing your real self—your thoughts, feelings, needs, and who you are. It doesn''t mean you have to be perfect or share everything immediately, but it does mean moving away from pretending and toward being genuine. Authenticity requires vulnerability, which can feel scary, but it''s also what allows for real connection. When you''re authentic, you give others the chance to know and love the real you, not a version you''ve created.', ARRAY['inauthenticity', 'authenticity', 'vulnerability', 'connection'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'If you feel like you can''t be authentic in your relationship, that''s important information. A relationship where you can''t be yourself isn''t really a relationship—it''s a performance. You deserve to be with someone who loves and accepts you for who you are, not for who you think you need to be. If your partner can''t accept the real you, that doesn''t mean you''re not enough—it means you''re not compatible, and you deserve to find someone who can see and appreciate your authentic self.', ARRAY['inauthenticity', 'acceptance', 'compatibility', 'self_worth'], ARRAY['determined', 'reflective'], 2, 50, true),
('reframe', 'Being authentic doesn''t have to happen all at once. It can be a gradual process of showing more of yourself over time, testing the waters to see how your partner responds. But it does mean moving away from pretending and toward being genuine. That process can be scary, but it''s also liberating—there''s a relief that comes from not having to maintain a facade. You might be surprised by how people respond when you show your real self.', ARRAY['inauthenticity', 'authenticity', 'process', 'freedom'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Feeling inauthentic often comes from past experiences of rejection or judgment, and those old wounds can make you believe that your authentic self isn''t acceptable. But those past experiences don''t define your worth or your ability to be loved. Working through inauthenticity involves healing those old wounds and learning that you''re worthy of love exactly as you are. It also means finding people who can see and appreciate your authentic self, rather than trying to fit yourself into relationships where you can''t be real.', ARRAY['inauthenticity', 'past', 'healing', 'self_worth'], ARRAY['hopeful', 'compassionate'], 2, 50, true);

-- ============================================================================
-- Note: Continuing with marriage_strain, talking_stage, unclear, unlovable in next file
-- ============================================================================
