import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import JobsManager from '@/components/admin/JobsManager'

export default async function AdminJobsPage() {
  const supabase = await createServerSupabaseClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClientAny()

  // Fetch clients and categories for filter dropdowns
  const [{ data: clients }, { data: categories }] = await Promise.all([
    admin.from('clients').select('id, name').eq('status', 'active').order('name'),
    supabase.from('job_categories').select('id, name').order('name'),
  ])

  return (
    <JobsManager
      initialClients={clients || []}
      initialCategories={categories || []}
    />
  )
}
