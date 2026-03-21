-- Fix all RLS policies that use recursive admin checks
-- Replace them with the SECURITY DEFINER is_admin() function

-- ── JOB CATEGORIES ──
DROP POLICY IF EXISTS "Admins can manage categories" ON public.job_categories;
CREATE POLICY "Admins can manage categories"
  ON public.job_categories FOR ALL TO authenticated USING (public.is_admin());

-- ── JOBS ──
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;
CREATE POLICY "Admins can view all jobs"
  ON public.jobs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage jobs"
  ON public.jobs FOR ALL TO authenticated USING (public.is_admin());

-- ── QUESTIONS ──
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL TO authenticated USING (public.is_admin());

-- ── JOB QUESTIONS ──
DROP POLICY IF EXISTS "Admins can manage job questions" ON public.job_questions;
CREATE POLICY "Admins can manage job questions"
  ON public.job_questions FOR ALL TO authenticated USING (public.is_admin());

-- ── APPLICATIONS ──
DROP POLICY IF EXISTS "Admins can view applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can view applications"
  ON public.applications FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE TO authenticated USING (public.is_admin());

-- ── APPLICATION ANSWERS ──
DROP POLICY IF EXISTS "Admins can view answers" ON public.application_answers;
CREATE POLICY "Admins can view answers"
  ON public.application_answers FOR SELECT TO authenticated USING (public.is_admin());

-- ── STATUS HISTORY ──
DROP POLICY IF EXISTS "Admins can view status history" ON public.application_status_history;
DROP POLICY IF EXISTS "Admins can insert status history" ON public.application_status_history;
CREATE POLICY "Admins can view status history"
  ON public.application_status_history FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert status history"
  ON public.application_status_history FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- ── ADMIN NOTES ──
DROP POLICY IF EXISTS "Admins can manage notes" ON public.admin_notes;
CREATE POLICY "Admins can manage notes"
  ON public.admin_notes FOR ALL TO authenticated USING (public.is_admin());

-- ── STORAGE ──
DROP POLICY IF EXISTS "Admins can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resumes" ON storage.objects;
CREATE POLICY "Admins can view resumes"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND public.is_admin());
CREATE POLICY "Admins can delete resumes"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND public.is_admin());
