-- Migration: salary_guide_leads table
-- Stores leads who requested the LATAM Tech Salary Guide PDF

CREATE TABLE IF NOT EXISTS public.salary_guide_leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  company       TEXT NOT NULL,
  email         TEXT NOT NULL,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: only service role can read/write (admin API uses service role key)
ALTER TABLE public.salary_guide_leads ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated access — only service role bypasses RLS
-- Admins interact via service-role API routes only
