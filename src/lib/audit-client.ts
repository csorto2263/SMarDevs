/**
 * Client-side audit logger — calls the /api/admin/audit endpoint.
 * Use this from client components (JobsManager, JobActions, AdminNotes, etc.)
 * Fails silently — never blocks the main operation.
 */
export async function logAuditClient({
  entity_type,
  entity_id,
  action,
  metadata,
}: {
  entity_type: string
  entity_id: string
  action: string
  metadata?: Record<string, unknown>
}) {
  try {
    await fetch('/api/admin/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity_type, entity_id, action, metadata }),
    })
  } catch {
    // Silent — audit failures never block
  }
}
