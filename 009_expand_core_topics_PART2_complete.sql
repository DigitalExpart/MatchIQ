-- Migration 009 Part 2 Complete: Final Critical Topics
-- Adds blocks for: communication, situationship
-- Run this after PART2_final.sql

-- ============================================================================
-- COMMUNICATION (Current: 8, Need: 22 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 4 reframe (s2)
-- ============================================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- COMMUNICATION - Reflection blocks (6)
('reflection', 'It sounds like communication between you and your partner feels difficult or stuck right now, and that frustration is really hard to sit with.', ARRAY['communication', 'frustration', 'conflict'], ARRAY['frustrated', 'tired'], 1, 50, true),
('reflection', 'When conversations keep turning into arguments, it can make you want to avoid talking altogether, and that cycle is exhausting.', ARRAY['communication', 'conflict', 'avoidance'], ARRAY['tired', 'frustrated'], 2, 50, true),
('reflection', 'It sounds like you''re trying to express yourself but feeling like your partner isn''t really hearing you, and that disconnect is painful.', ARRAY['communication', 'not_heard', 'disconnect'], ARRAY['hurt', 'frustrated'], 2, 50, true),
('reflection', 'Communication problems often make you feel like you''re speaking different languages, even when you''re trying to say the same thing.', ARRAY['communication', 'misunderstanding', 'frustration'], ARRAY['frustrated', 'confused'], 2, 50, true),
('reflection', 'It sounds like part of you wants to communicate better but another part is afraid of how the conversation will go, and that fear can make it hard to start.', ARRAY['communication', 'fear', 'avoidance'], ARRAY['worried', 'frustrated'], 2, 50, true),
('reflection', 'When communication breaks down, it can make you question whether you and your partner are even compatible, and that doubt is really unsettling.', ARRAY['communication', 'compatibility', 'doubt'], ARRAY['worried', 'confused'], 2, 50, true),

-- COMMUNICATION - Normalization blocks (6)
('normalization', 'Communication problems are one of the most common issues in relationships, and struggling with it doesn''t mean your relationship is doomed. Most couples have to learn how to communicate effectively together.', ARRAY['communication', 'normal', 'common'], ARRAY['relieved', 'hopeful'], 1, 50, true),
('normalization', 'It''s common for conversations to turn into arguments when both people feel defensive or misunderstood. That cycle can feel impossible to break, but it''s not—it just requires both people to be willing to try a different approach.', ARRAY['communication', 'defensiveness', 'patterns'], ARRAY['frustrated', 'hopeful'], 2, 50, true),
('normalization', 'Many people find that they communicate differently than their partner—maybe one person needs to process out loud while the other needs quiet time to think. Those differences aren''t wrong, they just need to be understood and accommodated.', ARRAY['communication', 'differences', 'styles'], ARRAY['confused', 'relieved'], 2, 50, true),
('normalization', 'It''s normal to feel like you''re not being heard or understood, especially if you and your partner have different communication styles or if past conversations have gone badly. That feeling is valid, even if your partner is trying their best.', ARRAY['communication', 'not_heard', 'styles'], ARRAY['hurt', 'frustrated'], 2, 50, true),
('normalization', 'Some people avoid difficult conversations because they''re afraid of conflict or rejection, but avoiding communication often makes problems worse over time. Finding a way to talk that feels safe for both people is key.', ARRAY['communication', 'avoidance', 'fear'], ARRAY['worried', 'hopeful'], 2, 50, true),
('normalization', 'Communication problems often stem from both people feeling like they need to be right or win the argument, rather than understanding each other. Shifting from "winning" to "understanding" can change everything.', ARRAY['communication', 'patterns', 'understanding'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- COMMUNICATION - Exploration blocks (6)
('exploration', 'When you try to communicate with your partner, what usually happens? Do conversations turn into arguments, or do you avoid talking altogether?', ARRAY['communication', 'patterns', 'awareness'], ARRAY['reflective', 'frustrated'], 1, 50, true),
('exploration', 'What do you think you need from your partner in conversations? To be heard, to feel understood, to feel safe, something else?', ARRAY['communication', 'needs', 'feelings'], ARRAY['reflective', 'hurt'], 2, 50, true),
('exploration', 'How do you think your communication style differs from your partner''s, and how might that be causing misunderstandings?', ARRAY['communication', 'styles', 'differences'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'What would it look like to have a conversation where both of you felt heard and understood? What would need to be different?', ARRAY['communication', 'needs', 'vision'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What makes it hard for you to communicate? Fear of conflict, feeling defensive, something else?', ARRAY['communication', 'barriers', 'self_awareness'], ARRAY['reflective', 'honest'], 2, 50, true),
('exploration', 'If you could change one thing about how you and your partner communicate, what would it be?', ARRAY['communication', 'change', 'vision'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- COMMUNICATION - Reframe blocks (4)
('reframe', 'Good communication isn''t about never having conflicts or always agreeing—it''s about being able to talk through differences in a way that feels safe and respectful for both people. That means learning to listen to understand, not just to respond, and being willing to see your partner''s perspective even when you disagree. It also means taking responsibility for your own feelings and reactions, rather than blaming your partner for how you feel.', ARRAY['communication', 'understanding', 'respect', 'responsibility'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Communication problems often come from both people feeling defensive or trying to prove they''re right, rather than trying to understand each other. When conversations become about winning rather than connecting, everyone loses. Shifting to a mindset of curiosity and understanding can transform how you communicate, even when you disagree.', ARRAY['communication', 'defensiveness', 'understanding', 'connection'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Sometimes communication breaks down because both people have different styles or needs—maybe one person needs to process immediately while the other needs time to think, or one person expresses emotions directly while the other needs to process internally first. These differences aren''t wrong, they just need to be understood and accommodated. Learning each other''s communication style can help you find ways to connect that work for both of you.', ARRAY['communication', 'styles', 'differences', 'understanding'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'Effective communication also requires feeling safe enough to be vulnerable and honest. If conversations always turn into arguments or if you feel judged or dismissed, it''s natural to shut down or avoid talking. Creating safety in communication means both people committing to listen without defensiveness, to validate each other''s feelings even when you disagree, and to approach conversations as a team trying to understand each other, not as opponents trying to win.', ARRAY['communication', 'safety', 'vulnerability', 'teamwork'], ARRAY['hopeful', 'reflective'], 2, 50, true),

-- ============================================================================
-- SITUATIONSHIP (Current: 8, Need: 22 more to reach 30)
-- Distribution: 6 reflection (3s1, 3s2), 6 normalization (3s1, 3s2), 6 exploration (3s1, 3s2), 4 reframe (s2)
-- ============================================================================

-- SITUATIONSHIP - Reflection blocks (6)
('reflection', 'It sounds like you''re in a situationship where things feel unclear and undefined, and that ambiguity is really hard to sit with.', ARRAY['situationship', 'unclear', 'ambiguity'], ARRAY['confused', 'frustrated'], 1, 50, true),
('reflection', 'Being in a situationship can make you feel like you''re in limbo, not quite single but not really together either, and that in-between space is exhausting.', ARRAY['situationship', 'limbo', 'uncertainty'], ARRAY['confused', 'tired'], 2, 50, true),
('reflection', 'It sounds like part of you wants clarity about where things stand, but another part might be afraid of what that clarity might mean, and that conflict is really difficult.', ARRAY['situationship', 'clarity', 'fear'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'Situationships often make you question your own worth and whether you''re enough for someone to commit to, and those doubts can be really painful.', ARRAY['situationship', 'self_worth', 'doubt'], ARRAY['hurt', 'worried'], 2, 50, true),
('reflection', 'It sounds like you''re investing emotionally in something that doesn''t have clear boundaries or commitment, and that can feel both exciting and scary at the same time.', ARRAY['situationship', 'investment', 'boundaries'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'When you''re in a situationship, it can be hard to know what you''re allowed to want or ask for, and that uncertainty about your own needs is really challenging.', ARRAY['situationship', 'needs', 'uncertainty'], ARRAY['confused', 'frustrated'], 2, 50, true),

-- SITUATIONSHIP - Normalization blocks (6)
('normalization', 'Situationships are really common in modern dating, and being in one doesn''t mean you''re doing something wrong or that you''re not worthy of commitment. Many people find themselves in undefined relationships.', ARRAY['situationship', 'normal', 'common'], ARRAY['relieved', 'confused'], 1, 50, true),
('normalization', 'It''s normal to feel confused or frustrated in a situationship, especially if you want more clarity or commitment than the other person seems willing to give. Those feelings are valid, even if the other person isn''t doing anything "wrong."', ARRAY['situationship', 'needs', 'frustration'], ARRAY['frustrated', 'confused'], 2, 50, true),
('normalization', 'Many people stay in situationships because they''re afraid that asking for clarity will end things, but the uncertainty can be just as painful as a potential rejection. Both are hard, but at least clarity gives you information to make decisions.', ARRAY['situationship', 'fear', 'clarity'], ARRAY['worried', 'reflective'], 2, 50, true),
('normalization', 'It''s common to feel like you''re not allowed to want more from a situationship, or that asking for commitment means you''re being "too much." But wanting clarity and commitment isn''t too much—it''s a valid need, and you''re allowed to express it.', ARRAY['situationship', 'needs', 'self_worth'], ARRAY['hurt', 'determined'], 2, 50, true),
('normalization', 'Some people stay in situationships because they''re getting some of what they need—connection, intimacy, companionship—even if it''s not everything. That can make it hard to leave, even when you know it''s not enough.', ARRAY['situationship', 'needs', 'attachment'], ARRAY['confused', 'hurt'], 2, 50, true),
('normalization', 'Situationships often continue because both people are getting something from the ambiguity—maybe one person gets the benefits without commitment, and the other gets hope without having to face rejection. But that dynamic can be painful for the person who wants more.', ARRAY['situationship', 'dynamics', 'needs'], ARRAY['hurt', 'reflective'], 2, 50, true),

-- SITUATIONSHIP - Exploration blocks (6)
('exploration', 'What do you want from this situationship? Clarity, commitment, something else?', ARRAY['situationship', 'needs', 'clarity'], ARRAY['reflective', 'confused'], 1, 50, true),
('exploration', 'What makes it hard to ask for what you want? Fear of rejection, fear of ending things, or something else?', ARRAY['situationship', 'fear', 'needs'], ARRAY['worried', 'reflective'], 2, 50, true),
('exploration', 'How is this situationship meeting your needs, and how is it not?', ARRAY['situationship', 'needs', 'awareness'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'If you could have a conversation about where things stand, what would you want to say?', ARRAY['situationship', 'communication', 'needs'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'What would you need to feel good about continuing in this situationship, or what would help you decide to end it?', ARRAY['situationship', 'needs', 'decision'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'How has being in this situationship affected how you see yourself or what you want in relationships?', ARRAY['situationship', 'self', 'growth'], ARRAY['reflective', 'hopeful'], 2, 50, true),

-- SITUATIONSHIP - Reframe blocks (4)
('reframe', 'Situationships can work for some people who want connection without commitment, but they''re painful when one person wants more than the other is willing to give. If you''re in a situationship and it''s causing you pain, that''s information. You''re allowed to want clarity and commitment, and you''re allowed to express those needs. If the other person can''t meet them, that doesn''t mean you''re too much—it means you''re not compatible in what you want right now.', ARRAY['situationship', 'needs', 'self_worth', 'compatibility'], ARRAY['reflective', 'determined'], 2, 50, true),
('reframe', 'Staying in a situationship when you want more often comes from a fear of being alone or a fear of rejection, but the uncertainty and lack of clarity can be just as painful as those fears. At least with clarity, you have information to make decisions. Staying in ambiguity because you''re afraid of the answer often means staying in pain because you''re afraid of a different kind of pain.', ARRAY['situationship', 'fear', 'clarity', 'pain'], ARRAY['reflective', 'compassionate'], 2, 50, true),
('reframe', 'You deserve to be with someone who wants to be with you in the way you want to be with them. If you want commitment and clarity, you''re allowed to ask for that. If the other person can''t give it, that''s their choice, but it doesn''t mean you should settle for less than what you need. Your needs are valid, and you don''t have to apologize for wanting clarity or commitment in a relationship.', ARRAY['situationship', 'needs', 'self_worth', 'boundaries'], ARRAY['determined', 'reflective'], 2, 50, true),
('reframe', 'Sometimes situationships continue because both people are avoiding having a difficult conversation about what they want. But avoiding that conversation doesn''t make the uncertainty go away—it just prolongs it. Having the conversation, even if it leads to an ending, gives you clarity and the ability to move forward, whether that''s together with commitment or apart so you can find someone who wants what you want.', ARRAY['situationship', 'communication', 'clarity', 'growth'], ARRAY['hopeful', 'reflective'], 2, 50, true);

-- ============================================================================
-- Part 2 Complete! Total: ~170 blocks added for 8 critical topics
-- Next: Part 3 for remaining 8 topics (cheating_self, lust_vs_love, pretense, 
-- inauthenticity, marriage_strain, talking_stage, unclear, unlovable)
-- ============================================================================
