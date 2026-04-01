-- ============================================================================
-- Migration 007: Evaluation System
-- Adds exam catalog, question bank, assignments, attempts, and answers tables
-- for the technical review stage of the applicant pipeline.
-- ============================================================================

-- ── 1. Add 'applicant' role to profiles ──────────────────────────────────────
-- First update any NULL roles to 'admin' so constraint can be applied
UPDATE profiles SET role = 'admin' WHERE role IS NULL;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'recruiter', 'hiring_manager', 'applicant'));

-- ── 2. Exam Categories ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exam_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on exam_categories" ON exam_categories
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated read exam_categories" ON exam_categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 3. Exams ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exams (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      UUID NOT NULL REFERENCES exam_categories(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  passing_score    INT NOT NULL DEFAULT 70,
  question_count   INT NOT NULL DEFAULT 10,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_by       UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_exams_category ON exams(category_id);
CREATE INDEX idx_exams_active ON exams(is_active);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on exams" ON exams
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated read exams" ON exams
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 4. Exam Questions ────────────────────────────────────────────────────────
-- question_type: 'single_choice' or 'multiple_choice'
CREATE TABLE IF NOT EXISTS exam_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id       UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice'
    CHECK (question_type IN ('single_choice', 'multiple_choice')),
  points        INT NOT NULL DEFAULT 1,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);

ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on exam_questions" ON exam_questions
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated read exam_questions" ON exam_questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 5. Exam Options (choices for each question) ─────────────────────────────
CREATE TABLE IF NOT EXISTS exam_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT false,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_exam_options_question ON exam_options(question_id);

ALTER TABLE exam_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on exam_options" ON exam_options
  FOR ALL USING (auth.role() = 'service_role');
-- Applicants can read options (but NOT is_correct) — handled at API level
CREATE POLICY "Authenticated read exam_options" ON exam_options
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 6. Exam Assignments (link exams to applications) ─────────────────────────
-- One row per exam assigned to an applicant
CREATE TABLE IF NOT EXISTS exam_assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  exam_id         UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  assigned_by     UUID NOT NULL REFERENCES auth.users(id),
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'expired', 'reactivated')),
  expires_at      TIMESTAMPTZ NOT NULL,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  score           NUMERIC(5,2),
  total_points    INT,
  earned_points   INT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(application_id, exam_id)
);

CREATE INDEX idx_exam_assignments_application ON exam_assignments(application_id);
CREATE INDEX idx_exam_assignments_exam ON exam_assignments(exam_id);
CREATE INDEX idx_exam_assignments_status ON exam_assignments(status);

ALTER TABLE exam_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on exam_assignments" ON exam_assignments
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated read own exam_assignments" ON exam_assignments
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 7. Exam Answers (applicant answers per question) ─────────────────────────
CREATE TABLE IF NOT EXISTS exam_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   UUID NOT NULL REFERENCES exam_assignments(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  selected_options UUID[] NOT NULL DEFAULT '{}',
  is_correct      BOOLEAN,
  points_earned   INT DEFAULT 0,
  answered_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assignment_id, question_id)
);

CREATE INDEX idx_exam_answers_assignment ON exam_answers(assignment_id);

ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on exam_answers" ON exam_answers
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated read own exam_answers" ON exam_answers
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 8. Add applicant_user_id to applications table ───────────────────────────
-- Links an application to a Supabase auth user (created when moving to technical_review)
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_user ON applications(applicant_user_id);

-- ── 9. Seed exam categories matching existing job categories ─────────────────
INSERT INTO exam_categories (name, description) VALUES
  ('Frontend Development', 'HTML, CSS, JavaScript, React, Vue, Angular, etc.'),
  ('Backend Development', 'Node.js, Python, Java, APIs, databases, etc.'),
  ('Full Stack Development', 'Combined frontend and backend skills'),
  ('Software Engineering', 'Design patterns, algorithms, system design, etc.'),
  ('QA Manual Testing', 'Test planning, test cases, bug reporting, etc.'),
  ('QA Automation', 'Selenium, Cypress, Playwright, test frameworks, etc.'),
  ('DevOps & Cloud', 'CI/CD, Docker, Kubernetes, AWS, Azure, etc.'),
  ('UI/UX Design', 'Design principles, prototyping, user research, etc.'),
  ('Project Management', 'Agile, Scrum, stakeholder management, etc.'),
  ('Business Analysis', 'Requirements gathering, documentation, process modeling, etc.'),
  ('Data Engineering', 'ETL, data pipelines, SQL, data warehousing, etc.'),
  ('Mobile Development', 'iOS, Android, React Native, Flutter, etc.'),
  ('Cybersecurity', 'Security principles, penetration testing, compliance, etc.')
ON CONFLICT (name) DO NOTHING;

-- ── 10. Updated_at trigger for new tables ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  CREATE TRIGGER update_exam_categories_updated_at BEFORE UPDATE ON exam_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_exam_assignments_updated_at BEFORE UPDATE ON exam_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
