import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'

/**
 * Verifies the caller is an authenticated staff member (admin, recruiter, or hiring_manager).
 * Uses admin client for profile lookup to avoid RLS recursion on the profiles table.
 * Returns the user object or null if unauthorized.
 */
export async function requireStaff() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClientAny()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'recruiter', 'hiring_manager'].includes(profile?.role ?? '')) return null
  return user
}

/**
 * Verifies the caller is an authenticated admin.
 * Uses admin client for profile lookup to avoid RLS recursion on the profiles table.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClientAny()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

/**
 * Same as requireStaff but also returns the profile for role-based decisions.
 */
export async function requireStaffWithProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClientAny()
  const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single()
  if (!['admin', 'recruiter', 'hiring_manager'].includes(profile?.role ?? '')) return null
  return { user, profile }
}
