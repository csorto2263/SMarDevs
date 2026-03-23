import { createAdminClientAny } from '@/lib/supabase/admin'

export async function logAudit({
  entity_type,
  entity_id,
  action,
  performed_by,
  metadata,
}: {
  entity_type: string
  entity_id: string
  action: string
  performed_by: string | null
  metadata?: Record<string, unknown>
}) {
  try {
    const admin = createAdminClientAny()
    await admin.from('audit_logs').insert({
      entity_type,
      entity_id,
      action,
      performed_by: performed_by ?? null,
      metadata: metadata ?? null,
    })
  } catch {
    // Audit failures should never break the main operation
    console.error('[audit] Failed to write audit log', { entity_type, entity_id, action })
  }
}
