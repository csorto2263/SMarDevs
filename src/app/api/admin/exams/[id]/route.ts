import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { requireStaff } from '@/lib/auth'

// GET /api/admin/exams/[id] — Get exam with all questions and options
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin = createAdminClientAny()

  const { data: exam, error } = await admin
    .from('exams')
    .select(`
      *,
      exam_categories(id, name),
      exam_questions(
        id, question_text, question_type, points, sort_order,
        exam_options(id, option_text, is_correct, sort_order)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !exam) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
  }

  // Sort questions and options by sort_order
  if (exam.exam_questions) {
    exam.exam_questions.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    for (const q of exam.exam_questions) {
      if (q.exam_options) {
        q.exam_options.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      }
    }
  }

  // Also fetch assignment stats
  const { count: totalAssignments } = await admin
    .from('exam_assignments')
    .select('id', { count: 'exact', head: true })
    .eq('exam_id', id)

  const { count: completedAssignments } = await admin
    .from('exam_assignments')
    .select('id', { count: 'exact', head: true })
    .eq('exam_id', id)
    .eq('status', 'completed')

  return NextResponse.json({
    exam,
    stats: {
      total_assignments: totalAssignments ?? 0,
      completed_assignments: completedAssignments ?? 0,
    },
  })
}

// PATCH /api/admin/exams/[id] — Update exam metadata and optionally replace questions
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const admin = createAdminClientAny()

  const allowedFields = ['title', 'description', 'duration_minutes', 'passing_score', 'is_active', 'category_id']
  const updates: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) updates[key] = body[key]
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await admin.from('exams').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If questions provided, replace all questions
  if (Array.isArray(body.questions)) {
    // Delete existing questions (cascade deletes options)
    await admin.from('exam_questions').delete().eq('exam_id', id)

    for (let qi = 0; qi < body.questions.length; qi++) {
      const q = body.questions[qi]
      const { data: qRow, error: qErr } = await admin
        .from('exam_questions')
        .insert({
          exam_id: id,
          question_text: q.question_text,
          question_type: q.question_type,
          points: q.points,
          sort_order: qi,
        })
        .select('id')
        .single()

      if (qErr || !qRow) return NextResponse.json({ error: qErr?.message || 'Failed to insert question' }, { status: 500 })

      const optionsToInsert = q.options.map((opt: { option_text: string; is_correct: boolean }, oi: number) => ({
        question_id: qRow.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        sort_order: oi,
      }))

      const { error: optErr } = await admin.from('exam_options').insert(optionsToInsert)
      if (optErr) return NextResponse.json({ error: optErr.message }, { status: 500 })
    }

    // Update question_count
    await admin.from('exams').update({ question_count: body.questions.length }).eq('id', id)
  }

  const { data } = await admin.from('exams').select().eq('id', id).single()

  await logAudit({
    entity_type: 'exam',
    entity_id: id,
    action: 'update',
    performed_by: caller.id,
    metadata: { ...updates, questions_updated: Array.isArray(body.questions) },
  })

  return NextResponse.json({ exam: data })
}

// DELETE /api/admin/exams/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin = createAdminClientAny()

  // Check no active assignments
  const { count } = await admin
    .from('exam_assignments')
    .select('id', { count: 'exact', head: true })
    .eq('exam_id', id)
    .in('status', ['pending', 'in_progress'])

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: 'Cannot delete exam with active assignments. Deactivate it instead.' },
      { status: 422 }
    )
  }

  const { error } = await admin.from('exams').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    entity_type: 'exam',
    entity_id: id,
    action: 'delete',
    performed_by: caller.id,
  })

  return NextResponse.json({ success: true })
}
