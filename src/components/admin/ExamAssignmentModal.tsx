'use client'

import { useState, useEffect } from 'react'
import { Loader2, X, BookOpen, CheckCircle2, Search } from 'lucide-react'

interface Exam {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  question_count: number
  exam_categories: { name: string } | null
}

interface Props {
  applicationId: string
  onClose: () => void
  onAssigned: () => void
}

export default function ExamAssignmentModal({ applicationId, onClose, onAssigned }: Props) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [suggestedExams, setSuggestedExams] = useState<Exam[]>([])
  const [allExams, setAllExams] = useState<Exam[]>([])
  const [jobCategory, setJobCategory] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/applications/${applicationId}/exams`)
      .then(r => r.json())
      .then(data => {
        setSuggestedExams(data.suggested_exams || [])
        setAllExams(data.all_exams || [])
        setJobCategory(data.job_category)
        // Pre-select suggested exams
        const ids = new Set((data.suggested_exams || []).map((e: Exam) => e.id))
        setSelectedIds(ids)
      })
      .catch(() => setError('Failed to load exams'))
      .finally(() => setLoading(false))
  }, [applicationId])

  const toggleExam = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAssign = async () => {
    if (selectedIds.size === 0) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/assign-exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_ids: Array.from(selectedIds) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => {
        onAssigned()
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign exams')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredAll = showAll
    ? allExams.filter(e =>
        !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.exam_categories?.name.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const ExamCard = ({ exam, small = false }: { exam: Exam; small?: boolean }) => {
    const isSelected = selectedIds.has(exam.id)
    return (
      <button
        onClick={() => toggleExam(exam.id)}
        className={`text-left w-full p-3 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-brand-500 bg-brand-50/50 shadow-sm'
            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-5 h-5 rounded shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
            isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
          }`}>
            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-navy-950 ${small ? 'text-sm' : 'text-sm'}`}>{exam.title}</p>
            {exam.exam_categories?.name && (
              <p className="text-xs text-gray-400 mt-0.5">{exam.exam_categories.name}</p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>{exam.question_count} Q</span>
              <span>{exam.duration_minutes} min</span>
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-navy-950">Assign Assessments</h2>
              {jobCategory && <p className="text-xs text-gray-500">Category: {jobCategory}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-lg font-semibold text-navy-950">Exams Assigned!</p>
              <p className="text-sm text-gray-500 mt-1">Credentials have been sent to the candidate.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Suggested exams */}
              {suggestedExams.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Suggested for {jobCategory}
                  </h3>
                  <div className="space-y-2">
                    {suggestedExams.map(exam => (
                      <ExamCard key={exam.id} exam={exam} />
                    ))}
                  </div>
                </div>
              )}

              {/* Browse all */}
              <div>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 mb-3"
                >
                  {showAll ? 'Hide all exams' : 'Browse all available exams'}
                </button>
                {showAll && (
                  <>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search exams..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredAll.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No exams found</p>
                      ) : (
                        filteredAll.map(exam => (
                          <ExamCard key={exam.id} exam={exam} small />
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && !loading && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
            <p className="text-sm text-gray-500">
              {selectedIds.size} exam{selectedIds.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={selectedIds.size === 0 || submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Assign & Send Credentials
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
