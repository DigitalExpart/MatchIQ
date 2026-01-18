-- =====================================================
-- AMORA BLOCKS EXPANSION - CRITICAL TOPICS
-- 6 new topics: toxic dynamics, values conflicts, 
--               intimacy mismatch, partner mental health,
--               coparenting, sexual compatibility
-- Total: 90 new blocks (15 per topic)
-- =====================================================

-- =====================================================
-- 1. TOXIC / CONTROLLING / ABUSIVE DYNAMICS (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like this relationship isn''t just stressful, it may actually feel unsafe or very controlling at times, and that''s a heavy thing to be carrying.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['scared', 'anxious'], 1, 50, true),
('reflection', 'You seem to be walking on eggshells around this person, worrying about how they''ll react and what might set them off.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['anxious', 'fearful'], 1, 50, true),
('reflection', 'It sounds like you''re being put down, blamed, or manipulated in ways that are starting to affect how you see yourself.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['hurt', 'confused'], 1, 50, true),
('reflection', 'A part of you seems to know that something in this dynamic isn''t okay, even if another part keeps hoping it will change or improve.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['conflicted', 'hopeful'], 2, 50, true),
('reflection', 'It sounds like you''ve experienced not only emotional pain, but also fear, confusion, or a sense of being trapped in this relationship.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['trapped', 'scared'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'Many people in harmful or controlling relationships question themselves for a long time before they even name what''s happening as not okay.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['confused'], 1, 50, true),
('normalization', 'Feeling confused, ashamed, or blaming yourself is an extremely common reaction when someone you care about treats you in hurtful or frightening ways.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['ashamed', 'confused'], 1, 50, true),
('normalization', 'It''s not unusual for abusive or toxic patterns to start slowly, mixed with good moments, which can make it much harder to see clearly from the inside.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['confused'], 1, 50, true),
('normalization', 'Wanting to understand what''s happening and keep yourself emotionally or physically safer is a completely understandable instinct, not a sign of weakness.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['scared'], 2, 50, true),
('normalization', 'Reaching out for support, whether to an AI, a trusted person, or a professional, is often one of the first steps people take when they start to realize a relationship may be harmful.', ARRAY['toxic_or_abusive_dynamic'], ARRAY['hopeful'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'When you think about this relationship, what specific behaviors or moments feel most frightening, shaming, or controlling to you?', ARRAY['toxic_or_abusive_dynamic'], ARRAY['scared'], 1, 50, true),
('exploration', 'How do you usually feel in your body around this person—more relaxed and yourself, or more tense, small, or anxious?', ARRAY['toxic_or_abusive_dynamic'], ARRAY['anxious'], 1, 50, true),
('exploration', 'Who in your life, if anyone, knows what''s really going on, and what has it been like to talk—or not talk—about this with them?', ARRAY['toxic_or_abusive_dynamic'], ARRAY['lonely'], 2, 50, true),
('exploration', 'If you gently checked in with your sense of safety, what do you notice you are most worried about right now—your emotional safety, your physical safety, or both?', ARRAY['toxic_or_abusive_dynamic'], ARRAY['scared'], 2, 50, true),
('exploration', 'What kinds of support, information, or resources do you imagine might help you feel even a little less alone or stuck in this situation?', ARRAY['toxic_or_abusive_dynamic'], ARRAY['hopeful'], 2, 50, true);

-- =====================================================
-- 2. CORE VALUES / RELIGION / CULTURE CONFLICTS (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you and your partner share feelings for each other but have some deep differences in beliefs, values, or background that are weighing on you.', ARRAY['core_values_conflict'], ARRAY['conflicted', 'worried'], 1, 50, true),
('reflection', 'You seem torn between the love you feel and the tension that comes from clashing over religion, culture, or how you both see life.', ARRAY['core_values_conflict'], ARRAY['torn', 'sad'], 1, 50, true),
('reflection', 'It sounds painful to feel caught between your relationship and the expectations or beliefs of your family, community, or faith.', ARRAY['core_values_conflict'], ARRAY['torn', 'pressured'], 1, 50, true),
('reflection', 'A part of you seems to really cherish this connection, and another part is worried about what it might cost you in terms of your values or family bonds.', ARRAY['core_values_conflict'], ARRAY['conflicted', 'worried'], 2, 50, true),
('reflection', 'It sounds like these differences are not just intellectual; they touch very personal parts of who you are and what you believe.', ARRAY['core_values_conflict'], ARRAY['conflicted'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'Many couples deeply care about each other and still run into painful tensions around religion, culture, family expectations, or life priorities.', ARRAY['core_values_conflict'], ARRAY['conflicted'], 1, 50, true),
('normalization', 'Feeling pulled between honoring your background and honoring your relationship is a very human and complicated position to be in.', ARRAY['core_values_conflict'], ARRAY['torn'], 1, 50, true),
('normalization', 'It makes sense if this doesn''t feel like a simple ''yes or no'' decision, because these differences can affect family, identity, and the future.', ARRAY['core_values_conflict'], ARRAY['confused'], 1, 50, true),
('normalization', 'Questioning whether your core values and your relationship can coexist is not a sign of weakness; it shows you''re taking both seriously.', ARRAY['core_values_conflict'], ARRAY['reflective'], 2, 50, true),
('normalization', 'It''s understandable if you feel pressure from different sides—your own beliefs, your partner''s needs, and the expectations of people around you.', ARRAY['core_values_conflict'], ARRAY['pressured'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'When you think about your core values or beliefs, which ones feel absolutely essential to you, and which ones feel more flexible?', ARRAY['core_values_conflict'], ARRAY['reflective'], 1, 50, true),
('exploration', 'What are the specific situations where your differences show up most strongly—family events, future plans, daily habits, or something else?', ARRAY['core_values_conflict'], ARRAY['curious'], 1, 50, true),
('exploration', 'How have you and your partner talked about these differences so far, and what has felt helpful or unhelpful in those conversations?', ARRAY['core_values_conflict'], ARRAY['reflective'], 2, 50, true),
('exploration', 'If you imagine your life 5–10 years from now, what do you notice you most want to protect—your relationship, your beliefs, your family ties, or a combination of these?', ARRAY['core_values_conflict'], ARRAY['reflective'], 2, 50, true),
('exploration', 'What fears come up for you when you think about choosing this relationship fully, and what fears come up when you imagine letting it go?', ARRAY['core_values_conflict'], ARRAY['scared'], 2, 50, true);

-- =====================================================
-- 3. SEXUAL / PHYSICAL INTIMACY MISMATCH (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you and your partner want very different things when it comes to physical or emotional intimacy, and that gap is starting to hurt.', ARRAY['intimacy_mismatch'], ARRAY['hurt', 'frustrated'], 1, 50, true),
('reflection', 'You seem to be feeling either rejected, pressured, or both when it comes to closeness and sex in this relationship.', ARRAY['intimacy_mismatch'], ARRAY['rejected', 'pressured'], 1, 50, true),
('reflection', 'It sounds painful to feel like your needs for touch, affection, or sex are not lining up with your partner''s right now.', ARRAY['intimacy_mismatch'], ARRAY['hurt', 'lonely'], 1, 50, true),
('reflection', 'A part of you may long to feel desired and connected, while another part feels hurt, guilty, or conflicted about how things are going.', ARRAY['intimacy_mismatch'], ARRAY['longing', 'guilty'], 2, 50, true),
('reflection', 'It sounds like this mismatch is not just about sex itself, but about feeling valued, chosen, and emotionally close.', ARRAY['intimacy_mismatch'], ARRAY['hurt', 'insecure'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'Many couples experience differences in desire or comfort around intimacy at different stages of life or the relationship.', ARRAY['intimacy_mismatch'], ARRAY['confused'], 1, 50, true),
('normalization', 'Feeling hurt, rejected, or pressured around intimacy is a very human response when your needs and your partner''s needs are not aligning.', ARRAY['intimacy_mismatch'], ARRAY['hurt', 'rejected'], 1, 50, true),
('normalization', 'Intimacy isn''t only physical; it''s tied to feeling emotionally safe, respected, and understood, which can make these mismatches feel especially sensitive.', ARRAY['intimacy_mismatch'], ARRAY['vulnerable'], 1, 50, true),
('normalization', 'It makes sense if you''re questioning what this difference means about you, your partner, or the future of the relationship.', ARRAY['intimacy_mismatch'], ARRAY['doubtful'], 2, 50, true),
('normalization', 'Wanting your needs to matter in this area does not make you selfish; it points to how important closeness and connection are for you.', ARRAY['intimacy_mismatch'], ARRAY['hopeful'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'When you think about intimacy in this relationship, what specific moments or patterns feel most painful or frustrating for you right now?', ARRAY['intimacy_mismatch'], ARRAY['frustrated'], 1, 50, true),
('exploration', 'How do you usually feel and respond when your partner wants more or less intimacy than you do—do you withdraw, go along, argue, or something else?', ARRAY['intimacy_mismatch'], ARRAY['reflective'], 1, 50, true),
('exploration', 'If you could express your needs around touch, affection, or sex without fear of judgment, what would you most want your partner to hear?', ARRAY['intimacy_mismatch'], ARRAY['vulnerable'], 2, 50, true),
('exploration', 'What do you notice about how this intimacy mismatch affects how you see yourself—your attractiveness, your desirability, or your sense of worth?', ARRAY['intimacy_mismatch'], ARRAY['insecure'], 2, 50, true),
('exploration', 'Aside from sexual intimacy, are there other ways of feeling close—emotionally or physically—that you wish were more present between you?', ARRAY['intimacy_mismatch'], ARRAY['longing'], 2, 50, true);

-- =====================================================
-- 4. PARTNER'S MENTAL HEALTH / ADDICTION STRAIN (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you care deeply about your partner, and at the same time their struggles with their mental health or substance use are really weighing on you.', ARRAY['partner_mental_health_or_addiction'], ARRAY['worried', 'exhausted'], 1, 50, true),
('reflection', 'You seem to be carrying a lot—worrying about them, managing crises, and trying to hold the relationship together.', ARRAY['partner_mental_health_or_addiction'], ARRAY['exhausted', 'overwhelmed'], 1, 50, true),
('reflection', 'It sounds like a part of you is scared for them, and another part is exhausted from how their struggles are affecting your own wellbeing.', ARRAY['partner_mental_health_or_addiction'], ARRAY['scared', 'exhausted'], 1, 50, true),
('reflection', 'You may feel caught between wanting to be supportive and realizing that this situation is taking a big toll on you emotionally.', ARRAY['partner_mental_health_or_addiction'], ARRAY['conflicted', 'tired'], 2, 50, true),
('reflection', 'It sounds like you''ve been holding a lot of responsibility, maybe more than feels fair or sustainable, because you don''t want to abandon them.', ARRAY['partner_mental_health_or_addiction'], ARRAY['guilty', 'resentful'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'It''s very common for people who love someone with mental health or addiction struggles to feel both compassion and resentment at the same time.', ARRAY['partner_mental_health_or_addiction'], ARRAY['conflicted'], 1, 50, true),
('normalization', 'Feeling guilty for wanting your own needs met, while also wanting them to be okay, is a very human reaction in this kind of situation.', ARRAY['partner_mental_health_or_addiction'], ARRAY['guilty'], 1, 50, true),
('normalization', 'You''re not alone in feeling like you''ve slipped into a caretaker role instead of feeling like an equal partner.', ARRAY['partner_mental_health_or_addiction'], ARRAY['tired'], 1, 50, true),
('normalization', 'Wanting your partner to get help or change while also wanting to protect your own emotional safety is not selfish; it shows you''re trying to hold multiple truths at once.', ARRAY['partner_mental_health_or_addiction'], ARRAY['conflicted'], 2, 50, true),
('normalization', 'It makes sense if you''re unsure where the line is between loving support and losing yourself in the process.', ARRAY['partner_mental_health_or_addiction'], ARRAY['confused'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'In what ways do your partner''s mental health or substance struggles show up in the relationship day to day, and how do they most affect you?', ARRAY['partner_mental_health_or_addiction'], ARRAY['reflective'], 1, 50, true),
('exploration', 'How have you tried to support them so far, and what impact has that had on your own emotional and physical energy?', ARRAY['partner_mental_health_or_addiction'], ARRAY['exhausted'], 1, 50, true),
('exploration', 'Who, if anyone, knows about what you''re dealing with at home, and what has it been like to get—or not get—support for yourself?', ARRAY['partner_mental_health_or_addiction'], ARRAY['lonely'], 2, 50, true),
('exploration', 'When you listen to your own needs in this situation, what do you notice you might be longing for—stability, appreciation, rest, clearer boundaries, or something else?', ARRAY['partner_mental_health_or_addiction'], ARRAY['reflective'], 2, 50, true),
('exploration', 'If you could talk to someone safe and neutral about this, what would you most want to explore or ask about first?', ARRAY['partner_mental_health_or_addiction'], ARRAY['curious'], 2, 50, true);

-- =====================================================
-- 5. PARENTING / CO-PARENTING / BLENDED FAMILIES (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like trying to raise children or co‑parent in this situation is bringing up a lot of stress, conflict, or confusion for you.', ARRAY['coparenting_and_family_dynamics'], ARRAY['stressed', 'confused'], 1, 50, true),
('reflection', 'You seem to be caught in the middle of wanting what''s best for the kids and navigating a difficult dynamic with your co‑parent or partner.', ARRAY['coparenting_and_family_dynamics'], ARRAY['torn', 'frustrated'], 1, 50, true),
('reflection', 'It sounds like decisions about parenting, discipline, or family roles are turning into points of tension rather than teamwork.', ARRAY['coparenting_and_family_dynamics'], ARRAY['frustrated', 'tired'], 1, 50, true),
('reflection', 'A part of you seems deeply motivated to protect and support the children, and another part feels worn down by the adult conflict around them.', ARRAY['coparenting_and_family_dynamics'], ARRAY['protective', 'exhausted'], 2, 50, true),
('reflection', 'It sounds like you''re trying to hold many roles at once—parent, partner, mediator—and it may be stretching you thin.', ARRAY['coparenting_and_family_dynamics'], ARRAY['overwhelmed', 'tired'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'Parenting and co‑parenting can intensify existing tensions in a relationship, especially when there are different styles, histories, or families involved.', ARRAY['coparenting_and_family_dynamics'], ARRAY['stressed'], 1, 50, true),
('normalization', 'Feeling protective of your children and upset about how adults are handling things is a very understandable reaction.', ARRAY['coparenting_and_family_dynamics'], ARRAY['protective'], 1, 50, true),
('normalization', 'Blended families, step‑parent roles, and co‑parenting after separation are often far more complex than people expect from the outside.', ARRAY['coparenting_and_family_dynamics'], ARRAY['overwhelmed'], 1, 50, true),
('normalization', 'It makes sense if you feel torn between wanting stability for the kids and wanting to honor your own limits and feelings as an adult.', ARRAY['coparenting_and_family_dynamics'], ARRAY['conflicted'], 2, 50, true),
('normalization', 'Many parents quietly carry guilt or self‑doubt in these situations, even when they are doing their best in very hard circumstances.', ARRAY['coparenting_and_family_dynamics'], ARRAY['guilty'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'What are the main situations around parenting or co‑parenting that feel most stressful or upsetting to you right now?', ARRAY['coparenting_and_family_dynamics'], ARRAY['stressed'], 1, 50, true),
('exploration', 'How would you describe the difference between how you''d like things to be handled with the children and how they are actually being handled?', ARRAY['coparenting_and_family_dynamics'], ARRAY['reflective'], 1, 50, true),
('exploration', 'When you think about the kids, what do you most hope they feel and experience in this family situation, even if the adults are struggling?', ARRAY['coparenting_and_family_dynamics'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'Who, if anyone, do you feel you can be honest with about the co‑parenting challenges you''re facing, and what has it been like to lean on them or not?', ARRAY['coparenting_and_family_dynamics'], ARRAY['lonely'], 2, 50, true),
('exploration', 'If you could make one small change that might ease a bit of the tension around parenting right now, what comes to mind first?', ARRAY['coparenting_and_family_dynamics'], ARRAY['hopeful'], 2, 50, true);

-- =====================================================
-- 6. SEXUAL COMPATIBILITY / PREFERENCES / STYLES (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you and your partner have different sexual preferences, desires, or comfort levels, and that''s creating tension or distance between you.', ARRAY['sexual_compatibility'], ARRAY['frustrated', 'insecure'], 1, 50, true),
('reflection', 'You seem to be feeling either judged, misunderstood, or unfulfilled when it comes to what you want or need sexually.', ARRAY['sexual_compatibility'], ARRAY['judged', 'unfulfilled'], 1, 50, true),
('reflection', 'It sounds like conversations about sex, preferences, or fantasies feel awkward, shameful, or just don''t happen at all.', ARRAY['sexual_compatibility'], ARRAY['ashamed', 'frustrated'], 1, 50, true),
('reflection', 'A part of you might long to explore or express your sexuality more fully, while another part worries about being rejected or seen as too much.', ARRAY['sexual_compatibility'], ARRAY['longing', 'scared'], 2, 50, true),
('reflection', 'It sounds like this mismatch in sexual styles or desires is affecting not just your physical connection, but also your emotional intimacy and trust.', ARRAY['sexual_compatibility'], ARRAY['disconnected', 'sad'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'Many couples discover over time that they have different sexual preferences, turn‑ons, or comfort zones, and that can feel really vulnerable to navigate.', ARRAY['sexual_compatibility'], ARRAY['vulnerable'], 1, 50, true),
('normalization', 'Feeling embarrassed, ashamed, or nervous about sharing your sexual desires is extremely common, especially if past partners or experiences made you feel judged.', ARRAY['sexual_compatibility'], ARRAY['ashamed'], 1, 50, true),
('normalization', 'Sexual compatibility isn''t just about frequency; it''s also about feeling safe, respected, and free to be yourself without fear of rejection.', ARRAY['sexual_compatibility'], ARRAY['insecure'], 1, 50, true),
('normalization', 'It makes sense if you''re questioning whether this difference is something that can be worked through or if it points to a deeper incompatibility.', ARRAY['sexual_compatibility'], ARRAY['doubtful'], 2, 50, true),
('normalization', 'Wanting to feel sexually fulfilled and emotionally connected at the same time is not asking for too much; it''s a core part of intimate relationships for many people.', ARRAY['sexual_compatibility'], ARRAY['hopeful'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'When you think about your sexual relationship, what specific aspects feel most mismatched or frustrating—frequency, styles, openness, adventurousness, or something else?', ARRAY['sexual_compatibility'], ARRAY['reflective'], 1, 50, true),
('exploration', 'How comfortable do you feel talking openly with your partner about what you want, what feels good, or what you''d like to try sexually?', ARRAY['sexual_compatibility'], ARRAY['vulnerable'], 1, 50, true),
('exploration', 'What messages or experiences from your past—previous partners, family, culture, or religion—might be affecting how you feel about sex and your desires now?', ARRAY['sexual_compatibility'], ARRAY['reflective'], 2, 50, true),
('exploration', 'If you could create a sexual relationship where you felt completely safe and free to express yourself, what would be different from what you have now?', ARRAY['sexual_compatibility'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'What do you notice happens inside you when you imagine talking to your partner about your sexual needs—excitement, fear, shame, hope, or something else?', ARRAY['sexual_compatibility'], ARRAY['curious'], 2, 50, true);

-- =====================================================
-- SUMMARY: 90 blocks inserted (15 per topic × 6 topics)
-- Topics: toxic dynamics, values conflicts, intimacy mismatch,
--         partner mental health, coparenting, sexual compatibility
-- =====================================================
