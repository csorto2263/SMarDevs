/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Mail, Phone, MapPin, Linkedin,
  Briefcase, DollarSign, Calendar, Building2, ExternalLink,
} from 'lucide-react'
import EmployeeDetailActions from '@/components/admin/EmployeeDetailActions'

const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Junior', mid: 'Mid-Level', senior: 'Senior', lead: 'Lead', principal: 'Principal',
}
const EMP_TYPE_LABELS: Record<string, string> = {
  full_time_contractor:  'Full-Time Contractor',
  part_time_contractor:  'Part-Time Contractor',
  full_time_employee:    'Full-Time Employee',
  part_time_employee:    'Part-Time Employee',
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const admin = createAdminClientAny()
  const { data: employee } = await admin
    .from('employees')
    .select('*, clients(id, name, website, primary_contact_name, primary_contact_email)')
    .eq('id', id)
    .single()

  if (!employee) return notFound()

  const emp = employee as any

  // Fetch source application if exists
  let sourceApplication = null
  if (emp.source_application_id) {
    const { data } = await admin
      .from('applications')
      .select('id, first_name, last_name, email, status, created_at, jobs(title)')
      .eq('id', emp.source_application_id)
      .single()
    sourceApplication = data
  }

  // Fetch all clients for the edit modal
  const { data: clients } = await admin.from('clients').select('id, name').eq('status', 'active').order('name')


  return (
    <div className="space-y-6">
      <Link href="/admin/employees" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-xl font-bold shrink-0">
              {emp.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-950">{emp.full_name}</h1>
              <p className="text-gray-600 mt-0.5">{emp.role_title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <a href={`mailto:${emp.email}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors">
                  <Mail className="w-4 h-4" />{emp.email}
                </a>
                {emp.phone && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />{emp.phone}
                  </span>
                )}
                {emp.address && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />{emp.address}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
              emp.status === 'active'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
              {emp.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            <EmployeeDetailActions employee={emp} clients={clients || []} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-navy-950 mb-4">Employment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Role Title</p>
                <p className="text-sm font-semibold text-navy-950 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-500" />{emp.role_title}
                </p>
              </div>
              {emp.seniority && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Seniority</p>
                  <p className="text-sm font-semibold text-navy-950">{SENIORITY_LABELS[emp.seniority] || emp.seniority}</p>
                </div>
              )}
              {emp.employment_type && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Employment Type</p>
                  <p className="text-sm font-semibold text-navy-950">{EMP_TYPE_LABELS[emp.employment_type] || emp.employment_type}</p>
                </div>
              )}
              {emp.monthly_salary_usd && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Monthly Salary</p>
                  <p className="text-sm font-semibold text-navy-950 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    ${emp.monthly_salary_usd.toLocaleString()} USD/mo
                  </p>
                </div>
              )}
              {emp.start_date && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-navy-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(emp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
              {emp.role_category && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-sm font-semibold text-navy-950">{emp.role_category}</p>
                </div>
              )}
            </div>
          </div>

          {/* Source application */}
          {sourceApplication && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-navy-950 mb-4">Source Application</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-navy-950">{(sourceApplication as any).first_name} {(sourceApplication as any).last_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Applied for: {(sourceApplication as any).jobs?.title || '—'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Applied {new Date((sourceApplication as any).created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <Link href={`/admin/applicants/${(sourceApplication as any).id}`} className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 transition-colors">
                  View <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client */}
          {emp.clients && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Client</h3>
              <Link href={`/admin/clients/${emp.clients.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                  {emp.clients.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-950 group-hover:text-brand-600 transition-colors">{emp.clients.name}</p>
                  {emp.clients.primary_contact_name && (
                    <p className="text-xs text-gray-500">{emp.clients.primary_contact_name}</p>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* Links */}
          {emp.linkedin_url && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-navy-950 mb-3 uppercase tracking-wider">Links</h3>
              <a href={emp.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn Profile
              </a>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Added</dt>
                <dd className="text-sm font-medium text-navy-950 mt-0.5">
                  {new Date(emp.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last Updated</dt>
                <dd className="text-sm font-medium text-navy-950 mt-0.5">
                  {new Date(emp.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              {emp.is_archived && (
                <div>
                  <dt className="text-xs text-gray-500">Archived On</dt>
                  <dd className="text-sm font-medium text-navy-950 mt-0.5">
                    {emp.archived_at ? new Date(emp.archived_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
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
