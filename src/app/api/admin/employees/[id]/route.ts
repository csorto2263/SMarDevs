import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

// GET /api/admin/employees/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin   = createAdminClientAny()

  const { data, error } = await admin
    .from('employees')
    .select('*, clients(id, name)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ employee: data })
}

// PATCH /api/admin/employees/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body   = await req.json()
  const admin  = createAdminClientAny()

  const { data: current } = await admin
    .from('employees')
    .select('status, full_name, is_archived, client_id')
    .eq('id', id)
    .single()

  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isArchiving   = body.is_archived === true  && !current.is_archived
  const isUnarchiving = body.is_archived === false && current.is_archived
  const isChangingStatus  = body.status && body.status !== current.status
  const isChangingClient  = body.client_id && body.client_id !== current.client_id

  const updatePayload: Record<string, unknown> = {
    updated_by: caller.id,
    updated_at: new Date().toISOString(),
  }

  const editableFields = [
    'full_name', 'email', 'phone', 'address', 'linkedin_url',
    'role_title', 'role_category', 'seniority', 'start_date',
    'employment_type', 'monthly_salary_usd', 'client_id', 'status', 'is_archived',
  ]
  for (const field of editableFields) {
    if (field in body) updatePayload[field] = body[field]
  }

  if (isArchiving) {
    updatePayload.archived_at = new Date().toISOString()
    updatePayload.archived_by = caller.id
  }
  if (isUnarchiving) {
    updatePayload.archived_at = null
    updatePayload.archived_by = null
  }

  const { data, error } = await admin
    .from('employees')
    .update(updatePayload)
    .eq('id', id)
    .select('*, clients(id, name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let action = 'update'
  if (isArchiving)   action = 'archive'
  if (isUnarchiving) action = 'unarchive'
  if (isChangingStatus)  action = 'status_change'
  if (isChangingClient)  action = 'reassign_client'

  await logAudit({
    entity_type: 'employee', entity_id: id, action,
    performed_by: caller.id,
    metadata: {
      full_name: current.full_name,
      ...(isChangingStatus ? { old_status: current.status, new_status: body.status } : {}),
      ...(isChangingClient ? { old_client_id: current.client_id, new_client_id: body.client_id } : {}),
    }
  })

  return NextResponse.json({ employee: data })
}
