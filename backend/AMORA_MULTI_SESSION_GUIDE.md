# Amora Multi-Session Coaching Guide

This document explains how to use the new multi-session coaching features for Amora.

## Overview

Amora now supports **multiple named coaching sessions** per user, each with:
- Separate conversation context and memory
- Progress tracking and summaries
- Daily follow-up check-ins (optional)
- Feedback features (like/dislike/regenerate)

## Database Schema

### Tables

1. **amora_sessions**: Stores coaching session metadata
   - `id` (UUID): Primary key
   - `user_id` (UUID): Foreign key to users
   - `title`: User-visible session name
   - `primary_topic`: Main topic (e.g., "heartbreak", "marriage_strain")
   - `status`: ACTIVE, PAUSED, or COMPLETED
   - `summary_text`: High-level summary of the session
   - `next_plan_text`: What we're exploring next
   - `follow_up_enabled`: Whether daily check-ins are enabled
   - `follow_up_time`: Preferred check-in time (HH:MM format)
   - `last_follow_up_at`: Last time a follow-up was sent

2. **amora_session_messages**: Stores all messages in a session
   - `id` (UUID): Primary key
   - `session_id` (UUID): Foreign key to amora_sessions
   - `sender`: "user" or "amora"
   - `message_text`: The message content
   - `metadata`: JSONB with topics, emotions, response_style, etc.

3. **amora_session_feedback**: Stores user feedback on responses
   - `id` (UUID): Primary key
   - `session_id` (UUID): Foreign key to amora_sessions
   - `message_id` (UUID): Foreign key to amora_session_messages
   - `feedback_type`: "like", "dislike", or "regenerate"
   - `user_id` (UUID): Foreign key to users

## API Endpoints

### Session Management

#### List Sessions
```
GET /api/v1/coach/sessions
```
Returns all sessions for the authenticated user, ordered by most recent.

**Response:**
```json
[
  {
    "id": "sess_123",
    "title": "Breakup with Alex",
    "primary_topic": "heartbreak",
    "status": "ACTIVE",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z",
    "last_message_at": "2024-01-01T10:30:00Z",
    "follow_up_enabled": true,
    "follow_up_time": "09:00",
    "summary_text": "We've been exploring your heartbreak...",
    "next_plan_text": "Next, we're focusing on..."
  }
]
```

#### Create Session
```
POST /api/v1/coach/sessions
```

**Request:**
```json
{
  "title": "Breakup with Alex",
  "primary_topic": "heartbreak",  // Optional, can be auto-detected
  "follow_up_enabled": true,
  "follow_up_time": "09:00"  // Optional, HH:MM format
}
```

**Response:** SessionResponse (same structure as list)

#### Get Session
```
GET /api/v1/coach/sessions/{session_id}
```

Returns full session details including summary and next plan.

#### Update Session
```
PATCH /api/v1/coach/sessions/{session_id}
```

**Request:**
```json
{
  "title": "Updated title",  // Optional
  "status": "PAUSED",  // Optional: ACTIVE, PAUSED, COMPLETED
  "follow_up_enabled": false,  // Optional
  "follow_up_time": "10:00"  // Optional
}
```

### Using Sessions in Coach Endpoint

#### Send Message to Session
```
POST /api/v1/coach/
```

**Request:**
```json
{
  "mode": "LEARN",
  "specific_question": "How can I deal with my breakup?",
  "coach_session_id": "sess_123",  // NEW: Required for multi-session
  "context": {
    "topics": ["heartbreak"],
    "relationship_status": "single"
  }
}
```

**Response:**
```json
{
  "message": "I understand this is a difficult time...",
  "mode": "LEARN",
  "confidence": 0.85,
  "referenced_data": {
    "topics": ["heartbreak", "self-worth"],
    "emotions": ["sadness", "confusion"],
    "response_style": "GROUNDING"
  },
  "engine": "blocks",
  "response_style": "GROUNDING",
  "coach_session_id": "sess_123",  // Echoed back
  "message_id": "msg_456"  // For feedback
}
```

**Important:**
- If `coach_session_id` is provided, the message is saved to that session
- Conversation state is keyed by `(user_id, coach_session_id)` to prevent cross-contamination
- If `coach_session_id` is not provided, falls back to legacy single-session behavior

### Follow-ups

#### Get Due Follow-ups
```
GET /api/v1/coach/sessions/followups/due
```

Returns sessions that are due for a daily check-in.

**Response:**
```json
[
  {
    "coach_session_id": "sess_123",
    "title": "Breakup with Alex",
    "primary_topic": "heartbreak",
    "prompt": "Last time we talked about your breakup with Alex... How have you been feeling?"
  }
]
```

