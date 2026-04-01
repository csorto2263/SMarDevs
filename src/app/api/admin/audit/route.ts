import { NextRequest, NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'
import { requireStaff } from '@/lib/auth'

// POST /api/admin/audit — Generic audit log endpoint for client-side operations
export async function POST(req: NextRequest) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { entity_type, entity_id, action, metadata } = await req.json()

  if (!entity_type || !entity_id || !action) {
    return NextResponse.json({ error: 'entity_type, entity_id, and action are required' }, { status: 400 })
  }

  await logAudit({
    entity_type,
    entity_id,
    action,
    performed_by: caller.id,
    metadata: metadata || null,
  })

  return NextResponse.json({ success: true })
}
