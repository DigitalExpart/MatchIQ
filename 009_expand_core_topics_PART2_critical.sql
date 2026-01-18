-- Migration 009 Part 2: Critical Topics Expansion
-- Adds blocks for: cheating, divorce, separation, jealousy, infidelity, trust, communication, situationship
-- Total: ~170 blocks

-- ============================================================================
-- CHEATING (Current: 9, Need: 21 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 3 reframe (s2)
-- ============================================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- CHEATING - Reflection blocks (6)
('reflection', 'It sounds like discovering the cheating has shaken your sense of reality and trust, and that disorientation is completely understandable.', ARRAY['cheating', 'infidelity', 'betrayal'], ARRAY['hurt', 'angry', 'confused'], 1, 50, true),
('reflection', 'The pain of being cheated on can feel like it''s touching on deeper fears about your worth and whether you''re enough, and those feelings are real and valid.', ARRAY['cheating', 'self_doubt', 'worthiness'], ARRAY['hurt', 'sad'], 2, 50, true),
('reflection', 'It sounds like part of you is questioning everything about the relationship now, wondering what was real and what wasn''t, and that uncertainty is exhausting.', ARRAY['cheating', 'trust', 'reality'], ARRAY['confused', 'hurt'], 2, 50, true),
('reflection', 'Discovering infidelity often brings up questions about whether you missed signs or should have known, and that self-blame can add another layer of pain.', ARRAY['cheating', 'self_doubt', 'guilt'], ARRAY['confused', 'hurt'], 2, 50, true),
('reflection', 'It sounds like you''re caught between wanting to understand why this happened and feeling like no explanation could ever make sense of it.', ARRAY['cheating', 'understanding', 'confusion'], ARRAY['confused', 'angry'], 2, 50, true),
('reflection', 'The betrayal of cheating can make you question not just this relationship, but your ability to trust anyone in the future, and that fear is real.', ARRAY['cheating', 'trust', 'future'], ARRAY['worried', 'hurt'], 2, 50, true),

-- CHEATING - Normalization blocks (6)
('normalization', 'Many people who''ve been cheated on describe feeling like their whole world shifted in an instant, and that sense of disorientation is a normal response to such a profound betrayal.', ARRAY['cheating', 'betrayal', 'shock'], ARRAY['shocked', 'hurt'], 1, 50, true),
('normalization', 'It''s common to cycle through different emotions after discovering cheating—anger, sadness, numbness, even relief—and all of those feelings are valid.', ARRAY['cheating', 'mixed_emotions', 'grief'], ARRAY['confused', 'hurt'], 2, 50, true),
('normalization', 'After being cheated on, it''s normal to replay conversations and moments, searching for clues you might have missed. That''s your mind trying to make sense of something that feels senseless.', ARRAY['cheating', 'patterns', 'understanding'], ARRAY['confused', 'hurt'], 2, 50, true),
('normalization', 'Many people who''ve experienced infidelity find themselves questioning their own judgment and whether they can trust themselves to see red flags in the future. That self-doubt is understandable, even though the cheating wasn''t your fault.', ARRAY['cheating', 'self_doubt', 'trust'], ARRAY['worried', 'hurt'], 2, 50, true),
('normalization', 'It''s normal to feel like you''ll never be able to trust again after being cheated on. That fear reflects how deeply this betrayal has shaken your sense of safety in relationships.', ARRAY['cheating', 'trust', 'fear', 'future'], ARRAY['worried', 'hurt'], 2, 50, true),
('normalization', 'Some people feel a strange mix of anger and sadness after discovering cheating, almost like they''re grieving the relationship they thought they had. That grief is real, even if you decide to stay or leave.', ARRAY['cheating', 'grief', 'loss'], ARRAY['sad', 'hurt'], 2, 50, true),

-- CHEATING - Exploration blocks (6)
('exploration', 'When you think about what happened, what feels hardest to process right now? The betrayal itself, the lies, or something else?', ARRAY['cheating', 'betrayal', 'feelings'], ARRAY['hurt', 'confused'], 1, 50, true),
('exploration', 'What do you think you need most right now? Space to process, answers, time to decide, something else?', ARRAY['cheating', 'needs', 'decision'], ARRAY['confused', 'hurt'], 2, 50, true),
('exploration', 'How has this experience changed the way you see yourself or what you want in relationships?', ARRAY['cheating', 'self', 'growth', 'future'], ARRAY['reflective', 'hurt'], 2, 50, true),
('exploration', 'When you imagine moving forward from this, what comes up for you? Fear, hope, uncertainty, something else?', ARRAY['cheating', 'future', 'healing'], ARRAY['worried', 'hopeful'], 2, 50, true),
('exploration', 'What boundaries or needs do you think you want to honor going forward, whether in this relationship or future ones?', ARRAY['cheating', 'boundaries', 'needs', 'self'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'If you could say one thing to yourself about this experience, what would you want to remember?', ARRAY['cheating', 'self', 'wisdom', 'healing'], ARRAY['compassionate', 'reflective'], 2, 50, true),

-- CHEATING - Reframe blocks (3)
('reframe', 'Cheating often reveals deeper issues in a relationship that were already present—communication problems, unmet needs, emotional distance. While this doesn''t excuse the cheating, it can help you see that the betrayal was a symptom of something larger, not just a random act. Understanding this doesn''t minimize your pain, but it can help you see what needs to be addressed if you choose to work through this together.', ARRAY['cheating', 'patterns', 'understanding', 'communication'], ARRAY['reflective', 'hurt'], 2, 50, true),
('reframe', 'After being cheated on, many people struggle with feeling like they weren''t enough, but the truth is that cheating is almost always about the person who cheated, not the person who was betrayed. Their choices reflect their own struggles, values, and capacity for honesty, not your worth or desirability. You didn''t cause this, and you couldn''t have prevented it by being different.', ARRAY['cheating', 'self_worth', 'blame', 'understanding'], ARRAY['hurt', 'reflective'], 2, 50, true),
('reframe', 'Trust after cheating is something that has to be rebuilt, not just expected. If you choose to stay, it will require consistent actions from your partner over time, not just apologies or promises. And if you choose to leave, it''s important to remember that this one person''s betrayal doesn''t define your ability to trust or be trusted in future relationships. Healing takes time, but it is possible.', ARRAY['cheating', 'trust', 'healing', 'future'], ARRAY['hopeful', 'reflective'], 2, 50, true),

-- ============================================================================
-- DIVORCE (Current: 9, Need: 21 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 3 reframe (s2)
-- ============================================================================

-- DIVORCE - Reflection blocks (6)
('reflection', 'It sounds like going through a divorce is bringing up a lot of different emotions, and that complexity makes sense when you''re ending something that was such a big part of your life.', ARRAY['divorce', 'ending', 'grief'], ARRAY['sad', 'confused'], 1, 50, true),
('reflection', 'Divorce can make you question not just the marriage, but your own judgment and whether you can trust yourself to make good decisions going forward.', ARRAY['divorce', 'self_doubt', 'trust'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'It sounds like part of you is grieving the future you imagined together, even if you know the divorce is the right choice, and that loss is real.', ARRAY['divorce', 'grief', 'future', 'loss'], ARRAY['sad', 'reflective'], 2, 50, true),
('reflection', 'The practical side of divorce—dividing assets, figuring out living arrangements, telling people—can sometimes feel overwhelming on top of the emotional weight.', ARRAY['divorce', 'overwhelm', 'practical'], ARRAY['overwhelmed', 'stressed'], 2, 50, true),
('reflection', 'It sounds like you''re navigating a lot of mixed feelings about the divorce, maybe relief mixed with sadness, and that''s completely normal.', ARRAY['divorce', 'mixed_emotions', 'grief'], ARRAY['confused', 'sad'], 2, 50, true),
('reflection', 'Divorce often brings up questions about your identity and who you are outside of being someone''s spouse, and that can feel disorienting.', ARRAY['divorce', 'identity', 'self'], ARRAY['confused', 'lost'], 2, 50, true),

-- DIVORCE - Normalization blocks (6)
('normalization', 'Divorce is one of the most stressful life transitions, and it''s normal to feel overwhelmed by both the emotional and practical aspects of ending a marriage.', ARRAY['divorce', 'stress', 'transition'], ARRAY['overwhelmed', 'stressed'], 1, 50, true),
('normalization', 'Many people going through divorce experience a kind of identity shift, especially if they were married for a long time. You built a life and sense of self around being part of a couple, and that''s changing now.', ARRAY['divorce', 'identity', 'change'], ARRAY['confused', 'lost'], 2, 50, true),
('normalization', 'It''s common to feel a mix of emotions during divorce—relief that the conflict is ending, sadness about what you''re losing, fear about the future, and sometimes even guilt about the decision. All of those feelings are valid.', ARRAY['divorce', 'mixed_emotions', 'grief'], ARRAY['confused', 'sad'], 2, 50, true),
('normalization', 'After a divorce, many people find themselves questioning their judgment and wondering if they''ll ever be able to trust themselves in relationships again. That self-doubt is understandable, even though it doesn''t mean you made the wrong choice.', ARRAY['divorce', 'self_doubt', 'trust'], ARRAY['worried', 'confused'], 2, 50, true),
('normalization', 'Divorce often involves grieving not just the relationship, but the future you imagined together—the plans, the dreams, the life you thought you''d build. That grief is real, even if you know the divorce is necessary.', ARRAY['divorce', 'grief', 'future', 'loss'], ARRAY['sad', 'reflective'], 2, 50, true),
('normalization', 'It''s normal to feel like you''re starting over after a divorce, especially if you were married for a long time. That can feel both freeing and terrifying at the same time.', ARRAY['divorce', 'new_beginning', 'fear', 'hope'], ARRAY['hopeful', 'worried'], 2, 50, true),

-- DIVORCE - Exploration blocks (6)
('exploration', 'What part of the divorce process feels hardest for you right now? The emotional side, the practical logistics, or something else?', ARRAY['divorce', 'process', 'feelings'], ARRAY['overwhelmed', 'confused'], 1, 50, true),
('exploration', 'When you think about your life after the divorce is final, what comes up for you? Excitement, fear, uncertainty, something else?', ARRAY['divorce', 'future', 'feelings'], ARRAY['worried', 'hopeful'], 2, 50, true),
('exploration', 'What do you think you''ve learned about yourself through this marriage and divorce that you want to carry forward?', ARRAY['divorce', 'growth', 'self', 'wisdom'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'How has going through this divorce changed what you want or need in future relationships, if at all?', ARRAY['divorce', 'future', 'needs', 'growth'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What support do you think you need most right now as you navigate this transition?', ARRAY['divorce', 'needs', 'support', 'self_care'], ARRAY['overwhelmed', 'tired'], 2, 50, true),
('exploration', 'If you could give advice to someone else going through a divorce, what would you want them to know?', ARRAY['divorce', 'wisdom', 'healing', 'compassion'], ARRAY['compassionate', 'reflective'], 2, 50, true),

-- DIVORCE - Reframe blocks (3)
('reframe', 'Divorce is often seen as a failure, but it can also be seen as a recognition that two people have grown in ways that no longer align, or that the relationship has run its course. Ending a marriage that isn''t working takes courage, and choosing to prioritize your well-being and authenticity over staying in something that''s not right for you is actually a sign of strength, not weakness.', ARRAY['divorce', 'strength', 'growth', 'authenticity'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('reframe', 'After a divorce, many people find themselves rediscovering parts of themselves they''d set aside during the marriage. The process of becoming an individual again, rather than half of a couple, can be disorienting at first, but it can also be an opportunity to reconnect with who you are and what you want, independent of another person''s needs or expectations.', ARRAY['divorce', 'identity', 'self', 'growth'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Divorce often brings up a lot of "what if" questions and self-blame, but the truth is that most marriages end because of incompatibility or fundamental differences that couldn''t be resolved, not because one person failed. Both people can be good individuals and still not be right for each other. Holding that complexity can help you move forward without carrying unnecessary guilt or regret.', ARRAY['divorce', 'blame', 'understanding', 'healing'], ARRAY['reflective', 'compassionate'], 2, 50, true);

-- ============================================================================
-- Note: This is Part 2 of the expansion. Remaining topics will be in Part 3.
-- ============================================================================
