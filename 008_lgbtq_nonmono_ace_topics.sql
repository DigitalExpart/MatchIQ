-- =====================================================
-- AMORA BLOCKS EXPANSION - LGBTQ+, NON-MONOGAMY, ACE
-- 3 new topics: non-monogamy/poly, asexuality/low desire,
--               LGBTQ+ family pressure
-- Total: 45 new blocks (15 per topic)
-- =====================================================

-- =====================================================
-- 1. NON-MONOGAMY / OPEN RELATIONSHIPS / POLYAMORY (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you''re in a situation where non‑monogamy or opening the relationship is on the table, and that''s bringing up a lot of mixed feelings for you.', ARRAY['non_monogamy_open_or_poly'], ARRAY['confused', 'anxious'], 1, 50, true),
('reflection', 'You seem pulled between wanting to honor your partner''s desires and wanting to honor your own comfort and sense of safety.', ARRAY['non_monogamy_open_or_poly'], ARRAY['torn', 'conflicted'], 1, 50, true),
('reflection', 'It sounds confusing to navigate jealousy, fear, or curiosity about open relationships all at the same time.', ARRAY['non_monogamy_open_or_poly'], ARRAY['confused', 'jealous'], 1, 50, true),
('reflection', 'A part of you might be afraid of losing your partner, while another part is wondering whether this way of relating truly fits who you are.', ARRAY['non_monogamy_open_or_poly'], ARRAY['scared', 'conflicted'], 2, 50, true),
('reflection', 'It sounds like you''re questioning not just the structure of your relationship, but what commitment, trust, and security mean to you personally.', ARRAY['non_monogamy_open_or_poly'], ARRAY['reflective', 'uncertain'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'It''s common for partners to have different comfort levels with non‑monogamy, and to feel torn when one person is more eager than the other.', ARRAY['non_monogamy_open_or_poly'], ARRAY['conflicted'], 1, 50, true),
('normalization', 'Feeling jealous, insecure, or unsure in the face of open relationship conversations is a very human response.', ARRAY['non_monogamy_open_or_poly'], ARRAY['jealous', 'insecure'], 1, 50, true),
('normalization', 'Questioning whether non‑monogamy fits you does not make you closed‑minded or unloving; it shows you''re paying attention to your own boundaries.', ARRAY['non_monogamy_open_or_poly'], ARRAY['uncertain'], 1, 50, true),
('normalization', 'Some people genuinely thrive in open or polyamorous arrangements and others don''t; figuring out which is true for you can take time and honesty.', ARRAY['non_monogamy_open_or_poly'], ARRAY['reflective'], 2, 50, true),
('normalization', 'Wanting to understand your own needs around exclusivity, safety, and connection is a valid part of caring for yourself in any relationship style.', ARRAY['non_monogamy_open_or_poly'], ARRAY['hopeful'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'When you imagine being in an open or non‑monogamous relationship, what feelings come up most strongly for you—curiosity, anxiety, excitement, fear, something else?', ARRAY['non_monogamy_open_or_poly'], ARRAY['curious'], 1, 50, true),
('exploration', 'What does commitment look and feel like to you personally, and how do you imagine that fitting—or not fitting—with multiple partners?', ARRAY['non_monogamy_open_or_poly'], ARRAY['reflective'], 1, 50, true),
('exploration', 'How have you and your partner talked about boundaries, jealousy, and emotional safety so far, and what has felt missing from those conversations?', ARRAY['non_monogamy_open_or_poly'], ARRAY['reflective'], 2, 50, true),
('exploration', 'If you listened closely to your own intuition, what does it say about what you are honestly ready—or not ready—for right now?', ARRAY['non_monogamy_open_or_poly'], ARRAY['reflective'], 2, 50, true),
('exploration', 'What would you need to feel emotionally safe in any relationship structure you choose, whether monogamous or not?', ARRAY['non_monogamy_open_or_poly'], ARRAY['hopeful'], 2, 50, true);

-- =====================================================
-- 2. ASEXUALITY / LOW DESIRE AS IDENTITY (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you''re noticing that your experience of sexual desire is very different from what people around you describe, and that''s raising a lot of questions.', ARRAY['asexual_or_low_desire_identity'], ARRAY['confused', 'curious'], 1, 50, true),
('reflection', 'You seem to be wondering whether you might be asexual or simply have a much lower desire than others, and you''re trying to make sense of what that means for you.', ARRAY['asexual_or_low_desire_identity'], ARRAY['uncertain', 'reflective'], 1, 50, true),
('reflection', 'It sounds like you feel out of place or broken at times because your interest in sex doesn''t match what partners or society seem to expect.', ARRAY['asexual_or_low_desire_identity'], ARRAY['isolated', 'ashamed'], 1, 50, true),
('reflection', 'A part of you may be curious and relieved to have language for your experience, while another part is scared of being misunderstood or rejected because of it.', ARRAY['asexual_or_low_desire_identity'], ARRAY['relieved', 'scared'], 2, 50, true),
('reflection', 'It sounds like you''re trying to figure out how to be true to yourself about your level of desire while still imagining closeness and connection with others.', ARRAY['asexual_or_low_desire_identity'], ARRAY['hopeful', 'uncertain'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'There is a wide spectrum of sexual desire, and many people identify as asexual or low‑desire; you''re not alone in questioning where you might fit.', ARRAY['asexual_or_low_desire_identity'], ARRAY['curious'], 1, 50, true),
('normalization', 'Feeling different from cultural expectations about sex can be unsettling, but it doesn''t mean there is anything wrong with you as a person.', ARRAY['asexual_or_low_desire_identity'], ARRAY['insecure'], 1, 50, true),
('normalization', 'It''s common to take time exploring labels like asexual, demisexual, or simply ''low desire'' before deciding what, if anything, feels right for you.', ARRAY['asexual_or_low_desire_identity'], ARRAY['reflective'], 1, 50, true),
('normalization', 'Wanting romantic, emotional, or companionate connection without strong sexual interest is a valid way to experience relationships.', ARRAY['asexual_or_low_desire_identity'], ARRAY['hopeful'], 2, 50, true),
('normalization', 'Taking your time to understand your orientation or identity is okay; there''s no deadline for knowing exactly which words fit you.', ARRAY['asexual_or_low_desire_identity'], ARRAY['relieved'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'Looking back over your life, how would you describe your feelings about sex and attraction compared to what you see or hear from others?', ARRAY['asexual_or_low_desire_identity'], ARRAY['reflective'], 1, 50, true),
('exploration', 'When you imagine an ideal relationship for you, how important does sexual activity feel compared to emotional closeness, companionship, or shared life goals?', ARRAY['asexual_or_low_desire_identity'], ARRAY['hopeful'], 1, 50, true),
('exploration', 'What feelings or worries come up when you think about telling a partner or potential partner about your experience with desire?', ARRAY['asexual_or_low_desire_identity'], ARRAY['anxious'], 2, 50, true),
('exploration', 'Are there online communities, resources, or stories from people with similar experiences that you''ve found resonant or relieving in any way?', ARRAY['asexual_or_low_desire_identity'], ARRAY['curious'], 2, 50, true),
('exploration', 'If you gave yourself permission to be fully honest about your level of desire, what boundaries or agreements would feel kindest to you in a relationship?', ARRAY['asexual_or_low_desire_identity'], ARRAY['hopeful'], 2, 50, true);

-- =====================================================
-- 3. LGBTQ+ IDENTITY & FAMILY/SOCIETAL PRESSURE (15 blocks)
-- =====================================================

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES
-- REFLECTION (5)
('reflection', 'It sounds like you''re carrying the weight of being yourself in your relationships while also fearing how family or community might react.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['scared', 'burdened'], 1, 50, true),
('reflection', 'You seem pulled between the person you love or the identity that feels true to you, and the expectations or beliefs you grew up with.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['torn', 'conflicted'], 1, 50, true),
('reflection', 'It sounds exhausting to hide parts of your relationship or identity from people who matter to you.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['exhausted', 'lonely'], 1, 50, true),
('reflection', 'A part of you may long for acceptance and belonging, while another part is bracing for judgment, rejection, or conflict.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['longing', 'scared'], 2, 50, true),
('reflection', 'It sounds like you''re trying to hold love for your family and love for yourself or your partner at the same time, and that''s a very heavy balance.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['torn', 'overwhelmed'], 2, 50, true),

-- NORMALIZATION (5)
('normalization', 'Many LGBTQ+ people experience a painful tension between their relationships or identity and the expectations of family, culture, or faith.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['conflicted'], 1, 50, true),
('normalization', 'Feeling afraid of rejection or conflict if you''re honest about who you are or who you love is an understandable reaction in unsupportive environments.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['scared'], 1, 50, true),
('normalization', 'You''re not alone in feeling like you have to choose between parts of your life that all matter to you deeply.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['torn'], 1, 50, true),
('normalization', 'Taking time to think about your safety, your emotional wellbeing, and your boundaries around coming out can be an important act of self‑care.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['reflective'], 2, 50, true),
('normalization', 'It''s understandable if you feel both loyalty to your family and a strong need to live more openly; those feelings can coexist even when the path forward isn''t clear.', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['conflicted'], 2, 50, true),

-- EXPLORATION (5)
('exploration', 'Who in your life, if anyone, knows about your identity or relationship right now, and how have they responded?', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['reflective'], 1, 50, true),
('exploration', 'When you imagine telling your family or community, what outcomes do you fear the most, and what, if anything, do you hope for?', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['scared'], 1, 50, true),
('exploration', 'How do you currently take care of yourself emotionally when you feel the weight of hiding or of being judged?', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['reflective'], 2, 50, true),
('exploration', 'Are there any supportive spaces—friends, online communities, groups—where you can be more fully yourself, and what has that been like for you?', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['hopeful'], 2, 50, true),
('exploration', 'If you gently checked in with your own values and needs, what feels most important to protect right now—your safety, your authenticity, your relationships, or something else?', ARRAY['lgbtq_identity_and_family_pressure'], ARRAY['reflective'], 2, 50, true);

-- =====================================================
-- SUMMARY: 45 blocks inserted (15 per topic × 3 topics)
-- Topics: non-monogamy/poly, asexuality/low desire, LGBTQ+ pressure
-- =====================================================
