/**
 * Evaluation System — Shared utilities
 */

/**
 * Generate a password for an applicant portal account
 * Pattern: FirstName + 2-char position abbreviation + year + correlative number
 * Example: Carlos.FE.2026.001
 */
export function generateApplicantPassword(
  firstName: string,
  jobTitle: string,
  correlative: number
): string {
  const name = firstName.trim().split(' ')[0] // First word only
  const abbr = getPositionAbbreviation(jobTitle)
  const year = new Date().getFullYear()
  const seq  = String(correlative).padStart(3, '0')
  return `${name}.${abbr}.${year}.${seq}`
}

/**
 * Extract a 2-character abbreviation from the job title/category
 */
function getPositionAbbreviation(title: string): string {
  const lower = title.toLowerCase()

  const map: Record<string, string> = {
    'frontend':   'FE',
    'front-end':  'FE',
    'front end':  'FE',
    'backend':    'BE',
    'back-end':   'BE',
    'back end':   'BE',
    'full stack':  'FS',
    'fullstack':   'FS',
    'full-stack':  'FS',
    'devops':      'DO',
    'dev ops':     'DO',
    'qa':          'QA',
    'quality':     'QA',
    'test':        'QA',
    'mobile':      'MB',
    'ios':         'MB',
    'android':     'MB',
    'flutter':     'MB',
    'react native':'MB',
    'ui/ux':       'UX',
    'ui':          'UX',
    'ux':          'UX',
    'design':      'UX',
    'project':     'PM',
    'scrum':       'PM',
    'product':     'PM',
    'data':        'DA',
    'machine learning': 'ML',
    'ai':          'AI',
    'security':    'SC',
    'cyber':       'SC',
    'business':    'BA',
    'analyst':     'BA',
    'software':    'SE',
    'engineer':    'SE',
  }

  for (const [keyword, abbr] of Object.entries(map)) {
    if (lower.includes(keyword)) return abbr
  }

  // Fallback: take first 2 consonants of the title
  const consonants = title.replace(/[^bcdfghjklmnpqrstvwxyz]/gi, '')
  return (consonants.substring(0, 2) || 'XX').toUpperCase()
}

/**
 * Check if all assigned exams for an application are completed
 */
export function allExamsCompleted(
  assignments: { status: string }[]
): boolean {
  if (assignments.length === 0) return false
  return assignments.every(a => a.status === 'completed')
}

/**
 * Format exam status for display
 */
export function examStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending:      'Pending',
    in_progress:  'In Progress',
    completed:    'Completed',
    expired:      'Expired',
    reactivated:  'Reactivated',
  }
  return labels[status] || status
}

export function examStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending:      'bg-gray-100 text-gray-700 border-gray-200',
    in_progress:  'bg-blue-100 text-blue-700 border-blue-200',
    completed:    'bg-green-100 text-green-700 border-green-200',
    expired:      'bg-red-100 text-red-700 border-red-200',
    reactivated:  'bg-amber-100 text-amber-700 border-amber-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}
