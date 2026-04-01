import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/applicant/exams/[assignmentId]/start — Start an exam (returns questions without correct answers)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { assignmentId } = await params
  const admin = createAdminClientAny()

  // Verify profile is applicant
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'applicant') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Find the application for this user
  const { data: application } = await admin
    .from('applications')
    .select('id')
    .eq('applicant_user_id', user.id)
    .single()

  if (!application) {
    return NextResponse.json({ error: 'No application found' }, { status: 404 })
  }

  // Fetch the assignment
  const { data: assignment, error: assignErr } = await admin
    .from('exam_assignments')
    .select('id, application_id, exam_id, status, expires_at, started_at')
    .eq('id', assignmentId)
    .eq('application_id', application.id)
    .single()

  if (assignErr || !assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  // Check if expired
  if (new Date(assignment.expires_at) < new Date()) {
    await admin.from('exam_assignments').update({ status: 'expired' }).eq('id', assignmentId)
    return NextResponse.json({ error: 'This assessment has expired' }, { status: 422 })
  }

  // Check if already completed
  if (assignment.status === 'completed') {
    return NextResponse.json({ error: 'This assessment has already been completed' }, { status: 422 })
  }

  // Check if expired status
  if (assignment.status === 'expired') {
    return NextResponse.json({ error: 'This assessment has expired. Contact the recruiter for reactivation.' }, { status: 422 })
  }

  // Mark as in_progress if not already
  if (assignment.status === 'pending' || assignment.status === 'reactivated') {
    await admin
      .from('exam_assignments')
      .update({ status: 'in_progress', started_at: new Date().toISOString() })
      .eq('id', assignmentId)
  }

  // Fetch exam with questions (WITHOUT correct answers)
  const { data: exam, error: examErr } = await admin
    .from('exams')
    .select(`
      id, title, description, duration_minutes, question_count,
      exam_questions(
        id, question_text, question_type, points, sort_order,
        exam_options(id, option_text, sort_order)
      )
    `)
    .eq('id', assignment.exam_id)
    .single()

  if (examErr || !exam) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
  }

  // Sort questions and options
  if (exam.exam_questions) {
    exam.exam_questions.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    for (const q of exam.exam_questions) {
      if (q.exam_options) {
        q.exam_options.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      }
    }
  }

  // Calculate deadline based on started_at + duration_minutes
  const startedAt = assignment.started_at || new Date().toISOString()
  const deadline = new Date(new Date(startedAt).getTime() + exam.duration_minutes * 60 * 1000)

  // Check if time already ran out (e.g. page reload after timer expired)
  if (deadline < new Date()) {
    // Auto-submit with whatever answers exist
    return NextResponse.json({ error: 'Time is up for this assessment', expired: true }, { status: 422 })
  }

  // Fetch any existing answers (for resume after page reload)
  const { data: existingAnswers } = await admin
    .from('exam_answers')
    .select('question_id, selected_options')
    .eq('assignment_id', assignmentId)

  return NextResponse.json({
    exam,
    assignment_id: assignmentId,
    started_at: startedAt,
    deadline: deadline.toISOString(),
    existing_answers: existingAnswers || [],
    candidate_email: user.email ?? '',
  })
}
