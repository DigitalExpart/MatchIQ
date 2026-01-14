-- ============================================
-- Add more comprehensive templates for common relationship questions
-- These cover patterns that were falling through to fallback responses
-- Run this after 002_amora_templates.sql and 003_add_more_templates.sql
-- ============================================

-- Past relationships and baggage (MEDIUM confidence)
INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'past_relationships',
    'mixed',
    'MEDIUM',
    ARRAY[
        'How does my past affect my present relationships',
        'My past relationships affect me',
        'I''m thinking about my past relationships',
        'Why do I keep thinking about my ex',
        'How do I move on from past relationships',
        'My past is affecting my current relationship'
    ],
    'Your past experiences often shape how you approach relationships now—that''s natural. Sometimes patterns from previous relationships can influence what feels safe or comfortable. It might help to reflect: What specific patterns do you notice? Are there certain reactions or fears that seem familiar? Understanding these connections can help you decide what to carry forward and what to release.',
    82
),
(
    'relationship_mess',
    'high_confusion',
    'LOW',
    ARRAY[
        'My love life is a mess',
        'My relationship is a mess',
        'Everything is so complicated',
        'My relationships are always messy',
        'I can''t get relationships right',
        'Why are my relationships so messy'
    ],
    'It sounds like things feel really overwhelming right now, and that can be exhausting. When relationships feel messy, it often means there''s a lot happening at once—emotions, situations, uncertainty. What part of this feels most tangled or confusing to you right now?',
    92
),
(
    'complicated_status',
    'high_confusion',
    'LOW',
    ARRAY[
        'My relationship status is complicated',
        'It''s complicated',
        'Our relationship is complicated',
        'I don''t know what we are',
        'Are we dating or not',
        'What is our relationship'
    ],
    'Feeling uncertain about where you stand with someone can create a lot of mental and emotional energy. Sometimes "complicated" means there are different expectations, unclear boundaries, or mixed signals. What would help you feel more clear about what you want from this connection?',
    88
),
(
    'relationship_patterns',
    'mixed',
    'MEDIUM',
    ARRAY[
        'Why do I keep making the same mistakes',
        'I keep dating the same type of person',
        'I have a pattern in relationships',
        'Why do my relationships always fail',
        'I keep repeating the same relationship patterns',
        'Why do I attract the wrong people'
    ],
    'Noticing patterns in your relationships shows real self-awareness, and that''s an important first step. Patterns often develop because they once served a purpose—maybe they felt familiar or safe in some way. It might help to reflect: What draws you to these situations initially? What needs might these patterns have been trying to meet? Understanding the "why" can help you make different choices moving forward.',
    77
),
(
    'emotional_availability',
    'mixed',
    'MEDIUM',
    ARRAY[
        'Am I emotionally available',
        'How do I know if I''m emotionally available',
        'I don''t think I''m emotionally available',
        'What does emotional availability mean',
        'How to become emotionally available',
        'Why can''t I open up emotionally'
    ],
    'Emotional availability often involves being able to recognize, process, and share your feelings with another person. It might help to consider: Can you identify and name your emotions when they arise? Do you feel safe being vulnerable? Are you able to be present for someone else''s emotions without shutting down or taking over? Sometimes building emotional availability is a gradual process—noticing where you feel blocked can be a helpful starting point.',
    73
),
(
    'relationship_doubt',
    'high_anxiety',
    'LOW',
    ARRAY[
        'I have doubts about my relationship',
        'Should I be having doubts',
        'Is it normal to have doubts',
        'I''m doubting everything',
        'What if I''m making a mistake',
        'I keep second-guessing my relationship'
    ],
    'Having doubts can feel unsettling, and it''s understandable that you''re trying to make sense of them. Doubts sometimes signal that something needs attention, but they can also come from anxiety or fear of vulnerability. When you notice these doubts, what specifically are they about? Are they about your partner, about yourself, or about the relationship itself?',
    87
),
(
    'emotional_pain',
    'high_emotion',
    'LOW',
    ARRAY[
        'I''m hurting',
        'This hurts so much',
        'I''m in so much pain',
        'My heart is broken',
        'I can''t stop crying',
        'The pain is too much'
    ],
    'I can hear how much pain you''re carrying right now, and I''m so sorry you''re going through this. Emotional pain can feel overwhelming and all-consuming. What you''re feeling is real and valid. Is there anything specific that feels most heavy right now, or does it all feel like too much?',
    98
);

-- Add more relationship stages and milestones (HIGH confidence)
INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'relationship_stages',
    'low_emotion',
    'HIGH',
    ARRAY[
        'What are the stages of a relationship',
        'How do relationships progress',
        'What''s normal in a new relationship',
        'How long should each relationship stage last',
        'When should we move to the next step'
    ],
    'Relationships often move through stages—attraction, early bonding, deepening commitment, and sustained partnership—though the timeline and experience can vary widely. It might help to focus on: Are you both comfortable with the current pace? Do you feel like you''re building trust and understanding? There''s no universal "right" timeline; what matters is that both people feel aligned and respected in how the relationship is progressing.',
    68
),
(
    'jealousy',
    'mixed',
    'MEDIUM',
    ARRAY[
        'I feel jealous',
        'How do I deal with jealousy',
        'Is jealousy normal',
        'I''m jealous of their ex',
        'My partner makes me jealous',
        'Why am I so jealous'
    ],
    'Jealousy is a common emotion that often signals underlying needs or insecurities. It might help to explore: What specifically triggers the jealousy? Is it rooted in past experiences, current relationship dynamics, or your own self-perception? Understanding where it comes from can help you address it constructively—through communication, building security, or working on your own emotional needs.',
    78
),
(
    'toxic_relationship',
    'high_anxiety',
    'LOW',
    ARRAY[
        'Is my relationship toxic',
        'I think my relationship is toxic',
        'Am I in a toxic relationship',
        'What makes a relationship toxic',
        'How to know if relationship is toxic',
        'Signs of toxic relationship'
    ],
    'It takes courage to question whether a relationship is healthy. Toxic relationships often involve patterns like manipulation, disrespect, control, constant criticism, or feeling worse about yourself when you''re with them. When you think about your relationship, what specific behaviors or patterns are making you feel concerned?',
    94
);

-- Verify all templates
SELECT 
    category, 
    confidence_level, 
    priority, 
    active,
    array_length(example_questions, 1) as num_examples
FROM amora_templates 
ORDER BY priority DESC;

-- ============================================
-- After running this, you MUST run:
-- python backend/scripts/add_template_embeddings.py
-- This will compute embeddings for the new templates
-- ============================================
