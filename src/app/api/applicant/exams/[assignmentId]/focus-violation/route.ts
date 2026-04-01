import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/applicant/exams/[assignmentId]/focus-violation
// Called each time the candidate leaves the exam tab/window
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { assignmentId } = await params
  const admin = createAdminClientAny()

  // Verify the assignment belongs to this user and is in_progress
  const { data: application } = await admin
    .from('applications')
    .select('id')
    .eq('applicant_user_id', user.id)
    .single()

  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: assignment } = await admin
    .from('exam_assignments')
    .select('id, status, focus_violations')
    .eq('id', assignmentId)
    .eq('application_id', application.id)
    .single()

  if (!assignment || !['in_progress', 'reactivated'].includes(assignment.status)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { error } = await admin
    .from('exam_assignments')
    .update({ focus_violations: (assignment.focus_violations ?? 0) + 1 })
    .eq('id', assignmentId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, focus_violations: (assignment.focus_violations ?? 0) + 1 })
}
