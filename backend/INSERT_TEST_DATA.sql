-- Test data for MyMatchIQ backend
-- Run this in Supabase SQL Editor to insert sample data for testing

-- Insert a test user
INSERT INTO users (email, profile, subscription_tier)
VALUES (
    'test@mymatchiq.com',
    '{
        "name": "Test User",
        "age": 28,
        "dating_goal": "serious",
        "location": "New York",
        "language": "en",
        "bio": "Looking for meaningful connections"
    }'::jsonb,
    'free'
)
RETURNING id, email;

-- Insert a test blueprint (self-assessment)
-- Note: Replace 'USER_ID_HERE' with the actual user ID from above
INSERT INTO blueprints (user_id, answers, profile_summary, completion_percentage, is_active)
VALUES (
    'USER_ID_HERE'::uuid,  -- Replace with actual user ID
    '[
        {
            "question_id": "q1",
            "category": "values",
            "response": "Family is very important to me",
            "importance": "high",
            "is_deal_breaker": true
        },
        {
            "question_id": "q2",
            "category": "communication",
            "response": "I prefer open and honest communication",
            "importance": "high",
            "is_deal_breaker": false
        }
    ]'::jsonb,
    '{
        "category_weights": {
            "values": 0.4,
            "communication": 0.3,
            "emotional": 0.15,
            "lifestyle": 0.1,
            "future": 0.05
        },
        "deal_breakers": [
            {
                "category": "values",
                "question_id": "q1",
                "response": "Family is very important to me"
            }
        ],
        "top_priorities": ["values", "communication", "emotional"]
    }'::jsonb,
    100,
    true
)
RETURNING id, user_id;

-- Insert a test scan
-- Note: Replace 'USER_ID_HERE' with the actual user ID
INSERT INTO scans (user_id, scan_type, person_name, answers, status, categories_completed)
VALUES (
    'USER_ID_HERE'::uuid,  -- Replace with actual user ID
    'single',
    'Test Person',
    '[
        {
            "question_id": "q1",
            "category": "values",
            "rating": "strong-match",
            "question_text": "How important is family?"
        },
        {
            "question_id": "q2",
            "category": "communication",
            "rating": "good",
            "question_text": "How do you handle conflicts?"
        }
    ]'::jsonb,
    'completed',
    ARRAY['values', 'communication']
)
RETURNING id, user_id, scan_type;

-- Instructions:
-- 1. Run the first INSERT to create a test user
-- 2. Copy the returned user ID
-- 3. Replace 'USER_ID_HERE' in the blueprint and scan inserts with the actual ID
-- 4. Run the blueprint and scan inserts

