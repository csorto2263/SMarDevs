/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Building2, Globe, Phone, Mail, User,
  MapPin, Briefcase, Users, CheckCircle2, Plus,
} from 'lucide-react'
import ClientDetailActions from '@/components/admin/ClientDetailActions'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const admin = createAdminClientAny()

  // Fetch client
  const { data: client } = await admin.from('clients').select('*').eq('id', id).single()
  if (!client) return notFound()

  // Fetch related data
  const [{ data: employees }, { data: jobs }, { data: notes }] = await Promise.all([
    admin.from('employees').select('id, full_name, email, role_title, seniority, status, start_date').eq('client_id', id).eq('is_archived', false).order('created_at', { ascending: false }),
    admin.from('jobs').select('id, title, status, application_count, created_at').eq('client_id', id).order('created_at', { ascending: false }),
    admin.from('client_notes').select('*, profiles:author_id(full_name, email)').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  // Hired applicants for this client (via employees' source_application_id)
  const applicationIds = (employees || []).map((e: any) => e.id).filter(Boolean)
  const hiredCount = (employees || []).filter((e: any) => e.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-xl font-bold shrink-0">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-950">{client.name}</h1>
              {client.company_address && (
                <p className="text-gray-500 mt-0.5 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" />
                  {client.company_address}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {client.website && (
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 transition-colors">
                    <Globe className="w-4 h-4" />
                    {client.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {client.company_phone && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    {client.company_phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
              client.status === 'active'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
              {client.status === 'active' ? 'Active' : 'Archived'}
            </span>
            <ClientDetailActions client={client as any} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-950">{employees?.length || 0}</p>
              <p className="text-sm text-gray-500">Active Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-950">{jobs?.length || 0}</p>
              <p className="text-sm text-gray-500">Total Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-950">{hiredCount}</p>
              <p className="text-sm text-gray-500">Hired Candidates</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main sections */}
        <div className="lg:col-span-2 space-y-6">

          {/* Employees */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-950">Employees</h2>
              <Link href={`/admin/employees?client_id=${id}`} className="text-sm text-brand-600 hover:text-brand-700 transition-colors">
                View all
              </Link>
            </div>
            {!employees?.length ? (
              <p className="text-sm text-gray-400">No employees assigned to this client yet.</p>
            ) : (
              <div className="space-y-3">
                {(employees as any[]).slice(0, 5).map(emp => (
                  <Link key={emp.id} href={`/admin/employees/${emp.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                        {emp.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-950 group-hover:text-brand-600 transition-colors">{emp.full_name}</p>
                        <p className="text-xs text-gray-500">{emp.role_title}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${emp.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {emp.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-950">Jobs</h2>
            </div>
            {!jobs?.length ? (
              <p className="text-sm text-gray-400">No jobs associated with this client yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(jobs as any[]).map(job => (
                      <tr key={job.id}>
                        <td className="py-3">
                          <Link href={`/admin/jobs/${job.id}/edit`} className="text-navy-950 hover:text-brand-600 font-medium transition-colors">
                            {job.title}
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            job.status === 'published' ? 'bg-green-100 text-green-700' :
                            job.status === 'draft'     ? 'bg-gray-100 text-gray-600' :
                            job.status === 'closed'    ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{job.application_count || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <ClientNotesSection clientId={id} notes={notes as any[]} userId={user.id} />
        </div>

        {/* Right: contacts */}
        <div className="space-y-6">
          {/* Primary contact */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Primary Contact</h3>
            {client.primary_contact_name ? (
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500">Name</dt>
                  <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                    <User className="w-4 h-4 text-gray-400" />
                    {client.primary_contact_name}
                  </dd>
                </div>
                {client.primary_contact_email && (
                  <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${client.primary_contact_email}`} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors">
                        <Mail className="w-4 h-4" />
                        {client.primary_contact_email}
                      </a>
                    </dd>
                  </div>
                )}
                {client.primary_contact_phone && (
                  <div>
                    <dt className="text-xs text-gray-500">Phone</dt>
                    <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {client.primary_contact_phone}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-gray-400">No primary contact set.</p>
            )}
          </div>

          {/* Secondary contact */}
          {client.secondary_contact_name && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Secondary Contact</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500">Name</dt>
                  <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                    <User className="w-4 h-4 text-gray-400" />
                    {client.secondary_contact_name}
                  </dd>
                </div>
                {client.secondary_contact_email && (
                  <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${client.secondary_contact_email}`} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors">
                        <Mail className="w-4 h-4" />
                        {client.secondary_contact_email}
                      </a>
                    </dd>
                  </div>
                )}
                {client.secondary_contact_phone && (
                  <div>
                    <dt className="text-xs text-gray-500">Phone</dt>
                    <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {client.secondary_contact_phone}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="text-sm font-medium text-navy-950 mt-0.5">
                  {new Date(client.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              {client.updated_at && (
                <div>
                  <dt className="text-xs text-gray-500">Last Updated</dt>
                  <dd className="text-sm font-medium text-navy-950 mt-0.5">
                    {new Date(client.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

// Client notes — inline server-rendered list + client actions handled via ClientDetailActions
function ClientNotesSection({ clientId, notes, userId }: { clientId: string; notes: any[]; userId: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-navy-950">Internal Notes</h2>
        <span className="text-xs text-gray-400">{notes?.length || 0} note{(notes?.length || 0) !== 1 ? 's' : ''}</span>
      </div>
      <ClientNotesClient clientId={clientId} initialNotes={notes || []} userId={userId} />
    </div>
  )
}

// We need a small inline client component for notes interaction
// Import it from a separate file
import ClientNotesClient from '@/components/admin/ClientNotesClient'
