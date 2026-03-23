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

// GET /api/admin/clients/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin = createAdminClientAny()

  const { data, error } = await admin
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ client: data })
}

// PATCH /api/admin/clients/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body   = await req.json()
  const admin  = createAdminClientAny()

  // Fetch current client to detect action
  const { data: current } = await admin.from('clients').select('status, name').eq('id', id).single()
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isArchiving   = body.status === 'archived' && current.status === 'active'
  const isUnarchiving = body.status === 'active'   && current.status === 'archived'

  const updatePayload: Record<string, unknown> = {
    updated_by: caller.id,
    updated_at: new Date().toISOString(),
  }

  // Only allow certain fields to be updated
  const editableFields = [
    'name', 'company_address', 'company_phone', 'website',
    'primary_contact_name', 'primary_contact_email', 'primary_contact_phone',
    'secondary_contact_name', 'secondary_contact_email', 'secondary_contact_phone',
    'status',
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
    .from('clients')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const action = isArchiving ? 'archive' : isUnarchiving ? 'unarchive' : 'update'
  await logAudit({ entity_type: 'client', entity_id: id, action, performed_by: caller.id, metadata: { name: current.name } })

  return NextResponse.json({ client: data })
}
