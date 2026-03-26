import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersManager from '@/components/admin/UsersManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users | SMarDevs Admin' }

export default async function UsersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  return <UsersManager key={Date.now()} />
}
