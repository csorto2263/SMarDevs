'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Loader2, LogOut, Clock, CheckCircle2, AlertTriangle, Play,
  FileText, Timer, BookOpen, Lock,
} from 'lucide-react'

interface ExamAssignment {
  id: string
  status: string
  expires_at: string
  started_at: string | null
  completed_at: string | null
  score: number | null
  exams: {
    id: string
    title: string
    description: string | null
    duration_minutes: number
    question_count: number
    exam_categories: { name: string } | null
  }
}

export default function PortalDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<{ id: string; name: string; job: { title: string } } | null>(null)
  const [assignments, setAssignments] = useState<ExamAssignment[]>([])
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/applicant/exams')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setApplication(data.application)
      setAssignments(data.assignments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
    pending:      { icon: <Clock className="w-4 h-4" />,          label: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100' },
    reactivated:  { icon: <Clock className="w-4 h-4" />,          label: 'Reactivated', color: 'text-amber-600', bg: 'bg-amber-50' },
    in_progress:  { icon: <Timer className="w-4 h-4" />,          label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50' },
    completed:    { icon: <CheckCircle2 className="w-4 h-4" />,   label: 'Completed',   color: 'text-green-600', bg: 'bg-green-50' },
    expired:      { icon: <AlertTriangle className="w-4 h-4" />,  label: 'Expired',     color: 'text-red-600', bg: 'bg-red-50' },
  }

  const completedCount = assignments.filter(a => a.status === 'completed').length
  const totalCount = assignments.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-navy-950 mb-2">Unable to Load</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={handleLogout} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold shadow-md">
                S
              </span>
              <span className="text-lg font-bold tracking-tight text-navy-950">
                SMar<span className="text-blue-600">Devs</span>
              </span>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-2">Assessment Portal</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-navy-950 mb-1">
          Hello, {application?.name}
        </h1>
        <p className="text-sm text-gray-500">
          Position: <span className="font-medium text-navy-950">{application?.job?.title}</span>
        </p>
        {totalCount > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 shrink-0">
              {completedCount}/{totalCount} completed
            </span>
          </div>
        )}
      </div>

      {/* Exams */}
      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-navy-950 mb-2">No Assessments Yet</h2>
          <p className="text-sm text-gray-500">Your assessments will appear here once they are assigned.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your Assessments</h2>
          {assignments.map((assignment) => {
            const exam = assignment.exams
            const config = statusConfig[assignment.status] || statusConfig.pending
            const canStart = ['pending', 'reactivated', 'in_progress'].includes(assignment.status)
            const isExpired = assignment.status === 'expired'
            const isCompleted = assignment.status === 'completed'
            const daysLeft = Math.max(0, Math.ceil((new Date(assignment.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

            return (
              <div
                key={assignment.id}
                className={`bg-white rounded-2xl border shadow-sm p-6 transition-all ${
                  canStart ? 'border-gray-100 hover:border-blue-200 hover:shadow-md' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-navy-950">{exam.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                    {exam.exam_categories?.name && (
                      <p className="text-xs text-gray-400 mb-2">{exam.exam_categories.name}</p>
                    )}
                    {exam.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exam.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {exam.question_count} questions
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" />
                        {exam.duration_minutes} minutes
                      </span>
                      {!isCompleted && !isExpired && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </span>
                      )}
                      {isCompleted && assignment.score !== null && (
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          assignment.score >= 70 ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          Score: {assignment.score}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {canStart && (
                      <Link
                        href={`/portal/exam/${assignment.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
                      >
                        <Play className="w-4 h-4" />
                        {assignment.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Link>
                    )}
                    {isExpired && (
                      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed">
                        <Lock className="w-4 h-4" />
                        Expired
                      </div>
                    )}
                    {isCompleted && (
                      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
