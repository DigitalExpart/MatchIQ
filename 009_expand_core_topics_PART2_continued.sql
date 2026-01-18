-- Migration 009 Part 2 Continued: Remaining Critical Topics
-- Adds blocks for: separation, jealousy, infidelity, trust, communication, situationship
-- Continues from 009_expand_core_topics_PART2_critical.sql

-- ============================================================================
-- SEPARATION (Current: 9, Need: 21 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 3 reframe (s2)
-- ============================================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- SEPARATION - Reflection blocks (6)
('reflection', 'It sounds like being separated is creating a lot of uncertainty about where things stand, and that limbo can feel really uncomfortable.', ARRAY['separation', 'uncertainty', 'limbo'], ARRAY['confused', 'worried'], 1, 50, true),
('reflection', 'Separation can feel like you''re in a strange in-between space, not quite together but not fully apart, and that ambiguity is exhausting.', ARRAY['separation', 'limbo', 'uncertainty'], ARRAY['confused', 'tired'], 2, 50, true),
('reflection', 'It sounds like part of you is wondering if the separation will lead to reconciliation or to an ending, and not knowing is hard.', ARRAY['separation', 'future', 'uncertainty'], ARRAY['worried', 'confused'], 2, 50, true),
('reflection', 'The distance of separation can sometimes make you miss what you had, even if you know things weren''t working, and that pull is confusing.', ARRAY['separation', 'longing', 'confusion'], ARRAY['confused', 'sad'], 2, 50, true),
('reflection', 'It sounds like you''re using this separation to figure out what you really want and need, and that process of clarity can be both painful and necessary.', ARRAY['separation', 'clarity', 'needs', 'self'], ARRAY['reflective', 'confused'], 2, 50, true),
('reflection', 'Separation often brings up questions about whether you''re making the right choice, and that doubt can make the process feel even harder.', ARRAY['separation', 'doubt', 'decision'], ARRAY['confused', 'worried'], 2, 50, true),

-- SEPARATION - Normalization blocks (6)
('normalization', 'Separation is often a time of uncertainty, and it''s normal to feel confused about what you want or where things are heading.', ARRAY['separation', 'uncertainty', 'confusion'], ARRAY['confused', 'worried'], 1, 50, true),
('normalization', 'Many people find that separation brings up mixed feelings—relief at having space, sadness about the distance, hope for reconciliation, fear of ending. All of those feelings are valid.', ARRAY['separation', 'mixed_emotions', 'feelings'], ARRAY['confused', 'sad'], 2, 50, true),
('normalization', 'It''s common during separation to go back and forth about whether you want to work things out or move on. That indecision is normal when you''re processing such a big change.', ARRAY['separation', 'indecision', 'confusion'], ARRAY['confused', 'tired'], 2, 50, true),
('normalization', 'Separation can feel like a test of whether the relationship can be fixed, and that pressure can make it hard to know what you really want versus what you think you should want.', ARRAY['separation', 'pressure', 'clarity'], ARRAY['confused', 'stressed'], 2, 50, true),
('normalization', 'It''s normal to miss your partner during separation, even if you know the relationship had problems. Missing someone doesn''t mean you should get back together—it just means you had a connection that mattered.', ARRAY['separation', 'longing', 'feelings'], ARRAY['sad', 'confused'], 2, 50, true),
('normalization', 'Some people find that separation gives them clarity about what they need, while others find it makes things more confusing. Both experiences are valid, and there''s no right way to feel during this time.', ARRAY['separation', 'clarity', 'confusion', 'process'], ARRAY['confused', 'reflective'], 2, 50, true),

-- SEPARATION - Exploration blocks (6)
('exploration', 'What do you hope to figure out during this separation? What you want, what you need, or something else?', ARRAY['separation', 'clarity', 'needs'], ARRAY['confused', 'hopeful'], 1, 50, true),
('exploration', 'How has being separated changed how you see the relationship or what you want from it?', ARRAY['separation', 'perspective', 'needs'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'When you imagine your life if you stay separated or if you reconcile, what feels more aligned with what you need?', ARRAY['separation', 'future', 'needs', 'decision'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'What have you learned about yourself during this separation that you didn''t know before?', ARRAY['separation', 'self', 'growth', 'awareness'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What would need to change for you to feel good about reconciling, if that''s something you''re considering?', ARRAY['separation', 'reconciliation', 'needs', 'change'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'If you could give yourself advice about this separation, what would you want to remember?', ARRAY['separation', 'wisdom', 'self', 'compassion'], ARRAY['compassionate', 'reflective'], 2, 50, true),

-- SEPARATION - Reframe blocks (3)
('reframe', 'Separation is often seen as a last resort before ending a relationship, but it can also be a valuable tool for gaining clarity. Sometimes distance helps you see what you really need and whether the relationship can meet those needs. It''s not a failure to need space—it''s a recognition that you need time to process and decide what''s right for you.', ARRAY['separation', 'clarity', 'process', 'self_care'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('reframe', 'During separation, it''s common to feel pressure to know what you want or to make a decision quickly, but there''s no timeline for clarity. Some people know within weeks, others need months. What matters is giving yourself the time and space you need to understand what''s right for you, not what others expect or what you think you should want.', ARRAY['separation', 'time', 'pressure', 'self'], ARRAY['reflective', 'compassionate'], 2, 50, true),
('reframe', 'Separation doesn''t have to mean the relationship is over—it can be a pause that allows both people to reflect and decide if they want to work on things together. But it also doesn''t mean you have to reconcile. The purpose of separation is to give you clarity, whatever that clarity reveals. Trust yourself to know what you need when you''re ready.', ARRAY['separation', 'clarity', 'trust', 'self'], ARRAY['hopeful', 'reflective'], 2, 50, true),

-- ============================================================================
-- JEALOUSY (Current: 9, Need: 21 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 3 reframe (s2)
-- ============================================================================

-- JEALOUSY - Reflection blocks (6)
('reflection', 'It sounds like jealousy is showing up in ways that feel uncomfortable or even surprising to you, and that can be hard to sit with.', ARRAY['jealousy', 'emotions', 'self_awareness'], ARRAY['confused', 'uncomfortable'], 1, 50, true),
('reflection', 'Jealousy often brings up questions about your own worth and whether you''re enough, and those fears can feel really real even when you know they might not be true.', ARRAY['jealousy', 'self_worth', 'fear'], ARRAY['worried', 'hurt'], 2, 50, true),
('reflection', 'It sounds like part of you recognizes that the jealousy might be about something deeper than just the current situation, and that awareness can be both helpful and challenging.', ARRAY['jealousy', 'patterns', 'self_awareness'], ARRAY['reflective', 'confused'], 2, 50, true),
('reflection', 'Jealousy can make you question your partner''s feelings or intentions, even when there''s no real reason to, and that uncertainty is exhausting.', ARRAY['jealousy', 'trust', 'uncertainty'], ARRAY['worried', 'confused'], 2, 50, true),
('reflection', 'It sounds like the jealousy is bringing up old wounds or insecurities, and that can make it feel bigger than the current situation warrants.', ARRAY['jealousy', 'past', 'insecurity'], ARRAY['hurt', 'worried'], 2, 50, true),
('reflection', 'Jealousy often makes you want to control situations or your partner''s behavior, and recognizing that urge can feel uncomfortable.', ARRAY['jealousy', 'control', 'awareness'], ARRAY['uncomfortable', 'reflective'], 2, 50, true),

-- JEALOUSY - Normalization blocks (6)
('normalization', 'Jealousy is a common human emotion, and feeling it doesn''t make you a bad person or mean your relationship is doomed. It''s information about what you need or what you''re afraid of.', ARRAY['jealousy', 'emotions', 'normal'], ARRAY['confused', 'relieved'], 1, 50, true),
('normalization', 'Many people experience jealousy as a signal that something feels unsafe or uncertain in the relationship, even if there''s no actual threat. That feeling is real and worth exploring.', ARRAY['jealousy', 'safety', 'uncertainty'], ARRAY['worried', 'confused'], 2, 50, true),
('normalization', 'It''s common for jealousy to be triggered by past experiences of betrayal or abandonment, even when your current partner hasn''t done anything wrong. Those old wounds can make you more sensitive to potential threats.', ARRAY['jealousy', 'past', 'triggers'], ARRAY['hurt', 'worried'], 2, 50, true),
('normalization', 'Jealousy often comes from a place of insecurity about your own worth or desirability, and those feelings can be really painful even when you know they''re not true.', ARRAY['jealousy', 'insecurity', 'self_worth'], ARRAY['hurt', 'worried'], 2, 50, true),
('normalization', 'Some people feel ashamed of their jealousy, thinking it means they''re controlling or insecure, but jealousy is usually a sign that you care and that something feels uncertain. The key is how you respond to it, not that you feel it.', ARRAY['jealousy', 'shame', 'understanding'], ARRAY['confused', 'relieved'], 2, 50, true),
('normalization', 'Jealousy can sometimes be a signal that you need more reassurance or connection in the relationship, even if the jealousy itself feels uncomfortable to express.', ARRAY['jealousy', 'needs', 'connection'], ARRAY['confused', 'hurt'], 2, 50, true),

-- JEALOUSY - Exploration blocks (6)
('exploration', 'When the jealousy shows up, what situation or thought usually triggers it?', ARRAY['jealousy', 'triggers', 'awareness'], ARRAY['reflective', 'confused'], 1, 50, true),
('exploration', 'What do you think the jealousy is trying to tell you? What need or fear is underneath it?', ARRAY['jealousy', 'needs', 'fears', 'self_awareness'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'How do you want to respond to the jealousy? What would feel healthy versus what feels reactive?', ARRAY['jealousy', 'response', 'healthy', 'self'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'What would help you feel more secure in the relationship? Is it something your partner could do, or something you need to work on within yourself?', ARRAY['jealousy', 'security', 'needs', 'self'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'When you look at the jealousy without judgment, what do you think it''s really about? Past experiences, current needs, or something else?', ARRAY['jealousy', 'understanding', 'past', 'needs'], ARRAY['reflective', 'compassionate'], 2, 50, true),
('exploration', 'What would it look like to address the jealousy in a way that honors both your feelings and your partner''s autonomy?', ARRAY['jealousy', 'communication', 'boundaries', 'balance'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- JEALOUSY - Reframe blocks (3)
('reframe', 'Jealousy is often dismissed as insecurity or control, but it can also be a signal that something important feels uncertain or unsafe in the relationship. Rather than just trying to suppress the jealousy, it can be helpful to explore what it''s trying to tell you. Is it about a need for more connection? A fear of abandonment? A lack of trust? Understanding the root can help you address it in a way that''s healthy for both you and your relationship.', ARRAY['jealousy', 'understanding', 'needs', 'communication'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('reframe', 'Jealousy often comes from a place of feeling like you''re not enough or that you could easily be replaced. But the truth is, your worth isn''t determined by whether someone else chooses you, and a healthy relationship isn''t about possession or control. Working through jealousy often means addressing deeper insecurities about your own value, separate from the relationship.', ARRAY['jealousy', 'self_worth', 'insecurity', 'healing'], ARRAY['reflective', 'compassionate'], 2, 50, true),
('reframe', 'Managing jealousy in a healthy way means finding the balance between honoring your feelings and not letting them control your behavior or your partner''s freedom. It''s okay to feel jealous and to communicate that to your partner, but it''s also important to take responsibility for your own insecurities and not expect your partner to fix them by restricting their life. Trust is built through consistent actions over time, not through control.', ARRAY['jealousy', 'balance', 'trust', 'responsibility'], ARRAY['reflective', 'hopeful'], 2, 50, true);

-- ============================================================================
-- Note: This continues with infidelity, trust, communication, situationship in next file
-- ============================================================================
