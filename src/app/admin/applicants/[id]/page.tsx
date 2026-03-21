/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Mail, Phone, MapPin, Linkedin, Github, Globe, FileText,
  Calendar, DollarSign, Clock, CheckCircle2
} from 'lucide-react'
import StatusChanger from '@/components/admin/StatusChanger'
import AdminNotes from '@/components/admin/AdminNotes'
import ShareApplicantButton from '@/components/admin/ShareApplicantButton'

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch application with all related data
  const { data: application } = await supabase
    .from('applications')
    .select(`
      *,
      jobs(id, title, slug, department),
      application_answers(*, questions(*)),
      application_status_history(*, profiles:changed_by(full_name, email)),
      admin_notes(*, profiles:author_id(full_name, email))
    `)
    .eq('id', id)
    .single()

  if (!application) return notFound()

  // Fetch active team members with a phone number for the Share button
  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('id, full_name, phone')
    .eq('status', 'active')
    .not('phone', 'is', null)
    .neq('phone', '')

  // Generate signed URL for resume if it exists (bucket is private)
  let resumeSignedUrl: string | null = null
  if (application.resume_url) {
    const isFullUrl = application.resume_url.startsWith('http')
    if (isFullUrl) {
      // Legacy full URL — try to extract path
      const match = application.resume_url.match(/\/resumes\/(.+)$/)
      if (match) {
        const { data } = await supabase.storage.from('resumes').createSignedUrl(match[1], 3600)
        resumeSignedUrl = data?.signedUrl || application.resume_url
      } else {
        resumeSignedUrl = application.resume_url
      }
    } else {
      // Path-only (new format)
      const { data } = await supabase.storage.from('resumes').createSignedUrl(application.resume_url, 3600)
      resumeSignedUrl = data?.signedUrl || null
    }
  }

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
    applied: 'bg-gray-100 text-gray-700 border-gray-200',
    screening: 'bg-blue-100 text-blue-700 border-blue-200',
    interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    technical_review: 'bg-purple-100 text-purple-700 border-purple-200',
    final_interview: 'bg-amber-100 text-amber-700 border-amber-200',
    offer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    hired: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    withdrawn: 'bg-gray-100 text-gray-500 border-gray-200',
  }

  const app = application as any

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/applicants" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Applicants
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-xl font-bold shrink-0">
              {app.first_name.charAt(0)}{app.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-950">
                {app.first_name} {app.last_name}
              </h1>
              {app.headline && (
                <p className="text-gray-600 mt-0.5">{app.headline}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <a href={`mailto:${app.email}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  {app.email}
                </a>
                {app.phone && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    {app.phone}
                  </span>
                )}
                {app.address && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {app.address}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${statusColors[app.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              {statusLabels[app.status] || app.status}
            </span>
            <ShareApplicantButton
              applicantName={`${app.first_name} ${app.last_name}`}
              position={app.jobs?.title || 'Unknown Position'}
              email={app.email}
              phone={app.phone}
              linkedin={app.linkedin_url}
              profileUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/applicants/${app.id}`}
              teamMembers={teamMembers ?? []}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applied to */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-navy-950 mb-3">Applied Position</h2>
            <Link href={`/careers/${app.jobs?.slug}`} target="_blank" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors">
              {app.jobs?.title || 'Unknown Position'}
              <Globe className="w-4 h-4" />
            </Link>
            {app.jobs?.department && (
              <p className="text-sm text-gray-500 mt-1">Department: {app.jobs.department}</p>
            )}
          </div>

          {/* Profile links */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-navy-950 mb-4">Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resumeSignedUrl && (
                <a
                  href={resumeSignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all group"
                >
                  <FileText className="w-5 h-5 text-red-500" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-950 group-hover:text-brand-600 transition-colors">Resume</p>
                    <p className="text-xs text-gray-500 truncate">{app.resume_filename || 'Download'}</p>
                  </div>
                </a>
              )}
              {app.linkedin_url && (
                <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-950 group-hover:text-blue-600 transition-colors">LinkedIn</p>
                    <p className="text-xs text-gray-500 truncate">{app.linkedin_url}</p>
                  </div>
                </a>
              )}
              {app.github_url && (
                <a href={app.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group">
                  <Github className="w-5 h-5 text-gray-700" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-950 group-hover:text-gray-700 transition-colors">GitHub</p>
                    <p className="text-xs text-gray-500 truncate">{app.github_url}</p>
                  </div>
                </a>
              )}
              {app.portfolio_url && (
                <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-950 group-hover:text-purple-600 transition-colors">Portfolio</p>
                    <p className="text-xs text-gray-500 truncate">{app.portfolio_url}</p>
                  </div>
                </a>
              )}
            </div>
            {!app.resume_url && !app.linkedin_url && !app.github_url && !app.portfolio_url && (
              <p className="text-sm text-gray-400">No profile links provided</p>
            )}
          </div>

          {/* Cover letter */}
          {app.cover_letter && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-navy-950 mb-3">Cover Letter / Notes</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{app.cover_letter}</p>
            </div>
          )}

          {/* Screening answers */}
          {app.application_answers && app.application_answers.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-navy-950 mb-4">Screening Answers</h2>
              <div className="space-y-4">
                {app.application_answers.map((answer: any) => (
                  <div key={answer.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-navy-950 mb-1">
                      {answer.questions?.question_text || 'Question'}
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {answer.answer_text || (answer.answer_json ? JSON.stringify(answer.answer_json) : '—')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <AdminNotes
            applicationId={app.id}
            userId={user!.id}
            initialNotes={app.admin_notes || []}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status changer */}
          <StatusChanger applicationId={app.id} currentStatus={app.status} />

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Salary Expectation</dt>
                <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  {app.salary_expectation ? `$${app.salary_expectation.toLocaleString()}/mo` : 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Located in LATAM</dt>
                <dd className="text-sm font-medium text-navy-950 mt-0.5">
                  {app.is_latam === true ? 'Yes' : app.is_latam === false ? 'No' : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">English Level</dt>
                <dd className="text-sm font-medium text-navy-950 mt-0.5">{app.english_level || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Availability</dt>
                <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {app.availability || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Applied On</dt>
                <dd className="text-sm font-medium text-navy-950 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Source</dt>
                <dd className="text-sm font-medium text-navy-950 mt-0.5 capitalize">{app.source || 'Website'}</dd>
              </div>
            </dl>
          </div>

          {/* Status history */}
          {app.application_status_history && app.application_status_history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Pipeline History</h3>
              <div className="space-y-3">
                {app.application_status_history
                  .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((entry: any) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-950">
                        {entry.from_status ? (
                          <>
                            <span className="text-gray-500">{statusLabels[entry.from_status] || entry.from_status}</span>
                            {' → '}
                            <span className="font-medium">{statusLabels[entry.to_status] || entry.to_status}</span>
                          </>
                        ) : (
                          <span className="font-medium">{statusLabels[entry.to_status] || entry.to_status}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {entry.profiles?.full_name && ` by ${entry.profiles.full_name}`}
                      </p>
                      {entry.note && <p className="text-xs text-gray-500 mt-1">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
