/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, ExternalLink, FileText, Mail, Building2 } from 'lucide-react'
import ApplicantFilters from '@/components/admin/ApplicantFilters'
import { countryFlagUrl, countryCodeFromName, inferCountryFromPhone, COUNTRIES } from '@/lib/countries'

const statusLabels: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  technical_review: 'Technical Review',
  final_interview: 'Final Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

const statusColors: Record<string, string> = {
  applied: 'bg-gray-100 text-gray-700',
  screening: 'bg-blue-100 text-blue-700',
  interview: 'bg-indigo-100 text-indigo-700',
  technical_review: 'bg-purple-100 text-purple-700',
  final_interview: 'bg-amber-100 text-amber-700',
  offer: 'bg-emerald-100 text-emerald-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-500',
}

export default async function AdminApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; status?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerSupabaseClient()

  // Fetch all jobs for filter dropdown
  const { data: allJobs } = await supabase.from('jobs').select('id, title').order('title')

  // Build query
  let query = supabase
    .from('applications')
    .select('*, jobs(id, title, slug, clients(id, name))')
    .order('created_at', { ascending: false })

  if (params.job) {
    query = query.eq('job_id', params.job)
  }
  if (params.status) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = query.eq('status', params.status as any)
  }

  const { data: applicants } = await query

  // Client-side search filter applied in component
  let filtered = applicants || []
  if (params.search) {
    const s = params.search.toLowerCase()
    filtered = filtered.filter((a: any) =>
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(s) ||
      a.email.toLowerCase().includes(s)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Applicants</h1>
        <p className="text-gray-500 mt-1">{filtered.length} candidate{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <ApplicantFilters
        jobs={allJobs || []}
        currentJob={params.job}
        currentStatus={params.status}
        currentSearch={params.search}
      />

      {/* Applicants list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-950 mb-1">No applicants found</h3>
            <p className="text-gray-500 text-sm">
              {params.job || params.status || params.search
                ? 'Try adjusting your filters'
                : 'Applications will appear here as candidates apply'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">English</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary Exp.</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((app: any) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/applicants/${app.id}`} className="group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0">
                            {app.first_name.charAt(0)}{app.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-navy-950 group-hover:text-brand-600 transition-colors">
                              {app.first_name} {app.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{app.email}</p>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{app.jobs?.title || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {app.jobs?.clients ? (
                        <Link
                          href={`/admin/clients/${app.jobs.clients.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-600 transition-colors font-medium"
                        >
                          <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {app.jobs.clients.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{app.english_level || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const countryName = app.country && app.country !== 'Other' ? app.country : null
                        const code = countryName ? countryCodeFromName(countryName) : inferCountryFromPhone(app.phone)
                        const displayName = countryName || COUNTRIES.find(c => c.code === code)?.name || code
                        return code ? (
                          <span className="inline-flex items-center gap-1.5" title={displayName || ''}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={countryFlagUrl(code)} alt={displayName || code} className="w-5 h-auto rounded-sm shadow-sm" />
                            <span className="text-xs text-gray-500">{code}</span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )
                      })()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {app.salary_expectation ? `$${app.salary_expectation.toLocaleString()}/mo` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {app.resume_url && (
                          <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Resume">
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        {app.linkedin_url && (
                          <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="LinkedIn">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <a href={`mailto:${app.email}`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Email">
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