**Logic:**
- Only returns ACTIVE sessions with `follow_up_enabled = true`
- Current time must be after `follow_up_time`
- `last_follow_up_at` must be before today (one follow-up per day)

### Feedback

#### Submit Feedback
```
POST /api/v1/coach/sessions/feedback
```

**Request:**
```json
{
  "message_id": "msg_456",
  "feedback_type": "like"  // "like", "dislike", or "regenerate"
}
```

**Response:**
```json
{
  "success": true,
  "feedback_id": "fb_789",
  "message": "Feedback (like) recorded"
}
```

## Frontend Integration

### Creating a New Session

```typescript
// 1. User creates a new session
const createSession = async (title: string, topic?: string) => {
  const response = await fetch(`${API_URL}/coach/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      primary_topic: topic,
      follow_up_enabled: true,
      follow_up_time: "09:00"
    })
  });
  return await response.json();
};

// 2. Store session ID
const session = await createSession("Breakup with Alex", "heartbreak");
const sessionId = session.id;
```

### Sending Messages

```typescript
// Always include coach_session_id when sending messages
const sendMessage = async (sessionId: string, message: string) => {
  const response = await fetch(`${API_URL}/coach/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: "LEARN",
      specific_question: message,
      coach_session_id: sessionId,  // Required!
      context: {
        topics: [],
        relationship_status: "single"
      }
    })
  });
  const data = await response.json();
  
  // Store message_id for feedback
  const messageId = data.message_id;
  return { response: data.message, messageId };
};
```

### Displaying Session Summary

```typescript
// Get session with summary
const getSession = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/coach/sessions/${sessionId}`);
  return await response.json();
};

// Display:
// - session.summary_text: "What we've worked on"
// - session.next_plan_text: "Where we're going next"
```

### Handling Follow-ups

```typescript
// On app open/login, check for due follow-ups
const checkFollowups = async () => {
  const response = await fetch(`${API_URL}/coach/sessions/followups/due`);
  const followups = await response.json();
  
  if (followups.length > 0) {
    // Show notification: "Amora has a check-in for 'Breakup with Alex'"
    // When user clicks, open that session and optionally pre-fill the prompt
    const sessionId = followups[0].coach_session_id;
    const prompt = followups[0].prompt;
    // Navigate to session and pre-fill prompt
  }
};
```

### Feedback UI

```typescript
// Add feedback buttons to each Amora response
const submitFeedback = async (messageId: string, type: 'like' | 'dislike' | 'regenerate') => {
  await fetch(`${API_URL}/coach/sessions/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message_id: messageId,
      feedback_type: type
    })
  });
};

// In UI:
// - Thumbs up button → submitFeedback(messageId, 'like')
// - Thumbs down button → submitFeedback(messageId, 'dislike')
// - Regenerate button → submitFeedback(messageId, 'regenerate') + call /coach/ again
// - Copy button → navigator.clipboard.writeText(message)
```

## Session State Management

### Conversation State Separation

Each session has its own `ConversationState` keyed by `(user_id, coach_session_id)`:
- Topics history
- Topic stages (progressive depth)
- Recent block IDs (anti-repetition)
- Response style tracking
- Turn counts

**No cross-contamination:** Starting a new session begins with a fresh state.

### Summary Generation

Summaries are automatically generated:
- After every 5 user messages
- Includes: topics, key facts, emotions, what we've explored
- Stored in `summary_text` and `next_plan_text`

## Migration

### Running the Migration

1. Go to Supabase SQL Editor
2. Run `backend/migrations/006_amora_sessions.sql`
3. Verify tables are created:
   - `amora_sessions`
   - `amora_session_messages`
   - `amora_session_feedback`

### Backward Compatibility

- If `coach_session_id` is not provided, the system falls back to legacy behavior
- Uses a default session key: `{user_id}:default`
- Existing frontend code will continue to work (but won't have multi-session features)

## Security

- All endpoints require authentication (`get_user_id_from_auth`)
- RLS policies ensure users can only access their own sessions
- Session ownership is verified on every operation

## Example Flow

1. User creates session: "Breakup with Alex"
2. User sends message: "I'm struggling with my breakup"
3. Amora responds and saves both messages
4. After 5 messages, summary is generated
5. User enables follow-ups at 9:00 AM
6. Next day at 9:00 AM, `/followups/due` returns a check-in prompt
7. User clicks notification, opens session, sees summary
8. User continues conversation
9. User gives feedback (like/dislike) on responses
