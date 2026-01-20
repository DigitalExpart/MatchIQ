-- Migration: Conversation Design Improvements
-- Rewritten blocks for better emotional attunement, session continuity, and specificity
-- Topics: unlovable, breakup_intimacy_loss, heartbreak_general, relationship_intimacy_concerns, partner_withdrawing
-- Includes linking blocks for session continuity

-- ============================================
-- UNLOVABLE BLOCKS (Rewritten)
-- ===========================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Reflection blocks
('reflection', 'It sounds like you''re carrying a really painful belief that you''re unlovable, and that''s a heavy feeling to sit with. It makes sense that this would hurt a lot.', ARRAY['unlovable'], ARRAY['hurt', 'lonely', 'sad'], 1, 95, true),
('reflection', 'Hearing you say you feel unlovable tells me you''ve been through a lot that made you question your own worth. That''s an incredibly lonely place to be.', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 1, 95, true),

-- Normalization blocks
('normalization', 'Many people who''ve been hurt, rejected, or overlooked start to believe they''re unlovable, even though that belief grew out of old pain, not who they truly are. You''re not strange or broken for feeling this way.', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 1, 95, true),
('normalization', 'Feeling unlovable often comes from repeated experiences where you didn''t feel chosen, seen, or cared for. Those experiences can shape how you see yourself, even if they weren''t a fair reflection of your worth.', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 2, 95, true),

-- Exploration blocks
('exploration', 'If you think back, when do you remember first starting to feel this way about yourself—like you weren''t worth loving?', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 1, 95, true),
('exploration', 'When that thought ''I''m unlovable'' shows up, what kinds of situations usually trigger it for you—being ignored, conflict, feeling left out, or something else?', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 2, 95, true),

-- Reframe blocks
('reframe', 'Sometimes the belief ''I''m unlovable'' is less about who you are and more about what you''ve been through—times when people didn''t or couldn''t show up for you. The belief can feel absolute, but it was shaped by experiences, not by some fixed truth about you.', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 2, 95, true),
('reframe', 'One way to look at this belief is as a kind of armor: if you decide you''re unlovable, you might feel slightly more prepared for disappointment. It makes sense as a protection strategy, even if it also hurts you.', ARRAY['unlovable'], ARRAY['hurt', 'lonely'], 2, 95, true);

-- ============================================
-- BREAKUP INTIMACY LOSS BLOCKS (Rewritten)
-- ===========================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Reflection blocks
('reflection', 'It sounds like the physical closeness you had with your ex was a really meaningful part of that relationship, and losing that has been painful for you.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt', 'lonely'], 1, 95, true),
('reflection', 'You''re missing the way you and your ex connected physically, and that loss feels significant. It''s not just about sex—it''s about the kind of closeness you shared.', ARRAY['breakup_intimacy_loss', 'breakup_grief'], ARRAY['sad', 'hurt'], 1, 95, true),

-- Normalization blocks
('normalization', 'Missing the physical connection you had with an ex is very common, especially when that intimacy made you feel wanted, safe, or deeply connected.', ARRAY['breakup_intimacy_loss', 'breakup_grief'], ARRAY['sad', 'lonely'], 1, 95, true),
('normalization', 'Grieving a breakup often includes grieving the loss of physical closeness, not just the emotional connection. Both were part of what made that relationship matter to you.', ARRAY['breakup_intimacy_loss', 'heartbreak'], ARRAY['sad', 'hurt'], 1, 95, true),

-- Exploration blocks
('exploration', 'When you think about the intimacy you had with your ex, what feels hardest to let go of—the physical closeness, how it made you feel about yourself, or something else?', ARRAY['breakup_intimacy_loss', 'breakup_grief'], ARRAY['sad', 'hurt'], 1, 95, true),
('exploration', 'If you put it into words, what did that physical connection give you that feels missing from your life right now?', ARRAY['breakup_intimacy_loss'], ARRAY['sad', 'lonely'], 2, 95, true),

-- Reframe blocks
('reframe', 'Sometimes what we miss most about physical intimacy with an ex isn''t the act itself, but the way it made us feel—wanted, close, or understood. Noticing that can help you see more clearly what you''re truly longing for.', ARRAY['breakup_intimacy_loss', 'breakup_grief'], ARRAY['sad', 'hurt'], 2, 95, true),
('reframe', 'The kind of chemistry and comfort you had with your ex was unique to that relationship. Missing it doesn''t mean you''ll never have intimacy again—it means you''re grieving something that mattered deeply to you.', ARRAY['breakup_intimacy_loss', 'heartbreak'], ARRAY['sad', 'hurt'], 2, 95, true);

