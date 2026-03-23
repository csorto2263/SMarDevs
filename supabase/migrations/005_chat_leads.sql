-- Structured leads/candidates captured by SMarty chatbot
CREATE TABLE IF NOT EXISTS chat_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('company', 'candidate')),

  -- Shared fields
  full_name       TEXT,
  email           TEXT,

  -- Company path fields
  company_name    TEXT,
  company_website TEXT,
  role_needed     TEXT,
  positions       TEXT,
  seniority       TEXT,
  timeline        TEXT,

  -- Candidate path fields
  role_interest   TEXT,
  phone           TEXT,

  -- Metadata
  page_url        TEXT,
  language        TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX idx_chat_leads_type ON chat_leads(type);
CREATE INDEX idx_chat_leads_email ON chat_leads(email);
CREATE INDEX idx_chat_leads_created ON chat_leads(created_at DESC);

-- Only service role can read/write
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON chat_leads
  USING (false)
  WITH CHECK (false);
