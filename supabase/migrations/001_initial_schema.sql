-- ============================================================
-- SMarDevs ATS - Database Schema
-- ============================================================

-- Enable necessary extensions


-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'recruiter', 'hiring_manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. JOB CATEGORIES
-- ============================================================
CREATE TABLE public.job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- lucide icon name
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. JOBS
-- ============================================================
CREATE TYPE public.job_status AS ENUM ('draft', 'published', 'closed', 'archived');
CREATE TYPE public.job_modality AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE public.job_seniority AS ENUM ('junior', 'mid', 'senior', 'lead', 'principal');
CREATE TYPE public.job_contract AS ENUM ('full_time_contractor', 'part_time_contractor', 'full_time_employee', 'part_time_employee');

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES public.job_categories(id),
  department TEXT,
  status public.job_status NOT NULL DEFAULT 'draft',
  modality public.job_modality NOT NULL DEFAULT 'remote',
  location TEXT NOT NULL DEFAULT 'Remote - LATAM',
  seniority public.job_seniority NOT NULL DEFAULT 'mid',
  contract_type public.job_contract NOT NULL DEFAULT 'full_time_contractor',
  summary TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  preferred_qualifications TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT DEFAULT 'monthly',
  show_salary BOOLEAN DEFAULT false,
  application_count INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_category ON public.jobs(category_id);
CREATE INDEX idx_jobs_slug ON public.jobs(slug);

-- ============================================================
-- 4. QUESTIONS
-- ============================================================
CREATE TYPE public.question_type AS ENUM ('text', 'textarea', 'select', 'radio', 'checkbox', 'number', 'url', 'file');

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.job_categories(id),
  question_text TEXT NOT NULL,
  question_type public.question_type NOT NULL DEFAULT 'text',
  options JSONB, -- for select/radio/checkbox: ["option1", "option2"]
  placeholder TEXT,
  helper_text TEXT,
  is_default BOOLEAN DEFAULT true, -- included by default in the pack
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. JOB QUESTIONS (per-job question assignments)
-- ============================================================
CREATE TABLE public.job_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  UNIQUE(job_id, question_id)
);

CREATE INDEX idx_job_questions_job ON public.job_questions(job_id);

-- ============================================================
-- 6. APPLICATIONS
-- ============================================================
CREATE TYPE public.application_status AS ENUM (
  'applied', 'screening', 'interview', 'technical_review', 'final_interview', 'offer', 'hired', 'rejected', 'withdrawn'
);

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  -- Personal info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  headline TEXT,
  address TEXT,
  -- Profile
  resume_url TEXT,
  resume_filename TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  cover_letter TEXT,
  -- Details
  salary_expectation NUMERIC,
  is_latam BOOLEAN,
  english_level TEXT,
  availability TEXT,
  -- Status
  status public.application_status NOT NULL DEFAULT 'applied',
  rating INT CHECK (rating >= 1 AND rating <= 5),
  -- Meta
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_email ON public.applications(email);

-- ============================================================
-- 7. APPLICATION ANSWERS (dynamic question responses)
-- ============================================================
CREATE TABLE public.application_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id),
  answer_text TEXT,
  answer_json JSONB, -- for multi-select answers
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_application ON public.application_answers(application_id);

-- ============================================================
-- 8. APPLICATION STATUS HISTORY
-- ============================================================
CREATE TABLE public.application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  from_status public.application_status,
  to_status public.application_status NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_history_application ON public.application_status_history(application_id);

-- ============================================================
-- 9. ADMIN NOTES
-- ============================================================
CREATE TABLE public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_application ON public.admin_notes(application_id);

-- ============================================================
-- 10. UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_admin_notes_updated_at BEFORE UPDATE ON public.admin_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 11. INCREMENT APPLICATION COUNT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_application_created
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.increment_application_count();

-- ============================================================
-- 12. AUTO-LOG STATUS CHANGES
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_status_history (application_id, from_status, to_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_status_change();

-- ============================================================
-- 13. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Job Categories: public read, admin write
CREATE POLICY "Anyone can view categories" ON public.job_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON public.job_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- Jobs: public can see published, admins can see all
CREATE POLICY "Anyone can view published jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can view all jobs" ON public.jobs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- Questions: public read (for forms), admin write
CREATE POLICY "Anyone can view questions" ON public.questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage questions" ON public.questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- Job Questions: public read (for forms), admin write
CREATE POLICY "Anyone can view job questions" ON public.job_questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage job questions" ON public.job_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- Applications: anyone can insert (apply), admins can read/update
CREATE POLICY "Anyone can submit applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view applications" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'hiring_manager'))
);
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- Application Answers: anyone can insert, admins can read
CREATE POLICY "Anyone can submit answers" ON public.application_answers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view answers" ON public.application_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'hiring_manager'))
);

-- Status History: admin only
CREATE POLICY "Admins can view status history" ON public.application_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'hiring_manager'))
);
CREATE POLICY "Admins can insert status history" ON public.application_status_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- Admin Notes: admin only
CREATE POLICY "Admins can manage notes" ON public.admin_notes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'hiring_manager'))
);

-- ============================================================
-- 14. STORAGE BUCKET FOR RESUMES
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Admins can view resumes" ON storage.objects FOR SELECT USING (
  bucket_id = 'resumes' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'hiring_manager'))
);
CREATE POLICY "Admins can delete resumes" ON storage.objects FOR DELETE USING (
  bucket_id = 'resumes' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);
