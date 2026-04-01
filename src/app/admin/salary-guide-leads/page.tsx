import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { FileText, Users, Mail, Building2, Calendar } from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function SalaryGuideLeadsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const adminClient = createAdminClientAny()
  const { data: leads, error } = await adminClient
    .from('salary_guide_leads')
    .select('*')
    .order('created_at', { ascending: false })

  const totalLeads = leads?.length ?? 0

  // Unique companies
  const uniqueCompanies = new Set(leads?.map((l: { company: string }) => l.company.toLowerCase())).size

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Salary Guide Leads</h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">Companies that downloaded the 2026 LATAM Tech Salary Guide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalLeads}</p>
            <p className="text-sm text-gray-400">Total Leads</p>
          </div>
        </div>
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{uniqueCompanies}</p>
            <p className="text-sm text-gray-400">Unique Companies</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-200">All Leads</h2>
          <span className="text-xs text-gray-500">{totalLeads} total</span>
        </div>

        {error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-red-400 text-sm">Failed to load leads. Please refresh the page.</p>
          </div>
        ) : totalLeads === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No leads yet</p>
            <p className="text-gray-600 text-xs mt-1">Leads will appear here when someone downloads the salary guide</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/50">
                {leads?.map((lead: { id: string; name: string; company: string; email: string; created_at: string }) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-200">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-300">{lead.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {formatDate(lead.created_at)}
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
