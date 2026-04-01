-- Fix infinite recursion in profiles RLS policy
-- The "Admins can view all profiles" policy was self-referencing, causing infinite recursion
-- Replace it with a security definer function to break the cycle

-- Create a security definer function that checks admin role without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop and recreate the admin view-all policy to use the security definer function
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (public.is_admin_user());
