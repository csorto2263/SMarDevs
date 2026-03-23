-- ============================================================
-- Script: Seed SMarDevs client + assign all jobs & applicants
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. CREATE or UPDATE SMarDevs client
-- Uses a fixed UUID so it's safe to re-run (upsert)
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

-- 2. ASSIGN all jobs (current and future unassigned) to SMarDevs
UPDATE public.jobs
SET client_id = '00000000-0000-0000-0000-000000000001'
WHERE client_id IS NULL;

-- 3. VERIFY
-- Applications are already linked to SMarDevs through their job's client_id.
-- (applications → jobs.client_id → clients)
-- This query shows the count of jobs and applications now linked to SMarDevs:
SELECT
  c.name                                          AS client,
  COUNT(DISTINCT j.id)                            AS total_jobs,
  COUNT(DISTINCT a.id)                            AS total_applications
FROM public.clients c
LEFT JOIN public.jobs j         ON j.client_id  = c.id
LEFT JOIN public.applications a ON a.job_id     = j.id
WHERE c.id = '00000000-0000-0000-0000-000000000001'
GROUP BY c.name;
