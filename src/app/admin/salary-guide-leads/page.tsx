import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { BarChart2, Users, Mail, Building2 } from 'lucide-react'

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
  const uniqueCompanies = new Set(leads?.map((l: { company: string }) => l.company.toLowerCase())).size

  const stats = [
    { label: 'Total Leads',       value: totalLeads,       icon: Users,     color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Unique Companies',  value: uniqueCompanies,  icon: Building2, color: 'bg-purple-500/10 text-purple-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Salary Guide Leads</h1>
        <p className="text-gray-500 mt-1">Companies that downloaded the 2026 LATAM Tech Salary Guide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-5 text-center"
          >
            <div className="flex justify-center mb-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy-950">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-navy-950">All Leads</h2>
          </div>
          <span className="text-xs text-gray-400">{totalLeads} total</span>
        </div>

        {error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-red-500 text-sm">Failed to load leads. Please refresh the page.</p>
          </div>
        ) : totalLeads === 0 ? (
          <div className="px-6 py-16 text-center">
            <BarChart2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No leads yet</p>
            <p className="text-gray-400 text-xs mt-1">Leads will appear here when someone downloads the salary guide</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads?.map((lead: { id: string; name: string; company: string; email: string; created_at: string }) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-navy-950">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600">{lead.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(lead.created_at)}</span>
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
