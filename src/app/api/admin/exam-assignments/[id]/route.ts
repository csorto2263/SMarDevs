import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { requireStaff } from '@/lib/auth'

// PATCH /api/admin/exam-assignments/[id] — Reactivate an expired exam assignment
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { action } = await req.json()

  if (action !== 'reactivate') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const admin = createAdminClientAny()

  // Fetch the assignment
  const { data: assignment, error: fetchErr } = await admin
    .from('exam_assignments')
    .select('id, status, application_id, exam_id')
    .eq('id', id)
    .single()

  if (fetchErr || !assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  if (assignment.status !== 'expired') {
    return NextResponse.json({ error: 'Only expired assignments can be reactivated' }, { status: 422 })
  }

  // Extend by 1 week from now
  const newExpiry = new Date()
  newExpiry.setDate(newExpiry.getDate() + 7)

  const { data, error } = await admin
    .from('exam_assignments')
    .update({
      status: 'reactivated',
      expires_at: newExpiry.toISOString(),
      started_at: null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Delete previous answers so they can retake
  await admin.from('exam_answers').delete().eq('assignment_id', id)

  await logAudit({
    entity_type: 'exam_assignment',
    entity_id: id,
    action: 'reactivate',
    performed_by: caller.id,
    metadata: {
      application_id: assignment.application_id,
      exam_id: assignment.exam_id,
      new_expires_at: newExpiry.toISOString(),
    },
  })

  return NextResponse.json({ assignment: data })
}
