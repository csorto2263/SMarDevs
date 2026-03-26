export const PIPELINE_ORDER = ['applied', 'screening', 'interview', 'technical_review', 'final_interview', 'offer', 'hired'] as const

export function isValidTransition(from: string, to: string): boolean {
  // Rejected and withdrawn allowed from any stage
  if (['rejected', 'withdrawn'].includes(to)) return true
  const fromIdx = PIPELINE_ORDER.indexOf(from as typeof PIPELINE_ORDER[number])
  const toIdx = PIPELINE_ORDER.indexOf(to as typeof PIPELINE_ORDER[number])
  if (fromIdx === -1 || toIdx === -1) return false
  // Only allow moving to the immediate next stage
  return toIdx === fromIdx + 1
}

export function requiresJustification(from: string, to: string): boolean {
  // All transitions require justification
  return from !== to
}
