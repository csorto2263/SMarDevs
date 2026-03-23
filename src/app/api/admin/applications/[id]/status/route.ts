import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'

async function requireStaff() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!['admin', 'recruiter', 'hiring_manager'].includes(profile?.role ?? '')) return null
  return user
}

// Which transitions require a written justification (min 80 chars)
function requiresJustification(from: string, to: string): boolean {
  // Terminal/critical destinations always require comment
  if (['rejected', 'hired', 'withdrawn'].includes(to)) return true
  // Moves from advanced stages require comment
  if (['technical_review', 'final_interview', 'offer'].includes(from)) return true
  // Moves INTO advanced stages require comment
  if (['technical_review', 'final_interview', 'offer'].includes(to)) return true
  return false
}

const VALID_STATUSES = [
  'applied', 'screening', 'interview', 'technical_review',
  'final_interview', 'offer', 'hired', 'rejected', 'withdrawn',
]

// POST /api/admin/applications/[id]/status
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body   = await req.json()
  const { new_status, comment, hire_data } = body

  if (!new_status || !VALID_STATUSES.includes(new_status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const admin = createAdminClientAny()

  // Fetch current application
  const { data: application, error: fetchErr } = await admin
    .from('applications')
    .select('id, status, first_name, last_name, email, job_id, jobs(title, client_id)')
    .eq('id', id)
    .single()

  if (fetchErr || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  const currentStatus = application.status as string

  if (currentStatus === new_status) {
    return NextResponse.json({ error: 'Status is already set to that value' }, { status: 400 })
  }

  // Validate comment requirement
  if (requiresJustification(currentStatus, new_status)) {
    const trimmed = (comment || '').trim()
    if (trimmed.length < 80) {
      return NextResponse.json(
        { error: 'A justification of at least 80 characters is required for this transition.' },
        { status: 422 }
      )
    }
  }

  // If hiring, validate hire_data
  if (new_status === 'hired') {
    if (!hire_data?.client_id) {
      return NextResponse.json({ error: 'A client must be assigned when hiring.' }, { status: 422 })
    }
  }

  const now = new Date().toISOString()
  const trimmedComment = (comment || '').trim() || null

  // 1. Update application status
  const { error: updateErr } = await admin
    .from('applications')
    .update({
      status:                  new_status,
      last_status_comment:     trimmedComment,
      last_status_changed_at:  now,
      last_status_changed_by:  caller.id,
      updated_at:              now,
    })
    .eq('id', id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // 2. Insert history entry
  await admin.from('application_status_history').insert({
    application_id: id,
    from_status:    currentStatus,
    to_status:      new_status,
    changed_by:     caller.id,
    note:           trimmedComment,
    created_at:     now,
  })

  // 3. If hired — create employee record
  let newEmployee = null
  if (new_status === 'hired' && hire_data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = application as any
    const { data: emp, error: empErr } = await admin
      .from('employees')
      .insert({
        full_name:          `${app.first_name} ${app.last_name}`,
        email:              app.email,
        role_title:         hire_data.role_title,
        role_category:      hire_data.role_category   || null,
        seniority:          hire_data.seniority        || null,
        start_date:         hire_data.start_date       || null,
        employment_type:    hire_data.employment_type  || null,
        monthly_salary_usd: hire_data.monthly_salary_usd ? Number(hire_data.monthly_salary_usd) : null,
        client_id:          hire_data.client_id,
        source_application_id: id,
        status:             'active',
        is_archived:        false,
        created_by:         caller.id,
        updated_by:         caller.id,
      })
      .select('*, clients(id, name)')
      .single()

    if (empErr) {
      console.error('[status/route] Employee creation failed:', empErr.message)
    } else {
      newEmployee = emp
      await logAudit({
        entity_type: 'employee', entity_id: emp.id, action: 'hire_confirmation',
        performed_by: caller.id,
        metadata: { application_id: id, client_id: hire_data.client_id }
      })
    }
  }

  // 4. Audit log for status change
  await logAudit({
    entity_type: 'application', entity_id: id, action: 'status_change',
    performed_by: caller.id,
    metadata: {
      from_status: currentStatus,
      to_status:   new_status,
      comment:     trimmedComment,
    }
  })

  return NextResponse.json({
    success:  true,
    new_status,
    employee: newEmployee,
  })
}
