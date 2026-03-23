import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import JobForm from '@/components/admin/JobForm'
import JobQuestionsManager from '@/components/admin/JobQuestionsManager'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const admin    = createAdminClientAny()

  const [{ data: job }, { data: categories }, { data: jobQuestions }, { data: clients }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', id).single(),
    supabase.from('job_categories').select('*').order('sort_order'),
    supabase.from('job_questions').select('*, questions(*)').eq('job_id', id).order('sort_order'),
    admin.from('clients').select('id, name').eq('status', 'active').order('name'),
  ])

  if (!job) return notFound()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Edit Job</h1>
        <p className="text-gray-500 mt-1">{job.title}</p>
      </div>
      <JobForm categories={categories || []} clients={clients || []} initialData={job} />
      <JobQuestionsManager jobId={job.id} categoryId={job.category_id} initialQuestions={jobQuestions || []} />
    </div>
  )
}
