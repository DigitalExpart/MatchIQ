-- Migration: Add blocks for breakup_grief and breakup_intimacy_loss topics
-- These blocks handle grief after breakups and missing physical intimacy/connection with an ex
-- All blocks are non-explicit, ethical, and relationship-focused

-- ============================================
-- BREAKUP GRIEF BLOCKS (10-15 blocks)
-- ============================================

-- Reflection blocks for breakup grief
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Stage 1-2 Reflection
('reflection', 'It sounds like this breakup has left you feeling a deep sense of loss, and that grief is real and valid.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt', 'lonely'], 1, 90, true),
('reflection', 'I hear that you''re carrying a lot of pain right now, and the weight of this ending feels heavy.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt', 'overwhelmed'], 1, 90, true),
('reflection', 'It sounds like you''re grieving not just the person, but the future you imagined together, and that''s a profound kind of loss.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt', 'lonely'], 2, 90, true),
('reflection', 'I can hear how much this relationship meant to you, and how disorienting it feels to have it end.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'confused', 'hurt'], 1, 90, true),

-- Stage 1-2 Normalization
('normalization', 'Grief after a breakup isn''t linear—some days feel okay, others feel impossible, and that''s completely normal.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt'], 1, 90, true),
('normalization', 'It''s natural to wonder if you''ll ever feel okay again. Healing takes time, and there''s no "should" about how fast that happens.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hopeless'], 1, 90, true),
('normalization', 'Missing someone after a breakup, even when you know it''s over, is very common. Your feelings don''t have to make logical sense right now.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'lonely'], 2, 90, true),
('normalization', 'Sometimes the hardest part isn''t the end itself, but learning who you are without them, and that process takes time.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'confused'], 2, 90, true),

-- Stage 2 Insight
('insight', 'Grief often comes in waves—moments where you feel okay, followed by moments where the loss hits you all over again. This isn''t a sign that you''re not healing; it''s how grief works.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt'], 2, 90, true),
('insight', 'When a relationship ends, you''re not just losing the person—you''re losing the routines, the inside jokes, the way you saw yourself through their eyes. That''s a lot to process.', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'lonely'], 2, 90, true),

-- Stage 1-2 Exploration
('exploration', 'What part of this loss feels hardest to sit with right now?', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt'], 1, 90, true),
('exploration', 'When you think about moving forward, what comes up for you?', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'confused'], 1, 90, true),
('exploration', 'What do you find yourself missing most—the person, or the feeling of being with them?', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'lonely'], 2, 90, true),
('exploration', 'Looking back, what needs of yours weren''t being met in that relationship?', ARRAY['breakup_grief', 'heartbreak', 'breakup'], ARRAY['sad', 'hurt'], 2, 90, true);

-- ============================================
-- BREAKUP INTIMACY LOSS BLOCKS (10-15 blocks)
-- ============================================

-- Reflection blocks for missing intimacy with ex
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- Stage 1-2 Reflection
('reflection', 'It sounds like you''re missing the physical closeness and connection you had with your ex, and that''s a real part of what you''re grieving.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely', 'hurt'], 1, 95, true),
('reflection', 'I hear that you miss the way you and your ex connected physically, and that loss feels significant to you.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 1, 95, true),
('reflection', 'It sounds like the physical intimacy you shared was an important part of what made that relationship feel special, and missing that is natural.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt'], 2, 95, true),
('reflection', 'I can hear how much you miss the closeness and chemistry you had together, and that''s a real part of what you''re processing right now.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 1, 95, true),

-- Stage 1-2 Normalization
('normalization', 'Missing the physical connection you had with an ex is very common, especially when that was a meaningful part of your relationship.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 1, 95, true),
('normalization', 'It''s natural to grieve the loss of physical intimacy along with the emotional connection. Both were part of what made that relationship what it was.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt'], 1, 95, true),
('normalization', 'Physical intimacy often represents safety, closeness, and being seen in a particular way. Missing that doesn''t mean you''re just missing sex—it''s often about missing that sense of connection.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 2, 95, true),
('normalization', 'The way you connected physically with your ex was unique to that relationship, and it makes sense that you''d miss that specific kind of closeness.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt'], 2, 95, true),

-- Stage 2 Insight
('insight', 'Physical intimacy in a relationship often represents more than just physical connection—it can be about feeling desired, safe, understood, or fully yourself with someone. Missing that can feel like missing a whole dimension of how you related to each other.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 2, 95, true),
('insight', 'Sometimes what we miss most about physical intimacy with an ex isn''t just the act itself, but the way it made us feel—seen, wanted, connected, or at ease. That emotional layer is part of what you''re grieving.', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt'], 2, 95, true),

-- Stage 1-2 Exploration
('exploration', 'What was it about the physical connection you had that feels hardest to let go of?', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 1, 95, true),
('exploration', 'When you think about missing that intimacy, what comes up for you—is it more about the physical closeness, or what it represented in your relationship?', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt'], 1, 95, true),
('exploration', 'What did that physical connection give you that feels missing now?', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'lonely'], 2, 95, true),
('exploration', 'How does missing that intimacy connect to other parts of what you''re grieving about the relationship?', ARRAY['breakup_intimacy_loss', 'breakup_grief', 'heartbreak'], ARRAY['sad', 'hurt'], 2, 95, true);

-- Add comment
COMMENT ON TABLE amora_response_blocks IS 'Block-based response architecture. Includes breakup_grief and breakup_intimacy_loss topics for handling post-breakup grief and missing physical intimacy with an ex (non-explicit, relationship-focused).';
