import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/applicant/exams/[assignmentId]/submit
// Body: { answers: { question_id: string, selected_options: string[] }[] }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { assignmentId } = await params
  const { answers } = await req.json()
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

  // Find application
  const { data: application } = await admin
    .from('applications')
    .select('id')
    .eq('applicant_user_id', user.id)
    .single()

  if (!application) {
    return NextResponse.json({ error: 'No application found' }, { status: 404 })
  }

  // Fetch assignment
  const { data: assignment, error: assignErr } = await admin
    .from('exam_assignments')
    .select('id, application_id, exam_id, status, started_at')
    .eq('id', assignmentId)
    .eq('application_id', application.id)
    .single()

  if (assignErr || !assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  if (assignment.status === 'completed') {
    return NextResponse.json({ error: 'This assessment has already been submitted' }, { status: 422 })
  }

  if (!['in_progress', 'pending', 'reactivated'].includes(assignment.status)) {
    return NextResponse.json({ error: 'This assessment cannot be submitted in its current state' }, { status: 422 })
  }

  // Fetch all questions with correct options for grading
  const { data: questions } = await admin
    .from('exam_questions')
    .select('id, points, question_type, exam_options(id, is_correct)')
    .eq('exam_id', assignment.exam_id)

  if (!questions) {
    return NextResponse.json({ error: 'Failed to load exam questions' }, { status: 500 })
  }

  // Grade answers
  let totalPoints = 0
  let earnedPoints = 0
  const answersToInsert = []

  for (const q of questions) {
    totalPoints += q.points

    const answer = (answers || []).find((a: { question_id: string }) => a.question_id === q.id)
    const selectedOptions: string[] = answer?.selected_options || []

    // Get correct option IDs
    const correctOptionIds = (q.exam_options || [])
      .filter((o: { is_correct: boolean }) => o.is_correct)
      .map((o: { id: string }) => o.id)

    // Check correctness
    let isCorrect = false
    if (q.question_type === 'single_choice') {
      isCorrect = selectedOptions.length === 1 && correctOptionIds.includes(selectedOptions[0])
    } else {
      // multiple_choice: all correct selected, no incorrect selected
      const selectedSet = new Set(selectedOptions)
      const correctSet = new Set(correctOptionIds)
      isCorrect = selectedSet.size === correctSet.size &&
        [...selectedSet].every(id => correctSet.has(id))
    }

    const pointsEarned = isCorrect ? q.points : 0
    earnedPoints += pointsEarned

    answersToInsert.push({
      assignment_id: assignmentId,
      question_id: q.id,
      selected_options: selectedOptions,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      answered_at: new Date().toISOString(),
    })
  }

  // Upsert answers (in case of partial saves)
  for (const ans of answersToInsert) {
    await admin
      .from('exam_answers')
      .upsert(ans, { onConflict: 'assignment_id,question_id' })
  }

  // Calculate score percentage
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100 * 100) / 100 : 0

  // Update assignment as completed
  await admin
    .from('exam_assignments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      score,
      total_points: totalPoints,
      earned_points: earnedPoints,
    })
    .eq('id', assignmentId)

  return NextResponse.json({
    success: true,
    score,
    earned_points: earnedPoints,
    total_points: totalPoints,
    passed: score >= 70, // informational only, doesn't block pipeline
  })
}
