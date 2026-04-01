import { NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/applicant/exams — List all exam assignments for the logged-in applicant
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check they're an applicant
  const admin = createAdminClientAny()
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'applicant') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Find the application linked to this user
  const { data: application } = await admin
    .from('applications')
    .select('id, first_name, last_name, jobs(title, job_categories(name))')
    .eq('applicant_user_id', user.id)
    .single()

  if (!application) {
    return NextResponse.json({ error: 'No application found' }, { status: 404 })
  }

  // Fetch assignments with exam details
  const { data: assignments, error } = await admin
    .from('exam_assignments')
    .select(`
      id, status, expires_at, started_at, completed_at, score,
      exams(id, title, description, duration_minutes, question_count, exam_categories(name))
    `)
    .eq('application_id', application.id)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Check for expired assignments and update them
  const now = new Date()
  for (const a of (assignments || [])) {
    if (['pending', 'reactivated', 'in_progress'].includes(a.status) && new Date(a.expires_at) < now) {
      await admin
        .from('exam_assignments')
        .update({ status: 'expired' })
        .eq('id', a.id)
      a.status = 'expired'
    }
  }

  return NextResponse.json({
    application: {
      id: application.id,
      name: `${application.first_name} ${application.last_name}`,
      job: (application as any).jobs,
    },
    assignments: assignments || [],
  })
}
