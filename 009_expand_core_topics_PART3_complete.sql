-- Migration 009 Part 3 Complete: Final 2 Topics
-- Adds blocks for: unclear, unlovable
-- Continues from 009_expand_core_topics_PART3_final.sql

-- ============================================================================
-- UNCLEAR (Current: 4, Need: 26 more to reach 30)
-- Distribution: 7 reflection (4s1, 3s2), 7 normalization (4s1, 3s2), 8 exploration (4s1, 4s2), 4 reframe (s2)
-- ============================================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- UNCLEAR - Reflection blocks (7)
('reflection', 'It sounds like things feel really unclear in your relationship right now, and that ambiguity is making it hard to know what to do or how to feel.', ARRAY['unclear', 'ambiguity', 'confusion'], ARRAY['confused', 'frustrated'], 1, 50, true),
('reflection', 'When things are unclear, it can make you question everything—where you stand, what the other person wants, what you should do—and that uncertainty is really exhausting.', ARRAY['unclear', 'uncertainty', 'exhaustion'], ARRAY['confused', 'tired'], 2, 50, true),
('reflection', 'It sounds like part of you wants clarity but another part is afraid of what that clarity might reveal, and that conflict is really difficult.', ARRAY['unclear', 'clarity', 'fear'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'Being in an unclear situation can make you feel like you''re not allowed to want more or ask for clarity, and that confusion about your own needs is really challenging.', ARRAY['unclear', 'needs', 'confusion'], ARRAY['confused', 'frustrated'], 2, 50, true),
('reflection', 'It sounds like the lack of clarity is making you question your own judgment and whether you can trust what you''re experiencing, and that self-doubt adds another layer of difficulty.', ARRAY['unclear', 'self_doubt', 'trust'], ARRAY['confused', 'worried'], 2, 50, true),
('reflection', 'When things are unclear, it can feel like you''re in limbo, not knowing if you should invest more or move on, and that in-between space is really uncomfortable.', ARRAY['unclear', 'limbo', 'uncertainty'], ARRAY['confused', 'frustrated'], 2, 50, true),
('reflection', 'It sounds like the uncertainty is affecting how you see yourself and what you''re worth, and that impact is really significant.', ARRAY['unclear', 'self_worth', 'uncertainty'], ARRAY['hurt', 'confused'], 2, 50, true),

-- UNCLEAR - Normalization blocks (7)
('normalization', 'Unclear relationships are really common in modern dating, and being in one doesn''t mean you''re doing something wrong. Many people find themselves in undefined situations.', ARRAY['unclear', 'normal', 'common'], ARRAY['relieved', 'confused'], 1, 50, true),
('normalization', 'It''s normal to feel confused or frustrated when things are unclear, especially if you want more clarity or commitment than the other person seems willing to give. Those feelings are valid.', ARRAY['unclear', 'needs', 'frustration'], ARRAY['frustrated', 'confused'], 2, 50, true),
('normalization', 'Many people stay in unclear situations because they''re afraid that asking for clarity will end things, but the uncertainty can be just as painful as a potential rejection. Both are hard, but at least clarity gives you information.', ARRAY['unclear', 'fear', 'clarity'], ARRAY['worried', 'reflective'], 2, 50, true),
('normalization', 'It''s common to feel like you''re not allowed to want more from an unclear situation, or that asking for clarity means you''re being "too much." But wanting clarity and commitment isn''t too much—it''s a valid need.', ARRAY['unclear', 'needs', 'self_worth'], ARRAY['hurt', 'determined'], 2, 50, true),
('normalization', 'Some people stay in unclear situations because they''re getting some of what they need—connection, attention, hope—even if it''s not everything. That can make it hard to leave, even when you know it''s not enough.', ARRAY['unclear', 'needs', 'attachment'], ARRAY['confused', 'hurt'], 2, 50, true),
('normalization', 'Unclear situations often continue because both people are getting something from the ambiguity. But that dynamic can be painful for the person who wants more clarity or commitment.', ARRAY['unclear', 'dynamics', 'needs'], ARRAY['hurt', 'reflective'], 2, 50, true),
('normalization', 'It''s normal to question your own judgment when things are unclear, and to wonder if you''re reading too much into things or not enough. That questioning is understandable, but it can also make the uncertainty feel even more overwhelming.', ARRAY['unclear', 'self_doubt', 'judgment'], ARRAY['confused', 'worried'], 2, 50, true),

-- UNCLEAR - Exploration blocks (8)
('exploration', 'What do you want from this unclear situation? Clarity, commitment, to see where it goes, or something else?', ARRAY['unclear', 'needs', 'clarity'], ARRAY['reflective', 'confused'], 1, 50, true),
('exploration', 'What makes it hard to ask for clarity? Fear of rejection, fear of ending things, or something else?', ARRAY['unclear', 'fear', 'needs'], ARRAY['worried', 'reflective'], 2, 50, true),
('exploration', 'How is this unclear situation meeting your needs, and how is it not?', ARRAY['unclear', 'needs', 'awareness'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'If you could have a conversation about where things stand, what would you want to say?', ARRAY['unclear', 'communication', 'needs'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'What would you need to feel good about continuing, or what would help you decide to move on?', ARRAY['unclear', 'needs', 'decision'], ARRAY['reflective', 'confused'], 2, 50, true),
('exploration', 'How has being in this unclear situation affected how you see yourself or what you want in relationships?', ARRAY['unclear', 'self', 'growth'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'What boundaries do you want to set for yourself while things are unclear?', ARRAY['unclear', 'boundaries', 'self'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'If you could give yourself advice about this unclear situation, what would you want to remember?', ARRAY['unclear', 'wisdom', 'self'], ARRAY['compassionate', 'reflective'], 2, 50, true),

-- UNCLEAR - Reframe blocks (4)
('reframe', 'Unclear situations can work for some people who want connection without commitment, but they''re painful when one person wants more than the other is willing to give. If you''re in an unclear situation and it''s causing you pain, that''s information. You''re allowed to want clarity and commitment, and you''re allowed to express those needs. If the other person can''t meet them, that doesn''t mean you''re too much—it means you''re not compatible in what you want right now.', ARRAY['unclear', 'needs', 'self_worth', 'compatibility'], ARRAY['reflective', 'determined'], 2, 50, true),
('reframe', 'Staying in an unclear situation when you want more often comes from a fear of being alone or a fear of rejection, but the uncertainty and lack of clarity can be just as painful as those fears. At least with clarity, you have information to make decisions. Staying in ambiguity because you''re afraid of the answer often means staying in pain because you''re afraid of a different kind of pain.', ARRAY['unclear', 'fear', 'clarity', 'pain'], ARRAY['reflective', 'compassionate'], 2, 50, true),
('reframe', 'You deserve to be with someone who wants to be with you in the way you want to be with them. If you want commitment and clarity, you''re allowed to ask for that. If the other person can''t give it, that''s their choice, but it doesn''t mean you should settle for less than what you need. Your needs are valid, and you don''t have to apologize for wanting clarity or commitment.', ARRAY['unclear', 'needs', 'self_worth', 'boundaries'], ARRAY['determined', 'reflective'], 2, 50, true),
('reframe', 'Sometimes unclear situations continue because both people are avoiding having a difficult conversation about what they want. But avoiding that conversation doesn''t make the uncertainty go away—it just prolongs it. Having the conversation, even if it leads to an ending, gives you clarity and the ability to move forward, whether that''s together with commitment or apart so you can find someone who wants what you want.', ARRAY['unclear', 'communication', 'clarity', 'growth'], ARRAY['hopeful', 'reflective'], 2, 50, true),

-- ============================================================================
-- UNLOVABLE (Current: 4, Need: 26 more to reach 30)
-- Distribution: 7 reflection (4s1, 3s2), 7 normalization (4s1, 3s2), 8 exploration (4s1, 4s2), 4 reframe (s2)
-- ============================================================================

-- UNLOVABLE - Reflection blocks (7)
('reflection', 'It sounds like you''re struggling with feeling unlovable, and that pain is really deep and hard to sit with.', ARRAY['unlovable', 'self_worth', 'pain'], ARRAY['sad', 'hurt'], 1, 50, true),
('reflection', 'When you feel unlovable, it can make you question whether you''re worthy of love or connection, and those doubts can feel really real even when you know they might not be true.', ARRAY['unlovable', 'worthiness', 'doubt'], ARRAY['hurt', 'sad'], 2, 50, true),
('reflection', 'It sounds like part of you believes you''re not lovable, and that belief is affecting how you see yourself and your relationships, and that impact is really significant.', ARRAY['unlovable', 'beliefs', 'self'], ARRAY['sad', 'hurt'], 2, 50, true),
('reflection', 'Feeling unlovable often makes you question whether anyone could ever truly love you, and that fear can make it hard to let people in or to trust when they show care.', ARRAY['unlovable', 'fear', 'trust'], ARRAY['worried', 'hurt'], 2, 50, true),
('reflection', 'It sounds like the feeling of being unlovable comes from somewhere deep, maybe from past experiences or messages you''ve received, and that root is really painful.', ARRAY['unlovable', 'past', 'wounds'], ARRAY['hurt', 'sad'], 2, 50, true),
('reflection', 'When you feel unlovable, it can make you push people away or sabotage relationships, almost like you''re trying to prove the belief that you''re not lovable, and that cycle is really difficult.', ARRAY['unlovable', 'patterns', 'sabotage'], ARRAY['hurt', 'confused'], 2, 50, true),
('reflection', 'It sounds like you want to believe you''re lovable, but something inside is telling you you''re not, and that conflict is really painful.', ARRAY['unlovable', 'conflict', 'beliefs'], ARRAY['hurt', 'confused'], 2, 50, true),

-- UNLOVABLE - Normalization blocks (7)
('normalization', 'Feeling unlovable is a really painful experience, and it often comes from past experiences of rejection, abandonment, or not feeling seen or valued. Those feelings are valid, even though they''re not true.', ARRAY['unlovable', 'past', 'validation'], ARRAY['hurt', 'relieved'], 1, 50, true),
('normalization', 'Many people struggle with feeling unlovable, especially if they''ve experienced trauma, rejection, or relationships where they didn''t feel valued. That struggle is common, even though it''s painful.', ARRAY['unlovable', 'normal', 'common'], ARRAY['relieved', 'hurt'], 2, 50, true),
('normalization', 'The feeling of being unlovable often comes from internalized messages from past experiences, not from objective truth. You are inherently worthy of love, even when it doesn''t feel that way.', ARRAY['unlovable', 'worthiness', 'truth'], ARRAY['hopeful', 'hurt'], 2, 50, true),
('normalization', 'It''s common for people who feel unlovable to push others away or sabotage relationships, almost like they''re trying to prove the belief that they''re not lovable. That pattern is painful, but it''s also understandable—it''s a way of protecting yourself from potential rejection.', ARRAY['unlovable', 'patterns', 'protection'], ARRAY['hurt', 'compassionate'], 2, 50, true),
('normalization', 'Feeling unlovable can make it hard to accept love or care when it''s offered, because it doesn''t match your internal belief about yourself. That disconnect can be really painful, but it''s also something that can be worked through.', ARRAY['unlovable', 'acceptance', 'beliefs'], ARRAY['hurt', 'hopeful'], 2, 50, true),
('normalization', 'The belief that you''re unlovable is often a protective mechanism—if you believe you''re unlovable, you can''t be hurt by rejection because you expect it. But that protection comes at a cost, because it also prevents you from experiencing love and connection.', ARRAY['unlovable', 'protection', 'beliefs'], ARRAY['hurt', 'reflective'], 2, 50, true),
('normalization', 'Working through feeling unlovable often involves challenging those internal beliefs and learning to see yourself with compassion. It''s a process, and it takes time, but it''s possible to heal those wounds and learn to accept love.', ARRAY['unlovable', 'healing', 'compassion', 'self'], ARRAY['hopeful', 'compassionate'], 2, 50, true),

-- UNLOVABLE - Exploration blocks (8)
('exploration', 'When did you first start feeling unlovable? What experiences or messages contributed to that feeling?', ARRAY['unlovable', 'past', 'awareness'], ARRAY['reflective', 'hurt'], 1, 50, true),
('exploration', 'What would it feel like to believe you are lovable? What would be different?', ARRAY['unlovable', 'beliefs', 'vision'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'How has feeling unlovable affected your relationships or your ability to let people in?', ARRAY['unlovable', 'relationships', 'patterns'], ARRAY['reflective', 'hurt'], 2, 50, true),
('exploration', 'What would help you start to challenge the belief that you''re unlovable?', ARRAY['unlovable', 'healing', 'needs'], ARRAY['reflective', 'hopeful'], 2, 50, true),
('exploration', 'When people show you care or love, what happens? Do you accept it, push it away, or question it?', ARRAY['unlovable', 'acceptance', 'patterns'], ARRAY['reflective', 'hurt'], 2, 50, true),
('exploration', 'What would it look like to treat yourself with the same compassion you might show a friend who felt unlovable?', ARRAY['unlovable', 'self_compassion', 'healing'], ARRAY['compassionate', 'reflective'], 2, 50, true),
('exploration', 'How do you want to respond to the feeling of being unlovable? What would feel healthy versus what feels like it''s coming from that belief?', ARRAY['unlovable', 'response', 'healthy'], ARRAY['reflective', 'determined'], 2, 50, true),
('exploration', 'If you could give yourself one message about being lovable, what would you want to hear?', ARRAY['unlovable', 'compassion', 'self'], ARRAY['compassionate', 'reflective'], 2, 50, true),

-- UNLOVABLE - Reframe blocks (4)
('reframe', 'The feeling of being unlovable is often a belief, not a fact. It usually comes from past experiences of rejection, abandonment, or not feeling valued, and those experiences can make you internalize the message that you''re not worthy of love. But that message isn''t true—you are inherently worthy of love, regardless of what anyone else has done or said. Your worth isn''t determined by other people''s choices or by past experiences. It''s inherent, and it doesn''t go away just because someone couldn''t see it or because you''ve been hurt.', ARRAY['unlovable', 'worthiness', 'truth', 'healing'], ARRAY['hopeful', 'compassionate'], 2, 50, true),
('reframe', 'Feeling unlovable often leads to patterns of pushing people away or sabotaging relationships, almost like you''re trying to prove the belief that you''re not lovable. But that pattern is a self-fulfilling prophecy—if you push people away, they''ll leave, which reinforces the belief. Breaking that cycle means learning to accept love and care when it''s offered, even when it feels uncomfortable or when your internal voice is telling you you don''t deserve it. It means challenging that voice and choosing to believe you''re worthy of love.', ARRAY['unlovable', 'patterns', 'acceptance', 'healing'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'The belief that you''re unlovable is often a protective mechanism—if you believe you''re unlovable, you can''t be hurt by rejection because you expect it. But that protection comes at a cost, because it also prevents you from experiencing love and connection. Learning to let go of that belief means being willing to risk being hurt, but it also means being open to the possibility of being loved. That''s scary, but it''s also what allows for real connection and intimacy.', ARRAY['unlovable', 'protection', 'vulnerability', 'connection'], ARRAY['hopeful', 'reflective'], 2, 50, true),
('reframe', 'You are worthy of love, exactly as you are. That worthiness doesn''t depend on what you do, how you look, what you achieve, or whether anyone else sees it. It''s inherent, and it doesn''t go away. Working through feeling unlovable often involves learning to see yourself with the same compassion you might show a friend, challenging the internal messages that tell you you''re not enough, and gradually learning to accept love and care when it''s offered. It''s a process, and it takes time, but it''s possible to heal those wounds and learn that you are, in fact, lovable.', ARRAY['unlovable', 'worthiness', 'healing', 'self_compassion'], ARRAY['compassionate', 'hopeful'], 2, 50, true);

-- ============================================================================
-- PART 3 COMPLETE! 
-- Total: ~200 blocks added for 8 remaining topics
-- 
-- GRAND TOTAL ACROSS ALL PARTS:
-- Part 1: 34 blocks (heartbreak, breakup) ✅
-- Part 2: ~170 blocks (8 critical topics) ✅
-- Part 3: ~200 blocks (8 remaining topics) ✅
-- TOTAL: ~404 blocks for 18 core topics
-- ============================================================================
