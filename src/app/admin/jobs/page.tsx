/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Briefcase, Globe } from 'lucide-react'
import JobActions from '@/components/admin/JobActions'

export default async function AdminJobsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .order('created_at', { ascending: false })

  const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
    published: { label: 'Published', color: 'bg-green-100 text-green-700' },
    closed: { label: 'Closed', color: 'bg-red-100 text-red-700' },
    archived: { label: 'Archived', color: 'bg-gray-100 text-gray-500' },
  }

  const seniorityLabel: Record<string, string> = {
    junior: 'Junior',
    mid: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
    principal: 'Principal',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Jobs</h1>
          <p className="text-gray-500 mt-1">{jobs?.length || 0} total positions</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-600/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Job
        </Link>
      </div>

      {/* Jobs table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-950 mb-1">No jobs yet</h3>
            <p className="text-gray-500 text-sm mb-4">Create your first job listing to get started</p>
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seniority</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map((job: any) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <Link href={`/admin/jobs/${job.id}/edit`} className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <Globe className="w-3 h-3" />
                          {job.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{job.job_categories?.name || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{seniorityLabel[job.seniority] || job.seniority}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[job.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {statusConfig[job.status]?.label || job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{job.application_count || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <JobActions job={job} />
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
