-- Chat transcripts table for SMarty widget
CREATE TABLE IF NOT EXISTS chat_transcripts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  messages    JSONB NOT NULL DEFAULT '[]',
  started_at  TIMESTAMPTZ,
  ended_at    TIMESTAMPTZ DEFAULT now(),
  page_url    TEXT,
  language    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Only service role can read/write (no public access)
ALTER TABLE chat_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON chat_transcripts
  USING (false)
  WITH CHECK (false);
