-- Migration 009 Part 2 Final: Remaining Critical Topics
-- Adds blocks for: infidelity, trust, communication, situationship
-- Continues from 009_expand_core_topics_PART2_continued.sql

-- ============================================================================
-- INFIDELITY (Current: 8, Need: 22 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 4 reframe (s2)
-- ============================================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- INFIDELITY - Reflection blocks (6)
('reflection', 'It sounds like discovering the infidelity has left you questioning everything you thought you knew about your relationship, and that disorientation is completely understandable.', ARRAY['infidelity', 'cheating', 'betrayal'], ARRAY['hurt', 'shocked', 'confused'], 1, 50, true),
('reflection', 'The pain of infidelity can make you question your own worth and whether you were enough, and those doubts can add another layer of hurt on top of the betrayal.', ARRAY['infidelity', 'self_worth', 'hurt'], ARRAY['hurt', 'sad'], 2, 50, true),
('reflection', 'It sounds like part of you is trying to make sense of how someone you trusted could do this, and that search for understanding can feel endless.', ARRAY['infidelity', 'trust', 'understanding'], ARRAY['confused', 'hurt'], 2, 50, true),
('reflection', 'Infidelity often brings up questions about what was real in the relationship and what wasn''t, and that uncertainty can feel like it''s erasing your history together.', ARRAY['infidelity', 'reality', 'trust'], ARRAY['confused', 'hurt'], 2, 50, true),
('reflection', 'It sounds like you''re caught between wanting to know every detail and feeling like nothing they say could ever make sense of it.', ARRAY['infidelity', 'understanding', 'confusion'], ARRAY['confused', 'hurt'], 2, 50, true),
('reflection', 'The betrayal of infidelity can make you question not just this relationship, but your ability to trust anyone, and that fear is real and valid.', ARRAY['infidelity', 'trust', 'future'], ARRAY['worried', 'hurt'], 2, 50, true),

-- INFIDELITY - Normalization blocks (6)
('normalization', 'Discovering infidelity is often described as one of the most traumatic experiences in a relationship, and the shock and pain you''re feeling are completely normal responses to such a profound betrayal.', ARRAY['infidelity', 'trauma', 'shock'], ARRAY['shocked', 'hurt'], 1, 50, true),
('normalization', 'It''s common after discovering infidelity to replay conversations and moments, searching for signs you might have missed. That''s your mind trying to make sense of something that feels senseless.', ARRAY['infidelity', 'patterns', 'understanding'], ARRAY['confused', 'hurt'], 2, 50, true),
('normalization', 'Many people who''ve experienced infidelity find themselves questioning their own judgment and whether they can trust themselves to see red flags in the future. That self-doubt is understandable, even though the infidelity wasn''t your fault.', ARRAY['infidelity', 'self_doubt', 'trust'], ARRAY['worried', 'hurt'], 2, 50, true),
('normalization', 'After infidelity, it''s normal to feel like you''ll never be able to trust again. That fear reflects how deeply this betrayal has shaken your sense of safety in relationships.', ARRAY['infidelity', 'trust', 'fear'], ARRAY['worried', 'hurt'], 2, 50, true),
('normalization', 'Some people experience a mix of emotions after discovering infidelity—anger, sadness, numbness, even relief if the relationship was already struggling. All of those feelings are valid.', ARRAY['infidelity', 'mixed_emotions', 'grief'], ARRAY['confused', 'hurt'], 2, 50, true),
('normalization', 'Infidelity often brings up old wounds from past relationships or even childhood experiences of betrayal or abandonment. If this pain feels disproportionately intense, it might be touching on those deeper fears.', ARRAY['infidelity', 'past', 'triggers'], ARRAY['hurt', 'worried'], 2, 50, true),

-- INFIDELITY - Exploration blocks (6)
('exploration', 'What feels hardest to process right now? The betrayal itself, the lies, or something else?', ARRAY['infidelity', 'betrayal', 'feelings'], ARRAY['hurt', 'confused'], 1, 50, true),
('exploration', 'What do you think you need most right now? Space to process, answers, time to decide, something else?', ARRAY['infidelity', 'needs', 'decision'], ARRAY['confused', 'hurt'], 2, 50, true),
('exploration', 'How has this experience changed what you want or need in relationships, whether you stay or leave?', ARRAY['infidelity', 'needs', 'growth', 'future'], ARRAY['reflective', 'hurt'], 2, 50, true),
('exploration', 'When you think about rebuilding trust, what would that actually look like to you? What would need to happen?', ARRAY['infidelity', 'trust', 'healing', 'needs'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What boundaries or needs do you want to honor going forward, whether in this relationship or future ones?', ARRAY['infidelity', 'boundaries', 'needs', 'self'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'If you could say one thing to yourself about this experience, what would you want to remember?', ARRAY['infidelity', 'wisdom', 'self', 'healing'], ARRAY['compassionate', 'reflective'], 2, 50, true),

-- INFIDELITY - Reframe blocks (4)
('reframe', 'Infidelity often reveals deeper issues in a relationship that were already present—communication problems, emotional distance, unmet needs. While this doesn''t excuse the cheating, it can help you see that the betrayal was a symptom of something larger. Understanding this doesn''t minimize your pain, but it can help you see what needs to be addressed if you choose to work through this together.', ARRAY['infidelity', 'patterns', 'understanding', 'communication'], ARRAY['reflective', 'hurt'], 2, 50, true),
('reframe', 'After infidelity, many people struggle with feeling like they weren''t enough, but the truth is that cheating is almost always about the person who cheated, not the person who was betrayed. Their choices reflect their own struggles, values, and capacity for honesty, not your worth or desirability. You didn''t cause this, and you couldn''t have prevented it by being different.', ARRAY['infidelity', 'self_worth', 'blame', 'understanding'], ARRAY['hurt', 'reflective'], 2, 50, true),
('reframe', 'Trust after infidelity is something that has to be rebuilt, not just expected. If you choose to stay, it will require consistent actions from your partner over time—transparency, accountability, and changed behavior. And if you choose to leave, it''s important to remember that this one person''s betrayal doesn''t define your ability to trust or be trusted in future relationships. Healing takes time, but it is possible.', ARRAY['infidelity', 'trust', 'healing', 'future'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Infidelity can sometimes be a wake-up call that the relationship wasn''t meeting both people''s needs, even if the way that became clear was painful. Some couples use it as an opportunity to rebuild something stronger, while others realize it''s time to end things. Neither path is wrong—what matters is choosing what''s right for you, not what others expect or what you think you should do.', ARRAY['infidelity', 'decision', 'needs', 'self'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- ============================================================================
-- TRUST (Current: 8, Need: 22 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 4 reframe (s2)
-- ============================================================================

-- TRUST - Reflection blocks (6)
('reflection', 'It sounds like trust feels fragile or broken right now, and that uncertainty about whether you can rely on your partner is really hard to sit with.', ARRAY['trust', 'uncertainty', 'fear'], ARRAY['worried', 'hurt'], 1, 50, true),
('reflection', 'When trust has been damaged, it can make you question everything—past moments, current actions, future intentions—and that hypervigilance is exhausting.', ARRAY['trust', 'hypervigilance', 'uncertainty'], ARRAY['worried', 'tired'], 2, 50, true),
('reflection', 'It sounds like part of you wants to trust again but another part is protecting itself from being hurt, and that internal conflict is really difficult.', ARRAY['trust', 'conflict', 'protection'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'Trust issues often come from past experiences of betrayal, and those old wounds can make it hard to trust even when your current partner hasn''t done anything wrong.', ARRAY['trust', 'past', 'wounds'], ARRAY['hurt', 'worried'], 2, 50, true),
('reflection', 'It sounds like you''re caught between wanting to give your partner the benefit of the doubt and feeling like you need to protect yourself, and that balance is hard to find.', ARRAY['trust', 'balance', 'protection'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'When trust feels broken, it can make you question your own judgment and whether you can trust yourself to see red flags, and that self-doubt adds another layer of difficulty.', ARRAY['trust', 'self_doubt', 'judgment'], ARRAY['worried', 'confused'], 2, 50, true),

-- TRUST - Normalization blocks (6)
('normalization', 'Trust issues are really common, especially if you''ve experienced betrayal in the past. Feeling cautious doesn''t mean you''re broken—it means you''re trying to protect yourself.', ARRAY['trust', 'past', 'protection'], ARRAY['worried', 'relieved'], 1, 50, true),
('normalization', 'It''s normal to feel like you need proof or reassurance when trust has been damaged. That need for certainty is understandable, even though trust inherently involves some uncertainty.', ARRAY['trust', 'reassurance', 'uncertainty'], ARRAY['worried', 'confused'], 2, 50, true),
('normalization', 'Many people with trust issues find themselves looking for signs of betrayal even when there aren''t any, almost like their mind is trying to prepare for the worst. That hypervigilance is exhausting but understandable.', ARRAY['trust', 'hypervigilance', 'fear'], ARRAY['worried', 'tired'], 2, 50, true),
('normalization', 'Trust is built slowly over time through consistent actions, and it can be damaged quickly by one betrayal. That imbalance can make rebuilding feel impossible, but it''s not—it just takes time and consistent effort from both people.', ARRAY['trust', 'rebuilding', 'time'], ARRAY['hopeful', 'worried'], 2, 50, true),
('normalization', 'Some people feel ashamed of their trust issues, thinking they should just "get over it" or "trust more," but trust issues often come from real experiences of being hurt. Your caution makes sense given your history.', ARRAY['trust', 'shame', 'understanding'], ARRAY['confused', 'relieved'], 2, 50, true),
('normalization', 'It''s common to want to trust but feel like you can''t, almost like there''s a wall between you and that ability. That disconnect is frustrating, but it''s also protective—your mind is trying to keep you safe.', ARRAY['trust', 'protection', 'conflict'], ARRAY['frustrated', 'confused'], 2, 50, true),

-- TRUST - Exploration blocks (6)
('exploration', 'What would help you feel more secure in the relationship? Is it something your partner could do, or something you need to work on within yourself?', ARRAY['trust', 'security', 'needs'], ARRAY['reflective', 'worried'], 1, 50, true),
('exploration', 'When you think about what trust means to you, what does it actually look like? What actions or behaviors would demonstrate trustworthiness?', ARRAY['trust', 'meaning', 'needs'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'What from your past is making it hard to trust now, and how might that be affecting your current relationship?', ARRAY['trust', 'past', 'patterns'], ARRAY['reflective', 'hurt'], 2, 50, true),
('exploration', 'If you could rebuild trust, what would that process look like to you? What would need to happen over time?', ARRAY['trust', 'rebuilding', 'process', 'needs'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What boundaries or agreements might help you feel safer while you work on rebuilding trust?', ARRAY['trust', 'boundaries', 'safety', 'needs'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'How do you want to respond to the trust issues? What would feel healthy versus what feels like it''s coming from fear?', ARRAY['trust', 'response', 'healthy', 'fear'], ARRAY['reflective', 'determined'], 2, 50, true),

-- TRUST - Reframe blocks (4)
('reframe', 'Trust isn''t something you either have or don''t have—it exists on a spectrum, and it can be rebuilt gradually over time. After trust has been damaged, it''s normal to need more reassurance and transparency than you did before. That''s not being controlling or insecure; it''s a reasonable response to being hurt. A partner who''s committed to rebuilding trust will understand this and be willing to provide what you need.', ARRAY['trust', 'rebuilding', 'process', 'needs'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Trust issues often come from past experiences of betrayal, abandonment, or inconsistency, and those old wounds can make you more sensitive to potential threats in current relationships. Recognizing this doesn''t mean you''re broken or that you can''t trust—it just means you have information about what you need to feel safe. Working through trust issues often involves both addressing past wounds and building new experiences of reliability with your current partner.', ARRAY['trust', 'past', 'healing', 'rebuilding'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Rebuilding trust requires consistent actions over time, not just apologies or promises. Words matter, but actions matter more. If you''re trying to rebuild trust, it means showing up consistently, being transparent, and following through on commitments. And if you''re the one who needs to trust again, it means giving your partner opportunities to demonstrate reliability while also honoring your own need for safety and reassurance.', ARRAY['trust', 'rebuilding', 'actions', 'consistency'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Trust is also about trusting yourself—your ability to see red flags, to set boundaries, to leave if you need to. Sometimes the fear isn''t just about trusting your partner; it''s about trusting that you can handle it if things go wrong. Building that self-trust can actually make it easier to trust others, because you know you can protect yourself if needed.', ARRAY['trust', 'self_trust', 'boundaries', 'safety'], ARRAY['hopeful', 'reflective'], 2, 50, true);

-- ============================================================================
-- Note: Communication and Situationship will be in Part 3
-- ============================================================================
