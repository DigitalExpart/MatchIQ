-- =====================================================
-- AMORA BLOCKS EXPANSION - PART 2 FIXED
-- Topics 4-10: long_distance, one_sided_effort,
--              friend_vs_romantic_confusion, stuck_on_ex,
--              comparison_to_others, low_self_worth_in_love,
--              online_dating_burnout
-- FIX: Removed id column (auto-generated UUID)
-- =====================================================

-- =====================================================
-- 4. LONG DISTANCE (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds really hard to care about someone so much while feeling the physical distance between you every day.', ARRAY['long_distance'], ARRAY['lonely', 'sad'], 1, 50, true),
('reflection', 'You seem to be carrying a mix of missing them, doubting the future, and trying to stay strong at the same time.', ARRAY['long_distance'], ARRAY['confused', 'sad'], 1, 50, true),
('reflection', 'It sounds like the distance is bringing up a lot of loneliness, questions, and maybe even moments of jealousy or fear.', ARRAY['long_distance'], ARRAY['lonely', 'anxious'], 1, 50, true),
('reflection', 'Part of you might feel deeply connected to this person, while another part wonders how long your heart can handle being far apart.', ARRAY['long_distance'], ARRAY['torn', 'sad'], 2, 50, true),
('reflection', 'It sounds like the gap between how close you feel emotionally and how far you are physically is becoming really painful.', ARRAY['long_distance'], ARRAY['hurt', 'frustrated'], 2, 50, true),

('normalization', 'Long‑distance relationships often come with waves of doubt, missing each other intensely, and wondering whether the connection can last.', ARRAY['long_distance'], ARRAY['doubtful'], 1, 50, true),
('normalization', 'Feeling more sensitive or anxious when you cannot see your partner regularly is an understandable reaction to being apart.', ARRAY['long_distance'], ARRAY['anxious'], 1, 50, true),
('normalization', 'Many people underestimate how much energy long‑distance takes, so it makes sense if you feel worn down at times.', ARRAY['long_distance'], ARRAY['tired'], 1, 50, true),
('normalization', 'Your doubts do not necessarily mean the relationship is wrong; they can also be signals about what you need to feel secure and connected.', ARRAY['long_distance'], ARRAY['insecure'], 2, 50, true),
('normalization', 'Wanting both love and stability is not too much to ask; it is natural to check whether this arrangement is truly workable for you.', ARRAY['long_distance'], ARRAY['hopeful'], 2, 50, true),

('exploration', 'When does the distance feel most painful for you — at night, on weekends, during special events, or in small everyday moments?', ARRAY['long_distance'], ARRAY['lonely'], 1, 50, true),
('exploration', 'What helps you feel most connected to your partner right now, even when you cannot be in the same place physically?', ARRAY['long_distance'], ARRAY['hopeful'], 1, 50, true),
('exploration', 'When you think about the future, what kind of timeline or plan would help your heart feel more at ease about staying in this?', ARRAY['long_distance'], ARRAY['anxious'], 2, 50, true),
('exploration', 'How do you tend to cope with the loneliness that comes up in this situation, and does any part of that feel supportive to you?', ARRAY['long_distance'], ARRAY['lonely'], 2, 50, true),
('exploration', 'If you checked in with yourself honestly, what do you notice you are hoping for most in this relationship over the next year?', ARRAY['long_distance'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- 5. ONE-SIDED EFFORT (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like you feel like you are the one holding everything together while your partner stays more on the sidelines.', ARRAY['one_sided_effort'], ARRAY['tired', 'resentful'], 1, 50, true),
('reflection', 'You seem tired of always being the one who reaches out, plans, apologizes, or smooths things over.', ARRAY['one_sided_effort'], ARRAY['exhausted', 'frustrated'], 1, 50, true),
('reflection', 'It sounds painful to feel like your commitment is not being matched, even though you keep showing up.', ARRAY['one_sided_effort'], ARRAY['hurt', 'disappointed'], 1, 50, true),
('reflection', 'Part of you seems deeply loyal, and another part is starting to wonder what it would be like not to carry so much of the emotional load.', ARRAY['one_sided_effort'], ARRAY['conflicted', 'tired'], 2, 50, true),
('reflection', 'It sounds like this imbalance is starting to affect how you see yourself and the relationship as a whole.', ARRAY['one_sided_effort'], ARRAY['sad', 'doubtful'], 2, 50, true),

('normalization', 'Many people find themselves in patterns where they become the ''responsible'' or ''emotionally available'' one while their partner stays more passive.', ARRAY['one_sided_effort'], ARRAY['tired'], 1, 50, true),
('normalization', 'Feeling resentful or drained when effort is not mutual is a natural response, not a sign that you care too much.', ARRAY['one_sided_effort'], ARRAY['resentful'], 1, 50, true),
('normalization', 'Sometimes people only realize how much one partner has been carrying when that pattern is named clearly.', ARRAY['one_sided_effort'], ARRAY['aware'], 1, 50, true),
('normalization', 'Noticing this imbalance can be uncomfortable, but it can also be the beginning of taking your own needs more seriously.', ARRAY['one_sided_effort'], ARRAY['hopeful'], 2, 50, true),
('normalization', 'Wanting a relationship where care and responsibility are more shared is a very understandable longing.', ARRAY['one_sided_effort'], ARRAY['hopeful'], 2, 50, true),

('exploration', 'In what specific ways do you notice yourself putting in more effort than your partner right now?', ARRAY['one_sided_effort'], ARRAY['reflective'], 1, 50, true),
('exploration', 'How do you tend to feel and act when your effort is not matched — do you push harder, shut down, or something else?', ARRAY['one_sided_effort'], ARRAY['curious'], 1, 50, true),
('exploration', 'When you imagine a more balanced relationship, what would you hope your partner would start taking more responsibility for?', ARRAY['one_sided_effort'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'Looking back on your past relationships, do you notice this pattern of carrying more than your share, and what do you make of that?', ARRAY['one_sided_effort'], ARRAY['reflective'], 2, 50, true),
('exploration', 'What feelings come up when you even imagine stepping back a little and seeing how your partner responds?', ARRAY['one_sided_effort'], ARRAY['anxious'], 2, 50, true);

-- =====================================================
-- 6. FRIEND VS ROMANTIC CONFUSION (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like you feel really close to this person and are not sure whether what you feel is friendship, attraction, or something in between.', ARRAY['friend_vs_romantic_confusion'], ARRAY['confused', 'curious'], 1, 50, true),
('reflection', 'You seem torn between wanting to protect the friendship and wondering if you might be missing a deeper connection.', ARRAY['friend_vs_romantic_confusion'], ARRAY['torn', 'hopeful'], 1, 50, true),
('reflection', 'It sounds confusing to have feelings that do not fit neatly into just ''friend'' or ''partner.''', ARRAY['friend_vs_romantic_confusion'], ARRAY['confused'], 1, 50, true),
('reflection', 'Part of you might be excited by the possibility of more, while another part is scared of losing what you already have.', ARRAY['friend_vs_romantic_confusion'], ARRAY['excited', 'scared'], 2, 50, true),
('reflection', 'It sounds like you are carrying a lot of feelings silently, trying to decide what this connection really means to you.', ARRAY['friend_vs_romantic_confusion'], ARRAY['uncertain', 'hopeful'], 2, 50, true),

('normalization', 'Lines between friendship and romance can easily blur, especially when there is emotional closeness, attraction, or shared history.', ARRAY['friend_vs_romantic_confusion'], ARRAY['confused'], 1, 50, true),
('normalization', 'Feeling confused or conflicted here does not mean anything is wrong with you; it shows that this relationship matters to you.', ARRAY['friend_vs_romantic_confusion'], ARRAY['confused'], 1, 50, true),
('normalization', 'Many people worry about risking a friendship by exploring romantic feelings, and that fear can make it hard to think clearly.', ARRAY['friend_vs_romantic_confusion'], ARRAY['scared'], 1, 50, true),
('normalization', 'It is understandable if you feel pressure to decide, yet also want more time to really understand what your heart is saying.', ARRAY['friend_vs_romantic_confusion'], ARRAY['pressured'], 2, 50, true),
('normalization', 'There is no single ''right'' way to experience this; your pace and your feelings are allowed to be complex.', ARRAY['friend_vs_romantic_confusion'], ARRAY['uncertain'], 2, 50, true),

('exploration', 'When you picture this person, what moments feel most like friendship, and what moments feel like something more than that?', ARRAY['friend_vs_romantic_confusion'], ARRAY['curious'], 1, 50, true),
('exploration', 'What feels most scary about the possibility of sharing your deeper feelings with them, and what feels most hopeful?', ARRAY['friend_vs_romantic_confusion'], ARRAY['scared', 'hopeful'], 1, 50, true),
('exploration', 'If nothing had to change right away, what would you simply want to understand better about your own feelings first?', ARRAY['friend_vs_romantic_confusion'], ARRAY['reflective'], 2, 50, true),
('exploration', 'Looking back at other connections in your life, have you ever felt something similar, and how did you handle it then?', ARRAY['friend_vs_romantic_confusion'], ARRAY['reflective'], 2, 50, true),
('exploration', 'What qualities would you hope to protect in this relationship, no matter what label it eventually has?', ARRAY['friend_vs_romantic_confusion'], ARRAY['hopeful'], 2, 50, true);

-- Continue with remaining topics (7-10) below...
-- =====================================================
-- 7. STUCK ON EX (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like a big part of you is still attached to your ex, even though the relationship has ended.', ARRAY['stuck_on_ex', 'heartbreak'], ARRAY['sad', 'longing'], 1, 50, true),
('reflection', 'You seem to be replaying what happened with your ex over and over, trying to make sense of it and of your own feelings.', ARRAY['stuck_on_ex'], ARRAY['confused', 'sad'], 1, 50, true),
('reflection', 'It sounds like moving on from this person feels harder than you expected, and a part of you is still holding on.', ARRAY['stuck_on_ex'], ARRAY['stuck', 'sad'], 1, 50, true),
('reflection', 'A piece of your heart still seems very connected to the version of life you imagined with this person.', ARRAY['stuck_on_ex'], ARRAY['longing', 'sad'], 2, 50, true),
('reflection', 'It sounds like you are grieving not only the relationship, but also the future and identity you had built around it.', ARRAY['stuck_on_ex'], ARRAY['grieving', 'lost'], 2, 50, true),

('normalization', 'It is very common to feel attached to an ex for a long time, especially if they were part of many important moments in your life.', ARRAY['stuck_on_ex'], ARRAY['sad'], 1, 50, true),
('normalization', 'Your mind going back to them again and again does not mean you are failing; it reflects how strong that bond felt for you.', ARRAY['stuck_on_ex'], ARRAY['frustrated'], 1, 50, true),
('normalization', 'Grief after a breakup rarely moves in a straight line; it can loop, stall, and resurface when you least expect it.', ARRAY['stuck_on_ex'], ARRAY['sad'], 1, 50, true),
('normalization', 'Missing an ex does not automatically mean going back is right for you; it can simply mean that your heart is still healing.', ARRAY['stuck_on_ex'], ARRAY['confused'], 2, 50, true),
('normalization', 'It is understandable if a part of you idealizes the good moments and another part remembers why it ended; both sides can exist at once.', ARRAY['stuck_on_ex'], ARRAY['conflicted'], 2, 50, true),

('exploration', 'When your thoughts go back to your ex, what specific memories or feelings tend to replay the most?', ARRAY['stuck_on_ex'], ARRAY['reflective'], 1, 50, true),
('exploration', 'What parts of that relationship do you miss the most, and what parts were actually painful or exhausting for you?', ARRAY['stuck_on_ex'], ARRAY['reflective'], 1, 50, true),
('exploration', 'How do you usually cope when you feel a strong urge to reach out or check on them, and how do you feel afterward?', ARRAY['stuck_on_ex'], ARRAY['tempted'], 2, 50, true),
('exploration', 'If you imagine your life a year from now, what would healing from this breakup look and feel like for you?', ARRAY['stuck_on_ex'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'What do you notice about how this past relationship affects the way you see yourself and new connections today?', ARRAY['stuck_on_ex'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- 8. COMPARISON TO OTHERS (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds really painful to feel compared to someone else, or to find yourself constantly measuring yourself against your partner''s ex or new partner.', ARRAY['comparison_to_others'], ARRAY['insecure', 'hurt'], 1, 50, true),
('reflection', 'You seem caught in a cycle of wondering whether you are better, worse, or enough compared to someone from your partner''s past.', ARRAY['comparison_to_others'], ARRAY['anxious', 'insecure'], 1, 50, true),
('reflection', 'It sounds like comparing yourself in this way is really hurting your confidence and sense of security.', ARRAY['comparison_to_others'], ARRAY['insecure', 'sad'], 1, 50, true),
('reflection', 'A part of you seems to crave reassurance that you are chosen and valued, and another part fears being replaced or not measuring up.', ARRAY['comparison_to_others'], ARRAY['scared', 'insecure'], 2, 50, true),
('reflection', 'It sounds like these comparisons are not just about them, but about deeper questions of your own worth.', ARRAY['comparison_to_others'], ARRAY['insecure', 'sad'], 2, 50, true),

('normalization', 'Many people struggle with comparing themselves to an ex or to others their partner has been with, especially when feeling insecure.', ARRAY['comparison_to_others'], ARRAY['insecure'], 1, 50, true),
('normalization', 'These comparisons can be especially strong if trust has been shaken or if you have been hurt in past relationships.', ARRAY['comparison_to_others'], ARRAY['hurt'], 1, 50, true),
('normalization', 'Feeling threatened by someone''s past does not mean you are weak; it reflects how much you want to feel secure and chosen.', ARRAY['comparison_to_others'], ARRAY['insecure'], 1, 50, true),
('normalization', 'Your value is not actually determined by how you rank against another person, even if your mind keeps going there.', ARRAY['comparison_to_others'], ARRAY['insecure'], 2, 50, true),
('normalization', 'Noticing the impact these comparisons have on you is an important step toward understanding what reassurance and boundaries you might need.', ARRAY['comparison_to_others'], ARRAY['aware'], 2, 50, true),

('exploration', 'When do these comparisons tend to show up most strongly — in quiet moments alone, after arguments, on social media, or somewhere else?', ARRAY['comparison_to_others'], ARRAY['curious'], 1, 50, true),
('exploration', 'What story does your mind tell you about what it would mean if you were ''better'' or ''worse'' than this other person?', ARRAY['comparison_to_others'], ARRAY['reflective'], 1, 50, true),
('exploration', 'How does your partner respond when you feel insecure or bring up these feelings, and how does that affect you?', ARRAY['comparison_to_others'], ARRAY['vulnerable'], 2, 50, true),
('exploration', 'If you stepped back for a moment from the comparison, what qualities in yourself do you genuinely value in relationships?', ARRAY['comparison_to_others'], ARRAY['reflective'], 2, 50, true),
('exploration', 'What do you notice about where these feelings of not being enough might have started for you, even before this relationship?', ARRAY['comparison_to_others'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- 9. LOW SELF-WORTH IN LOVE (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like a part of you wonders whether you are truly lovable or worthy of the kind of relationship you want.', ARRAY['low_self_worth_in_love'], ARRAY['insecure', 'sad'], 1, 50, true),
('reflection', 'You seem to carry a belief that there is something wrong with you when relationships do not work out.', ARRAY['low_self_worth_in_love'], ARRAY['ashamed', 'sad'], 1, 50, true),
('reflection', 'It sounds really painful to feel like you are always the one who is not chosen, not enough, or too much.', ARRAY['low_self_worth_in_love'], ARRAY['hurt', 'rejected'], 1, 50, true),
('reflection', 'A part of you seems to have absorbed old messages about your worth, and they keep echoing in your relationships now.', ARRAY['low_self_worth_in_love'], ARRAY['sad', 'stuck'], 2, 50, true),
('reflection', 'It sounds like you are tired of believing you are unlovable, yet that belief still feels very loud inside.', ARRAY['low_self_worth_in_love'], ARRAY['exhausted', 'sad'], 2, 50, true),

('normalization', 'People who have been rejected, criticized, or abandoned often start to confuse those experiences with their actual worth.', ARRAY['low_self_worth_in_love'], ARRAY['sad'], 1, 50, true),
('normalization', 'Feeling unlovable does not mean you truly are; it means pain and old stories have had a lot of time to sink in.', ARRAY['low_self_worth_in_love'], ARRAY['hurt'], 1, 50, true),
('normalization', 'You are not alone in questioning your value after difficult relationships; many people quietly carry similar doubts.', ARRAY['low_self_worth_in_love'], ARRAY['lonely'], 1, 50, true),
('normalization', 'These beliefs can feel very convincing because they have been repeated inside you for so long, but they are still beliefs, not facts.', ARRAY['low_self_worth_in_love'], ARRAY['doubtful'], 2, 50, true),
('normalization', 'The fact that you are reflecting on this shows that a part of you is already questioning whether those old stories are fair to you.', ARRAY['low_self_worth_in_love'], ARRAY['hopeful'], 2, 50, true),

('exploration', 'When did you first start to feel like you might not be lovable or ''enough'' in relationships, as far back as you can remember?', ARRAY['low_self_worth_in_love'], ARRAY['reflective'], 1, 50, true),
('exploration', 'What kinds of situations or comments tend to make this belief about yourself feel strongest?', ARRAY['low_self_worth_in_love'], ARRAY['vulnerable'], 1, 50, true),
('exploration', 'Are there people or moments, even small ones, that hint at a different story about you than the one that says you are unlovable?', ARRAY['low_self_worth_in_love'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'If a close friend told you they felt the way you do about themselves, how might you see them differently from how you see yourself?', ARRAY['low_self_worth_in_love'], ARRAY['compassionate'], 2, 50, true),
('exploration', 'What small, gentle way could you imagine beginning to treat yourself as someone who is worthy of care, even if you do not fully believe it yet?', ARRAY['low_self_worth_in_love'], ARRAY['hopeful'], 2, 50, true);

-- =====================================================
-- 10. ONLINE DATING BURNOUT (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
('reflection', 'It sounds like you are really tired of swiping, chatting, and getting your hopes up only to feel disappointed again.', ARRAY['online_dating_burnout'], ARRAY['exhausted', 'disappointed'], 1, 50, true),
('reflection', 'You seem worn down by the cycles of matching, small talk, ghosting, and starting over.', ARRAY['online_dating_burnout'], ARRAY['tired', 'frustrated'], 1, 50, true),
('reflection', 'It sounds like dating has begun to feel more like a chore than something hopeful or exciting.', ARRAY['online_dating_burnout'], ARRAY['discouraged', 'tired'], 1, 50, true),
('reflection', 'Part of you still wants connection, and another part is so exhausted that even trying again feels heavy.', ARRAY['online_dating_burnout'], ARRAY['torn', 'exhausted'], 2, 50, true),
('reflection', 'It sounds like you are starting to question whether love is even possible for you in this way, and that doubt hurts.', ARRAY['online_dating_burnout'], ARRAY['hopeless', 'sad'], 2, 50, true),

('normalization', 'Many people reach a point where dating apps feel more draining than hopeful, especially after repeated disappointments.', ARRAY['online_dating_burnout'], ARRAY['tired'], 1, 50, true),
('normalization', 'Feeling burned out by modern dating does not mean there is something wrong with you; it often means you have been trying very hard for a long time.', ARRAY['online_dating_burnout'], ARRAY['exhausted'], 1, 50, true),
('normalization', 'It is understandable if a part of you wants to protect yourself by caring less or avoiding apps for a while.', ARRAY['online_dating_burnout'], ARRAY['defensive'], 1, 50, true),
('normalization', 'Your exhaustion might be less about you and more about the pace and pressure of how you have been dating.', ARRAY['online_dating_burnout'], ARRAY['tired'], 2, 50, true),
('normalization', 'Wanting love while also wanting rest from the search is a very human tension, and both parts of you make sense.', ARRAY['online_dating_burnout'], ARRAY['conflicted'], 2, 50, true),

('exploration', 'What aspects of dating feel most draining to you right now, and are there any parts that still feel even a little bit meaningful or enjoyable?', ARRAY['online_dating_burnout'], ARRAY['reflective'], 1, 50, true),
('exploration', 'When you think about the way you have been approaching dating, what do you notice about the expectations or pressure you have been carrying?', ARRAY['online_dating_burnout'], ARRAY['curious'], 1, 50, true),
('exploration', 'If you could give yourself permission to date in a way that feels a little kinder to your energy, what might that look like in practice?', ARRAY['online_dating_burnout'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'Outside of apps, where in your life do you currently feel most alive, connected, or yourself, and how might that be a clue for the kind of connections you want?', ARRAY['online_dating_burnout'], ARRAY['reflective'], 2, 50, true),
('exploration', 'What would it be like to treat this season less as a test you have to pass and more as a chance to understand what you genuinely need from love?', ARRAY['online_dating_burnout'], ARRAY['hopeful'], 2, 50, true);

-- =====================================================
-- SUMMARY: 105 blocks inserted (Part 2)
-- Total: 150 new blocks across 10 topics
-- =====================================================
