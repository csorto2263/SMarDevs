-- ============================================================
-- SMarDevs ATS — Migration 003
-- Clients, Employees, Audit Logs, Jobs/Applications extensions
-- ============================================================

-- ============================================================
-- 1. CLIENTS
-- ============================================================
CREATE TABLE public.clients (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  company_address         TEXT,
  company_phone           TEXT,
  website                 TEXT,
  primary_contact_name    TEXT,
  primary_contact_email   TEXT,
  primary_contact_phone   TEXT,
  secondary_contact_name  TEXT,
  secondary_contact_email TEXT,
  secondary_contact_phone TEXT,
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by              UUID REFERENCES public.profiles(id),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by              UUID REFERENCES public.profiles(id),
  archived_at             TIMESTAMPTZ,
  archived_by             UUID REFERENCES public.profiles(id)
);

CREATE INDEX idx_clients_status ON public.clients(status);

-- ============================================================
-- 2. EMPLOYEES
-- ============================================================
CREATE TABLE public.employees (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Personal info
  full_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT,
  address               TEXT,
  linkedin_url          TEXT,
  -- Job info
  role_title            TEXT NOT NULL,
  role_category         TEXT,
  seniority             TEXT,
  start_date            DATE,
  employment_type       TEXT,
  monthly_salary_usd    NUMERIC,
  -- Relations
  client_id             UUID NOT NULL REFERENCES public.clients(id),
  source_application_id UUID REFERENCES public.applications(id),
  -- Status
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_archived           BOOLEAN NOT NULL DEFAULT false,
  -- Audit
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by            UUID REFERENCES public.profiles(id),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by            UUID REFERENCES public.profiles(id),
  archived_at           TIMESTAMPTZ,
  archived_by           UUID REFERENCES public.profiles(id)
);

CREATE INDEX idx_employees_client ON public.employees(client_id);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_employees_archived ON public.employees(is_archived);
CREATE INDEX idx_employees_source_application ON public.employees(source_application_id);

-- ============================================================
-- 3. CLIENT NOTES
-- ============================================================
CREATE TABLE public.client_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  author_id    UUID NOT NULL REFERENCES public.profiles(id),
  content      TEXT NOT NULL,
  is_private   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_client_notes_client ON public.client_notes(client_id);

-- ============================================================
-- 4. AUDIT LOGS
-- ============================================================
CREATE TABLE public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  TEXT NOT NULL,   -- 'client' | 'employee' | 'job' | 'application' | 'user'
  entity_id    UUID NOT NULL,
  action       TEXT NOT NULL,   -- 'create' | 'update' | 'archive' | 'unarchive' | 'status_change'
                                -- | 'hire_confirmation' | 'reassign_client' | 'edit_job_client'
  performed_by UUID REFERENCES public.profiles(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata     JSONB
);

CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_performed_by ON public.audit_logs(performed_by);
CREATE INDEX idx_audit_performed_at ON public.audit_logs(performed_at);

-- ============================================================
-- 5. EXTEND JOBS — add client_id + updated_by
-- ============================================================
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS client_id  UUID REFERENCES public.clients(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id);

CREATE INDEX idx_jobs_client ON public.jobs(client_id);

-- ============================================================
-- 6. EXTEND APPLICATIONS — last status comment tracking
-- ============================================================
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS last_status_comment    TEXT,
  ADD COLUMN IF NOT EXISTS last_status_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_status_changed_by UUID REFERENCES public.profiles(id);

-- ============================================================
-- 7. DROP OLD AUTO-TRIGGER (API route handles history now)
--    This avoids duplicate history entries.
--    All future history is written by /api/admin/applications/[id]/status
-- ============================================================
DROP TRIGGER IF EXISTS on_application_status_change ON public.applications;
DROP FUNCTION IF EXISTS public.log_status_change();

-- ============================================================
-- 8. UPDATED_AT TRIGGERS for new tables
-- ============================================================
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_client_notes_updated_at
  BEFORE UPDATE ON public.client_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.clients    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- CLIENTS — admin only
CREATE POLICY "Admins can manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EMPLOYEES — admin only
CREATE POLICY "Admins can manage employees" ON public.employees
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CLIENT NOTES — admin + recruiter
CREATE POLICY "Admins can manage client notes" ON public.client_notes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
  );

-- AUDIT LOGS — admin read/write via API (service role), admin view
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Service role can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 10. SEED — SMarDevs internal client
-- ============================================================
INSERT INTO public.clients (
  id,
  name,
  company_address,
  company_phone,
  website,
  primary_contact_name,
  primary_contact_email,
  primary_contact_phone,
  secondary_contact_name,
  secondary_contact_email,
  secondary_contact_phone,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SMarDevs',
  'Maryland, US',
  '+1 (504) 333-1465',
  'https://smardevs.com',
  'Marvin Ortega',
  'marvin@smardevs.com',
  '+1 (504) 333-1465',
  'Carlos Sorto',
  'carlos.sorto@easylifehn.com',
  '+1 (504) 333-1465',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  name                    = EXCLUDED.name,
  company_address         = EXCLUDED.company_address,
  company_phone           = EXCLUDED.company_phone,
  website                 = EXCLUDED.website,
  primary_contact_name    = EXCLUDED.primary_contact_name,
  primary_contact_email   = EXCLUDED.primary_contact_email,
  primary_contact_phone   = EXCLUDED.primary_contact_phone,
  secondary_contact_name  = EXCLUDED.secondary_contact_name,
  secondary_contact_email = EXCLUDED.secondary_contact_email,
  secondary_contact_phone = EXCLUDED.secondary_contact_phone,
  status                  = EXCLUDED.status;

-- ============================================================
-- 11. MIGRATE — assign all existing jobs to SMarDevs client
-- ============================================================
UPDATE public.jobs
SET client_id = '00000000-0000-0000-0000-000000000001'
WHERE client_id IS NULL;
