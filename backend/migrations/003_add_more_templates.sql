-- Add more diverse templates for common relationship questions
-- These cover patterns, past relationships, and decision-making

INSERT INTO amora_templates (category, emotional_state, confidence_level, example_questions, response_template, priority) VALUES
(
    'patterns',
    'self_reflection',
    'MEDIUM',
    ARRAY[
        'Why do I keep choosing the wrong people?',
        'I always pick the same type of person',
        'How does my past affect my relationships?',
        'Why do I repeat the same mistakes?',
        'I keep dating the same kind of person'
    ],
    'That''s a really important question to be asking yourself. Recognizing patterns is the first step toward changing them. What do you notice about the people you tend to choose? What draws you to them initially?',
    85
),
(
    'past_relationships',
    'reflective',
    'MEDIUM',
    ARRAY[
        'How does my past affect my present relationships?',
        'My past keeps affecting my dating life',
        'I can''t stop thinking about my ex',
        'My childhood affects my relationships',
        'Past trauma is impacting my love life'
    ],
    'Our past experiences do shape how we show up in relationships, but they don''t have to define us. What from your past feels like it''s showing up most in your current relationships? And how do you feel about that?',
    85
),
(
    'decision_making',
    'uncertainty',
    'LOW',
    ARRAY[
        'Should I give my ex another chance?',
        'I don''t know if I should stay or leave',
        'Should I text them?',
        'Is this relationship worth it?',
        'Should I break up with them?'
    ],
    'I can hear you''re weighing something important. Before we explore what to do, can you tell me what''s making this decision feel so difficult right now? What are you most worried about?',
    90
),
(
    'self_worth',
    'low_confidence',
    'MEDIUM',
    ARRAY[
        'Why am I not good enough?',
        'I feel like I''m not worthy of love',
        'Nobody wants to be with me',
        'What''s wrong with me?',
        'Why does everyone leave me?'
    ],
    'I want you to know that feeling this way doesn''t mean it''s true. When did you start feeling like you weren''t enough? And what do you think might be behind that feeling?',
    95
),
(
    'attachment',
    'anxious',
    'MEDIUM',
    ARRAY[
        'Why am I so clingy?',
        'I''m too needy in relationships',
        'I get too attached too quickly',
        'Why do I need constant reassurance?',
        'I''m afraid they''ll leave me'
    ],
    'Wanting closeness and reassurance isn''t a flaw — it''s human. But when it feels overwhelming, it can be helpful to understand where it''s coming from. What do you think you''re really afraid of when you feel this way?',
    85
),
(
    'communication',
    'frustrated',
    'MEDIUM',
    ARRAY[
        'They never listen to me',
        'We can''t communicate',
        'How do I tell them how I feel?',
        'They don''t understand me',
        'We keep having the same fight'
    ],
    'Communication struggles can feel so isolating, especially when you''re trying but it''s not landing. What happens when you try to talk to them? And how do they usually respond?',
    80
),
(
    'boundaries',
    'overwhelmed',
    'HIGH',
    ARRAY[
        'How do I set boundaries?',
        'I can''t say no to them',
        'They don''t respect my boundaries',
        'I feel guilty setting boundaries',
        'How do I protect myself?'
    ],
    'Setting boundaries can feel uncomfortable at first, especially if you''re not used to it. But it''s one of the most important things you can do for yourself. What kind of boundary feels hardest for you to set right now? And what do you think makes it so difficult?',
    85
),
(
    'trust',
    'hurt',
    'MEDIUM',
    ARRAY[
        'I can''t trust anyone anymore',
        'They broke my trust',
        'How do I trust again?',
        'I have trust issues',
        'I''m scared to trust them'
    ],
    'Trust is one of the hardest things to rebuild once it''s been broken. It makes sense that you''d feel guarded. What happened that made it hard for you to trust? And what would trust look like for you now?',
    85
),
(
    'moving_on',
    'stuck',
    'MEDIUM',
    ARRAY[
        'How do I move on?',
        'I can''t get over them',
        'Why can''t I let go?',
        'I''m stuck in the past',
        'How do I stop thinking about them?'
    ],
    'Moving on isn''t linear, and it doesn''t happen on a timeline. What do you think is making it hardest for you to let go right now? Is it the person, or what they represented to you?',
    85
),
(
    'red_flags',
    'concerned',
    'HIGH',
    ARRAY[
        'Are these red flags?',
        'Is this behavior normal?',
        'Should I be worried about this?',
        'Is this toxic?',
        'Am I overreacting?'
    ],
    'If something feels off to you, that''s worth paying attention to. Trust your instincts. What specifically is making you feel concerned? And how does it make you feel when it happens?',
    90
);
