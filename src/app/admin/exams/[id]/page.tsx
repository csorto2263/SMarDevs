'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, BookOpen, FileText, Timer, BarChart3,
  CheckCircle2, XCircle, Users,
} from 'lucide-react'

interface Option {
  id: string
  option_text: string
  is_correct: boolean
  sort_order: number
}

interface Question {
  id: string
  question_text: string
  question_type: string
  points: number
  sort_order: number
  exam_options: Option[]
}

interface Exam {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  passing_score: number
  question_count: number
  is_active: boolean
  created_at: string
  exam_categories: { id: string; name: string } | null
  exam_questions: Question[]
}

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [exam, setExam] = useState<Exam | null>(null)
  const [stats, setStats] = useState({ total_assignments: 0, completed_assignments: 0 })
  const [loading, setLoading] = useState(true)

  const fetchExam = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/exams/${id}`)
      const data = await res.json()
      if (res.ok) {
        setExam(data.exam)
        setStats(data.stats)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchExam() }, [fetchExam])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500">Exam not found</p>
        <Link href="/admin/exams" className="text-sm text-brand-600 hover:text-brand-700 font-medium mt-2 inline-block">
          Back to Exams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link href="/admin/exams" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Exams
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-navy-950">{exam.title}</h1>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                exam.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {exam.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {exam.exam_categories?.name && (
              <p className="text-sm text-gray-500">{exam.exam_categories.name}</p>
            )}
            {exam.description && (
              <p className="text-sm text-gray-600 mt-2">{exam.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-gray-400" />
            {exam.question_count} questions
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4 text-gray-400" />
            {exam.duration_minutes} minutes
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            {exam.passing_score}% to pass
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            {stats.completed_assignments}/{stats.total_assignments} completed
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Questions ({exam.exam_questions.length})
        </h2>
        {exam.exam_questions.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                {qi + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    q.question_type === 'single_choice'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-purple-50 text-purple-600'
                  }`}>
                    {q.question_type === 'single_choice' ? 'Single' : 'Multiple'}
                  </span>
                  <span className="text-[10px] text-gray-400">{q.points} pt{q.points > 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm font-medium text-navy-950 mb-3">{q.question_text}</p>
                <div className="space-y-1.5">
                  {q.exam_options.map(opt => (
                    <div key={opt.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                      opt.is_correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      {opt.is_correct ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className={opt.is_correct ? 'text-green-800 font-medium' : 'text-gray-600'}>
                        {opt.option_text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
