-- Add focus_violations counter to exam_assignments
-- Tracks how many times the candidate switched tabs or lost window focus during an exam

ALTER TABLE exam_assignments
  ADD COLUMN IF NOT EXISTS focus_violations INTEGER NOT NULL DEFAULT 0;
