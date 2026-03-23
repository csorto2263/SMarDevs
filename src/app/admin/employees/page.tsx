import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmployeesManager from '@/components/admin/EmployeesManager'

export default async function AdminEmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const { client_id } = await searchParams

  return <EmployeesManager initialClientId={client_id} />
}
