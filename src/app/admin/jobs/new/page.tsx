import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import JobForm from '@/components/admin/JobForm'

export default async function NewJobPage() {
  const supabase = await createServerSupabaseClient()
  const admin    = createAdminClientAny()

  const [{ data: categories }, { data: clients }] = await Promise.all([
    supabase.from('job_categories').select('*').order('sort_order'),
    admin.from('clients').select('id, name').eq('status', 'active').order('name'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Create New Job</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create a new position</p>
      </div>
      <JobForm categories={categories || []} clients={clients || []} />
    </div>
  )
}
