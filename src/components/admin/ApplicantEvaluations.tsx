'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Loader2, Clock, CheckCircle2, AlertTriangle,
  RefreshCw, Plus, FileText, Timer, BarChart3, EyeOff,
} from 'lucide-react'
import ExamAssignmentModal from './ExamAssignmentModal'

interface ExamAssignment {
  id: string
  status: string
  expires_at: string
  started_at: string | null
  completed_at: string | null
  score: number | null
  total_points: number | null
  earned_points: number | null
  created_at: string
  focus_violations: number | null
  exams: {
    id: string
    title: string
    description: string | null
    duration_minutes: number
    passing_score: number
    question_count: number
    exam_categories: { name: string } | null
  }
  profiles: { full_name: string } | null
}

interface Props {
  applicationId: string
  currentStatus: string
}

export default function ApplicantEvaluations({ applicationId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<ExamAssignment[]>([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [reactivating, setReactivating] = useState<string | null>(null)

  const canAssign = currentStatus === 'technical_review'

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/exams`)
      const data = await res.json()
      if (res.ok) {
        setAssignments(data.assignments || [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  useEffect(() => { fetchAssignments() }, [fetchAssignments])

  const handleReactivate = async (assignmentId: string) => {
    setReactivating(assignmentId)
    try {
      const res = await fetch(`/api/admin/exam-assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reactivate' }),
      })
      if (res.ok) {
        await fetchAssignments()
        router.refresh()
      }
    } catch {
      // silent
    } finally {
      setReactivating(null)
    }
  }

  const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
    pending:      { icon: <Clock className="w-3.5 h-3.5" />,          label: 'Pending',     color: 'text-gray-600', bg: 'bg-gray-100 border-gray-200' },
    reactivated:  { icon: <RefreshCw className="w-3.5 h-3.5" />,      label: 'Reactivated', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    in_progress:  { icon: <Timer className="w-3.5 h-3.5" />,          label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    completed:    { icon: <CheckCircle2 className="w-3.5 h-3.5" />,   label: 'Completed',   color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    expired:      { icon: <AlertTriangle className="w-3.5 h-3.5" />,  label: 'Expired',     color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  }

  const allCompleted = assignments.length > 0 && assignments.every(a => a.status === 'completed')
  const completedCount = assignments.filter(a => a.status === 'completed').length

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">Technical Evaluations</h3>
        </div>
        {canAssign && (
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Assign Exams
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-6">
          <BookOpen className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            {canAssign ? 'No exams assigned yet. Click "Assign Exams" to get started.' : 'No evaluations for this applicant.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary bar */}
          {assignments.length > 1 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-1">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${allCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${(completedCount / assignments.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{completedCount}/{assignments.length}</span>
                </div>
              </div>
              {allCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Complete
                </span>
              )}
            </div>
          )}

          {/* Assignment cards */}
          {assignments.map(a => {
            const config = statusConfig[a.status] || statusConfig.pending
            const isExpired = a.status === 'expired'
            const isCompleted = a.status === 'completed'
            const passed = isCompleted && a.score !== null && a.score >= (a.exams.passing_score || 70)

            return (
              <div key={a.id} className="border border-gray-100 rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-navy-950 truncate">{a.exams.title}</p>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${config.bg} ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                    {a.exams.exam_categories?.name && (
                      <p className="text-[10px] text-gray-400 mb-1">{a.exams.exam_categories.name}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {a.exams.question_count} Q
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {a.exams.duration_minutes} min
                      </span>
                      {isCompleted && a.score !== null && (
                        <span className={`font-semibold ${passed ? 'text-green-600' : 'text-amber-600'}`}>
                          Score: {a.score}% ({a.earned_points}/{a.total_points})
                        </span>
                      )}
                      {isCompleted && (a.focus_violations ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                          <EyeOff className="w-3 h-3" />
                          {a.focus_violations} tab violation{(a.focus_violations ?? 0) > 1 ? 's' : ''}
                        </span>
                      )}
                      {!isCompleted && !isExpired && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires: {new Date(a.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isExpired && (
                    <button
                      onClick={() => handleReactivate(a.id)}
                      disabled={reactivating === a.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {reactivating === a.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Assign modal */}
      {showAssignModal && (
        <ExamAssignmentModal
          applicationId={applicationId}
          onClose={() => setShowAssignModal(false)}
          onAssigned={() => {
            fetchAssignments()
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
