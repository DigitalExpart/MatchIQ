-- Add pinned field to amora_sessions table
-- Allows users to pin sessions to the top of their list

ALTER TABLE amora_sessions 
ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;

-- Create index for pinned sessions
CREATE INDEX IF NOT EXISTS idx_amora_sessions_pinned ON amora_sessions(pinned) WHERE pinned = TRUE;

-- Update ordering: pinned sessions first, then by updated_at
-- This will be handled in the application code
