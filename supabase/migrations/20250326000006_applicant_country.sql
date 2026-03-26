-- Add country column to applications for flag display
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS country TEXT;

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_applications_country ON public.applications(country);
