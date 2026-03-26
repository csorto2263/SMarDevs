/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Briefcase, Users, TrendingUp, ArrowRight, Eye, FileText } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch stats
  const [jobsResult, appsResult, publishedResult, recentAppsResult] = await Promise.all([
    supabase.from('jobs').select('id', { count: 'exact', head: true }),
    supabase.from('applications').select('id', { count: 'exact', head: true }),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase
      .from('applications')
      .select('id, first_name, last_name, email, status, created_at, jobs(title, slug)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const totalJobs = jobsResult.count || 0
  const totalApplications = appsResult.count || 0
  const publishedJobs = publishedResult.count || 0
  const recentApplications = recentAppsResult.data || []

  // Pipeline stats
  const { data: pipelineData } = await supabase
    .from('applications')
    .select('status')

  const pipelineCounts: Record<string, number> = {}
  pipelineData?.forEach(app => {
    pipelineCounts[app.status] = (pipelineCounts[app.status] || 0) + 1
  })

  const stats = [
    { label: 'Total Jobs', value: totalJobs, icon: Briefcase, color: 'bg-blue-500/10 text-blue-600', href: '/admin/jobs' },
    { label: 'Published', value: publishedJobs, icon: Eye, color: 'bg-green-500/10 text-green-600', href: '/admin/jobs' },
    { label: 'Applications', value: totalApplications, icon: Users, color: 'bg-purple-500/10 text-purple-600', href: '/admin/applicants' },
    { label: 'In Pipeline', value: (pipelineCounts['screening'] || 0) + (pipelineCounts['interview'] || 0) + (pipelineCounts['technical_review'] || 0) + (pipelineCounts['final_interview'] || 0), icon: TrendingUp, color: 'bg-amber-500/10 text-amber-600', href: '/admin/applicants' },
  ]

  const pipelineStages = [
    { key: 'applied', label: 'Applied', color: 'bg-gray-100 text-gray-700' },
    { key: 'screening', label: 'Screening', color: 'bg-blue-100 text-blue-700' },
    { key: 'interview', label: 'Interview', color: 'bg-indigo-100 text-indigo-700' },
    { key: 'technical_review', label: 'Technical', color: 'bg-purple-100 text-purple-700' },
    { key: 'final_interview', label: 'Final', color: 'bg-amber-100 text-amber-700' },
    { key: 'hired', label: 'Hired', color: 'bg-green-100 text-green-700' },
    { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  ]

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

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your recruitment pipeline</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group text-center"
          >
            <div className="flex justify-center mb-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy-950">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Pipeline overview */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-navy-950 mb-4">Pipeline Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {pipelineStages.map(stage => (
            <Link
              key={stage.key}
              href={`/admin/applicants?status=${stage.key}`}
              className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="text-2xl font-bold text-navy-950">{pipelineCounts[stage.key] || 0}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${stage.color}`}>
                {stage.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy-950">Recent Applications</h2>
            <Link href="/admin/applicants" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No applications yet</p>
              <p className="text-gray-400 text-xs mt-1">Applications will appear here as candidates apply</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/admin/applicants/${app.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0">
                      {app.first_name.charAt(0)}{app.last_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-950 truncate">
                        {app.first_name} {app.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {app.jobs?.title || 'Unknown position'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[app.status] || app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-navy-950 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/jobs/new"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 group-hover:bg-brand-500/20 transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-950">Create New Job</p>
                <p className="text-xs text-gray-500">Post a new position to your careers page</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
            <Link
              href="/admin/applicants"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-950">Review Applicants</p>
                <p className="text-xs text-gray-500">Manage candidates in your pipeline</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
            <Link
              href="/careers"
              target="_blank"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-950">View Careers Page</p>
                <p className="text-xs text-gray-500">See how candidates see your job listings</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
