-- =====================================================
-- AMORA BLOCKS EXPANSION - FIXED
-- Adds 150 new blocks across 10 additional topics
-- FIX: Uses gen_random_uuid() for id column
-- =====================================================

-- =====================================================
-- 1. MISMATCHED EXPECTATIONS (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like you and your partner are picturing very different futures, and sitting in the middle of that can feel really unsettling.', ARRAY['mismatched_expectations', 'marriage', 'future_plans'], ARRAY['worried', 'confused'], 1, 50, true),
('reflection', 'You seem caught between what you want long term and what your partner is ready or willing to offer right now, and that tension feels heavy.', ARRAY['mismatched_expectations', 'kids', 'commitment'], ARRAY['worried', 'sad'], 1, 50, true),
('reflection', 'It sounds like your timelines and expectations around commitment aren''t lining up, and that leaves you feeling worried and unsure.', ARRAY['mismatched_expectations', 'timeline'], ARRAY['anxious', 'confused'], 1, 50, true),
('reflection', 'Part of you seems to really care about this relationship, and another part is wondering if your core hopes for the future can be met here.', ARRAY['mismatched_expectations'], ARRAY['conflicted', 'sad'], 2, 50, true),
('reflection', 'It sounds like you feel pulled between staying with someone you love and honoring the life you imagined for yourself.', ARRAY['mismatched_expectations'], ARRAY['torn', 'sad'], 2, 50, true),

('normalization', 'Many couples reach a point where questions about marriage, living together, or long‑term plans bring hidden differences to the surface.', ARRAY['mismatched_expectations', 'marriage'], ARRAY['worried'], 1, 50, true),
('normalization', 'It is common for people to have different feelings about kids or the pace of commitment, even when they care deeply about each other.', ARRAY['mismatched_expectations', 'kids'], ARRAY['confused'], 1, 50, true),
('normalization', 'Realizing that your long‑term goals might not fully match can be a frightening moment, but it often shows how seriously you are taking your own needs.', ARRAY['mismatched_expectations'], ARRAY['scared', 'worried'], 1, 50, true),
('normalization', 'Feeling conflicted here does not mean you are asking for too much; it can simply mean your deeper hopes are asking to be listened to.', ARRAY['mismatched_expectations'], ARRAY['conflicted'], 2, 50, true),
('normalization', 'These crossroads are painful, but they can also reveal what really matters to you in love, partnership, and family.', ARRAY['mismatched_expectations'], ARRAY['sad'], 2, 50, true),

('exploration', 'When you think about your future, what feels absolutely essential for you, and what feels more flexible or negotiable?', ARRAY['mismatched_expectations'], ARRAY['confused'], 1, 50, true),
('exploration', 'If you imagine your ideal relationship 5–10 years from now, what do you see, and in what ways does it feel different from what you are living now?', ARRAY['mismatched_expectations', 'marriage'], ARRAY['worried'], 1, 50, true),
('exploration', 'What do you notice happens inside you when your partner shares their view of the future — do you feel hopeful, anxious, resigned, something else?', ARRAY['mismatched_expectations'], ARRAY['anxious'], 2, 50, true),
('exploration', 'If you gave yourself permission to be completely honest with yourself for a moment, what truth about your long‑term hopes feels hardest to admit?', ARRAY['mismatched_expectations'], ARRAY['conflicted'], 2, 50, true),
('exploration', 'Looking back, have there been earlier moments in this relationship when you sensed these differences, and how did you respond then?', ARRAY['mismatched_expectations'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- 2. FEELING UNAPPRECIATED (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like you give a lot in this relationship, but you rarely feel truly seen or appreciated for everything you are doing.', ARRAY['feeling_unappreciated'], ARRAY['tired', 'sad'], 1, 50, true),
('reflection', 'You seem tired of feeling like your efforts are taken for granted, and that is beginning to weigh on your heart.', ARRAY['feeling_unappreciated'], ARRAY['exhausted', 'hurt'], 1, 50, true),
('reflection', 'It sounds painful to feel like you show up for your partner, but they do not really notice or reciprocate in the way you hope.', ARRAY['feeling_unappreciated'], ARRAY['hurt', 'lonely'], 1, 50, true),
('reflection', 'Part of you seems deeply caring and generous, and another part is starting to feel empty from giving so much without feeling valued in return.', ARRAY['feeling_unappreciated'], ARRAY['empty', 'sad'], 2, 50, true),
('reflection', 'It sounds like this sense of being unappreciated is not just a small annoyance anymore, but something that is really hurting you.', ARRAY['feeling_unappreciated'], ARRAY['hurt', 'resentful'], 2, 50, true),

('normalization', 'Many people quietly carry resentment when their care and effort do not feel noticed; it is a very human reaction to want to feel valued.', ARRAY['feeling_unappreciated'], ARRAY['resentful'], 1, 50, true),
('normalization', 'Feeling taken for granted can slowly erode your closeness, even if the relationship still matters to you a lot.', ARRAY['feeling_unappreciated'], ARRAY['sad'], 1, 50, true),
('normalization', 'Wanting acknowledgment for what you bring to a relationship does not make you needy; it reflects a basic need to feel seen and appreciated.', ARRAY['feeling_unappreciated'], ARRAY['insecure'], 1, 50, true),
('normalization', 'Sometimes people only realize how much their partner carries when that partner starts to step back a bit and take care of themselves too.', ARRAY['feeling_unappreciated'], ARRAY['tired'], 2, 50, true),
('normalization', 'Noticing that you feel unappreciated can be an invitation to look at the balance of giving and receiving in your life, without blaming yourself for caring.', ARRAY['feeling_unappreciated'], ARRAY['reflective'], 2, 50, true),

('exploration', 'When you look at this relationship, in what moments do you most notice that your effort goes unrecognized?', ARRAY['feeling_unappreciated'], ARRAY['hurt'], 1, 50, true),
('exploration', 'If your partner could see you clearly for a moment, what would you most want them to understand about how much you are carrying?', ARRAY['feeling_unappreciated'], ARRAY['tired'], 1, 50, true),
('exploration', 'How do you usually respond when you feel unappreciated — do you pull back, do more, get quiet, or something else?', ARRAY['feeling_unappreciated'], ARRAY['confused'], 2, 50, true),
('exploration', 'Are there small ways you imagine caring for yourself differently in this situation, even before anything changes with your partner?', ARRAY['feeling_unappreciated'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'Looking back over your relationships, do you notice any patterns around being the one who gives more, and how does that land with you?', ARRAY['feeling_unappreciated'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- 3. CONSTANT FIGHTING (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds exhausting to feel like even small conversations can turn into arguments between you and your partner.', ARRAY['constant_fighting', 'communication'], ARRAY['exhausted', 'frustrated'], 1, 50, true),
('reflection', 'You seem worn out from going in circles with the same conflicts and never really feeling understood.', ARRAY['constant_fighting'], ARRAY['tired', 'misunderstood'], 1, 50, true),
('reflection', 'It sounds like the tension has reached a point where you are bracing for the next argument before it even begins.', ARRAY['constant_fighting'], ARRAY['anxious', 'defensive'], 1, 50, true),
('reflection', 'Part of you seems deeply tired of the fighting, and another part might still be hoping to feel heard and close again.', ARRAY['constant_fighting'], ARRAY['hopeful', 'exhausted'], 2, 50, true),
('reflection', 'It sounds like these repeated conflicts are not just about the surface issues, but about deeper needs that do not feel met.', ARRAY['constant_fighting'], ARRAY['frustrated', 'sad'], 2, 50, true),

('normalization', 'Many couples get stuck in patterns where both people feel unheard and defensive, and the same argument shows up in different forms.', ARRAY['constant_fighting'], ARRAY['frustrated'], 1, 50, true),
('normalization', 'Feeling drained and discouraged when fights keep repeating is a very human response, especially when you still care about the relationship.', ARRAY['constant_fighting'], ARRAY['discouraged'], 1, 50, true),
('normalization', 'Conflict itself is not always a sign that love is gone; sometimes it signals that important feelings or needs have not yet had space to be expressed safely.', ARRAY['constant_fighting'], ARRAY['hopeful'], 1, 50, true),
('normalization', 'It is understandable if a part of you wonders how long you can keep going like this, and another part is afraid of what change might mean.', ARRAY['constant_fighting'], ARRAY['scared', 'conflicted'], 2, 50, true),
('normalization', 'Noticing these patterns is already a meaningful step; you are paying attention rather than completely shutting down.', ARRAY['constant_fighting'], ARRAY['aware'], 2, 50, true),

('exploration', 'When you think about your recent arguments, what do you notice tends to trigger them most often — certain topics, tones, or moments?', ARRAY['constant_fighting'], ARRAY['curious'], 1, 50, true),
('exploration', 'In those heated moments, what do you most wish your partner could understand about how you feel underneath the anger or frustration?', ARRAY['constant_fighting'], ARRAY['hurt'], 1, 50, true),
('exploration', 'How do you usually cope after a big argument — do you withdraw, try to explain more, apologize quickly, or something else?', ARRAY['constant_fighting'], ARRAY['reflective'], 2, 50, true),
('exploration', 'If you imagine one small change in the way you or your partner communicate during conflict, what comes to mind first?', ARRAY['constant_fighting'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'Looking back, do these fights remind you of any earlier patterns from past relationships or even from your family growing up?', ARRAY['constant_fighting'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- SUMMARY: 45 blocks inserted (Part 1)
-- =====================================================