-- ============================================
-- HEARTBREAK GENERAL BLOCKS (NEW - for heartbreak NOT about breakup)
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Reflection blocks
('reflection', 'It sounds like you''re carrying a deep sense of heartbreak right now, and that kind of pain can feel overwhelming and heavy.', ARRAY['heartbreak_general'], ARRAY['sad', 'hurt'], 1, 90, true),
('reflection', 'Hearing you say you''re heartbroken tells me something really important to you has been lost or shaken, and that hurt is very real.', ARRAY['heartbreak_general'], ARRAY['sad', 'hurt'], 1, 90, true),

-- Normalization blocks
('normalization', 'Heartbreak can come from many places—relationships, family, loss, disappointment—and it often feels like it touches every part of your life. It''s understandable that this feels so intense.', ARRAY['heartbreak_general'], ARRAY['sad', 'hurt'], 1, 90, true),

-- Exploration blocks
('exploration', 'When you say you''re heartbroken, what situation or loss comes to mind first?', ARRAY['heartbreak_general'], ARRAY['sad', 'hurt'], 1, 90, true);

-- ============================================
-- RELATIONSHIP INTIMACY CONCERNS BLOCKS (NEW - for current relationship)
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Reflection blocks
('reflection', 'It sounds like the physical side of your relationship used to feel really important to you, and you''re missing that closeness now.', ARRAY['relationship_intimacy_concerns'], ARRAY['sad', 'lonely'], 1, 95, true),
('reflection', 'You''re noticing a gap between how your sex life used to feel and how it feels now, and that change is hard to sit with.', ARRAY['relationship_intimacy_concerns'], ARRAY['sad', 'lonely'], 1, 95, true),

-- Normalization blocks
('normalization', 'It''s very common for the physical part of a relationship to change over time, and when that happens, it can leave you feeling lonely or disconnected, even if you''re still together.', ARRAY['relationship_intimacy_concerns'], ARRAY['sad', 'lonely'], 1, 95, true),

-- Exploration blocks
('exploration', 'When you think about missing your sex life, is it more about the physical connection itself, the emotional closeness you felt, or something else?', ARRAY['relationship_intimacy_concerns'], ARRAY['sad', 'lonely'], 1, 95, true);

-- ============================================
-- PARTNER WITHDRAWING BLOCKS (NEW - specific withdrawal behaviors)
-- ============================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Reflection blocks
('reflection', 'It sounds like your boyfriend used to be very attentive—calling and texting you first—and now he leaves your messages unread and doesn''t pick up your calls. That kind of change can feel really painful and confusing.', ARRAY['partner_withdrawing'], ARRAY['hurt', 'confused', 'lonely'], 1, 95, true),
('reflection', 'You''re noticing that the effort in your relationship has flipped—you''re reaching out and he''s pulling back, ignoring your messages for days. It makes sense that this would leave you feeling hurt and unsure of where you stand.', ARRAY['partner_withdrawing'], ARRAY['hurt', 'confused'], 1, 95, true),

-- Normalization blocks
('normalization', 'When someone who used to be very present suddenly becomes distant, many people start questioning themselves or the whole relationship. It''s understandable if this is making you feel anxious or on edge.', ARRAY['partner_withdrawing'], ARRAY['hurt', 'confused'], 1, 95, true),

-- Exploration blocks
('exploration', 'When he doesn''t respond for days, what thoughts or fears show up for you about yourself or the relationship?', ARRAY['partner_withdrawing'], ARRAY['hurt', 'confused'], 1, 95, true),
('exploration', 'Have you been able to share with him how this change in contact is affecting you? If so, how did he respond?', ARRAY['partner_withdrawing'], ARRAY['hurt', 'confused'], 2, 95, true);

-- ============================================
-- LINKING BLOCKS (Session Continuity)
-- ============================================

-- Scenario A: unlovable + partner_withdrawing
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'Earlier you shared that you feel unlovable, and now you''re describing your boyfriend pulling away—leaving your messages unread and not calling like he used to. It makes sense that his distance could really feed into that belief that you don''t matter or aren''t worth showing up for.', ARRAY['unlovable', 'partner_withdrawing'], ARRAY['hurt', 'lonely'], 2, 98, true),
('exploration', 'When he goes quiet like this, how does it connect to that feeling of being unlovable—what story do you find yourself telling about yourself in those moments?', ARRAY['unlovable', 'partner_withdrawing'], ARRAY['hurt', 'lonely'], 2, 98, true);

-- Scenario B: breakup_grief + breakup_intimacy_loss
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'You''ve been grieving the end of this relationship, and now you''re also noticing how much you miss the physical closeness you had with your ex. Both the emotional and physical sides of that connection meant a lot to you.', ARRAY['breakup_grief', 'breakup_intimacy_loss'], ARRAY['sad', 'hurt'], 2, 98, true),
('exploration', 'If you look at both the emotional loss and the physical intimacy you''re missing, which part feels most intense for you right now?', ARRAY['breakup_grief', 'breakup_intimacy_loss'], ARRAY['sad', 'hurt'], 2, 98, true);
