'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Loader2, Clock, ChevronLeft, ChevronRight, CheckCircle2,
  AlertTriangle, Send, ArrowLeft, EyeOff,
} from 'lucide-react'
import Link from 'next/link'

interface Option {
  id: string
  option_text: string
  sort_order: number
}

interface Question {
  id: string
  question_text: string
  question_type: 'single_choice' | 'multiple_choice'
  points: number
  sort_order: number
  exam_options: Option[]
}

interface ExamData {
  exam: {
    id: string
    title: string
    description: string | null
    duration_minutes: number
    question_count: number
    exam_questions: Question[]
  }
  assignment_id: string
  started_at: string
  deadline: string
  existing_answers: { question_id: string; selected_options: string[] }[]
  candidate_email: string
}

interface SubmitResult {
  success: boolean
  score: number
  earned_points: number
  total_points: number
  passed: boolean
}

// ── Watermark ─────────────────────────────────────────────────────────────────
function Watermark({ email }: { email: string }) {
  const row = Array(12).fill(email).join('          ')
  const rows = Array(14).fill(row)
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-60%',
          left: '-30%',
          width: '160%',
          height: '220%',
          transform: 'rotate(-22deg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          opacity: 0.045,
        }}
      >
        {rows.map((r, i) => (
          <div key={i} style={{ whiteSpace: 'nowrap', fontSize: '12px', color: '#000', letterSpacing: '4px', fontFamily: 'monospace' }}>
            {r}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Security hook ──────────────────────────────────────────────────────────────
function useExamSecurity(assignmentId: string, enabled: boolean) {
  const [focusViolations, setFocusViolations] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [windowBlurred, setWindowBlurred] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Block right-click
    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    // Block dangerous keyboard shortcuts
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (ctrl && e.key.toLowerCase() === 'p') ||
        (ctrl && e.key.toLowerCase() === 's') ||
        (ctrl && e.key.toLowerCase() === 'u') ||
        (ctrl && e.shiftKey && ['i', 'c', 'j', 'k'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault()
        if (e.key === 'PrintScreen') {
          // Clear clipboard immediately after PrintScreen
          navigator.clipboard?.writeText('').catch(() => {})
        }
      }
    }

    // Block copy / cut
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      e.clipboardData?.setData('text/plain', '')
    }
    const onCut = (e: ClipboardEvent) => {
      e.preventDefault()
    }

    // Detect tab visibility change (most reliable)
    const onVisibilityChange = () => {
      if (document.hidden) {
        setWindowBlurred(true)
      } else {
        if (windowBlurred) {
          setWindowBlurred(false)
          setFocusViolations(v => v + 1)
          setShowWarning(true)
          fetch(`/api/applicant/exams/${assignmentId}/focus-violation`, { method: 'POST' }).catch(() => {})
        }
      }
    }

    // Detect window blur (alt-tab to another app)
    const onBlur = () => setWindowBlurred(true)
    const onFocus = () => {
      if (windowBlurred) {
        setWindowBlurred(false)
        setFocusViolations(v => v + 1)
        setShowWarning(true)
        fetch(`/api/applicant/exams/${assignmentId}/focus-violation`, { method: 'POST' }).catch(() => {})
      }
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('copy', onCopy)
    document.addEventListener('cut', onCut)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('cut', onCut)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [assignmentId, enabled, windowBlurred])

  return { focusViolations, showWarning, dismissWarning: () => setShowWarning(false) }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ExamTakingPage() {
  const router = useRouter()
  const { assignmentId } = useParams<{ assignmentId: string }>()

  const [loading, setLoading] = useState(true)
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [error, setError] = useState('')

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Security is active when exam is loaded and not yet submitted
  const securityEnabled = !!examData && !result
  const { focusViolations, showWarning, dismissWarning } = useExamSecurity(assignmentId, securityEnabled)

  // Start the exam
  const startExam = useCallback(async () => {
    try {
      const res = await fetch(`/api/applicant/exams/${assignmentId}/start`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        if (data.expired) {
          setError('Time is up for this assessment. It has been auto-submitted.')
        } else {
          throw new Error(data.error)
        }
        return
      }
      setExamData(data)

      // Restore existing answers
      if (data.existing_answers?.length > 0) {
        const restored: Record<string, string[]> = {}
        for (const a of data.existing_answers) {
          restored[a.question_id] = a.selected_options
        }
        setAnswers(restored)
      }

      // Calculate time left
      const deadline = new Date(data.deadline).getTime()
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000))
      setTimeLeft(remaining)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start exam')
    } finally {
      setLoading(false)
    }
  }, [assignmentId])

  useEffect(() => { startExam() }, [startExam])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || result) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft > 0, result])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (questionId: string, optionId: string, type: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || []
      if (type === 'single_choice') {
        return { ...prev, [questionId]: [optionId] }
      }
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) }
      }
      return { ...prev, [questionId]: [...current, optionId] }
    })
  }

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting) return
    setSubmitting(true)
    setShowConfirm(false)

    const answersArray = examData!.exam.exam_questions.map(q => ({
      question_id: q.id,
      selected_options: answers[q.id] || [],
    }))

    try {
      const res = await fetch(`/api/applicant/exams/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      if (timerRef.current) clearInterval(timerRef.current)
    } catch (err) {
      if (!autoSubmit) {
        setError(err instanceof Error ? err.message : 'Failed to submit')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading assessment...</p>
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error && !examData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-navy-950 mb-2">Assessment Unavailable</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Link href="/portal" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>
      </div>
    )
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (result) {
    const passed = result.score >= 70
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-amber-100'
          }`}>
            {passed ? (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-navy-950 mb-2">Assessment Completed</h2>
          <p className="text-sm text-gray-500 mb-6">{examData?.exam.title}</p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-4xl font-bold mb-1" style={{ color: passed ? '#16a34a' : '#d97706' }}>
              {result.score}%
            </div>
            <p className="text-sm text-gray-500">
              {result.earned_points} / {result.total_points} points
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            {passed
              ? 'Great job! Your results have been recorded and our team will review them.'
              : 'Your results have been recorded. Our team will review your overall application.'}
          </p>

          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!examData) return null

  const questions = examData.exam.exam_questions
  const question = questions[currentQ]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).filter(qId => (answers[qId] || []).length > 0).length
  const isTimeLow = timeLeft < 120

  return (
    <div className="min-h-screen bg-gray-50 select-none" style={{ WebkitUserSelect: 'none', MozUserSelect: 'none' }}>

      {/* Focus violation warning banner */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <EyeOff className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Warning: You left the exam window</p>
              <p className="text-xs text-red-200">
                This has been recorded. Violation #{focusViolations} — switching tabs or apps during the exam is not allowed.
              </p>
            </div>
          </div>
          <button
            onClick={dismissWarning}
            className="ml-4 shrink-0 px-3 py-1.5 bg-red-700 hover:bg-red-800 rounded-lg text-xs font-semibold transition-colors"
          >
            I understand
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className={`sticky z-50 bg-white border-b border-gray-200 shadow-sm ${showWarning ? 'top-[64px]' : 'top-0'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white text-xs font-bold">
              S
            </span>
            <div>
              <p className="text-sm font-semibold text-navy-950 line-clamp-1">{examData.exam.title}</p>
              <p className="text-xs text-gray-500">{answeredCount}/{totalQuestions} answered</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {focusViolations > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-600">
                <EyeOff className="w-3 h-3" />
                {focusViolations} violation{focusViolations > 1 ? 's' : ''}
              </span>
            )}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${
              isTimeLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-navy-950'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
            <span className="text-xs text-gray-500">{question.points} point{question.points > 1 ? 's' : ''}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card — watermark + select-none */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6 overflow-hidden">
          <Watermark email={examData.candidate_email} />

          {/* Content above watermark */}
          <div className="relative" style={{ zIndex: 1 }}>
            <div className="mb-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                question.question_type === 'single_choice'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-purple-50 text-purple-600'
              }`}>
                {question.question_type === 'single_choice' ? 'Single Choice' : 'Multiple Choice'}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-navy-950 mt-3 mb-6 leading-relaxed">
              {question.question_text}
            </h2>

            <div className="space-y-3">
              {question.exam_options.map((option) => {
                const isSelected = (answers[question.id] || []).includes(option.id)
                const isSingle = question.question_type === 'single_choice'

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(question.id, option.id, question.question_type)}
                    className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center ${
                      isSingle ? 'rounded-full' : 'rounded'
                    } border-2 transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className={`${isSingle ? 'w-2 h-2 rounded-full bg-white' : ''}`}>
                          {!isSingle && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm ${isSelected ? 'text-navy-950 font-medium' : 'text-gray-700'}`}>
                      {option.option_text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy-950 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Question dots */}
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
            {questions.map((q, i) => {
              const hasAnswer = (answers[q.id] || []).length > 0
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                    i === currentQ
                      ? 'bg-blue-500 text-white shadow-sm'
                      : hasAnswer
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {currentQ < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-navy-950 mb-2">Submit Assessment?</h3>
            <p className="text-sm text-gray-500 mb-4">
              You have answered <strong className="text-navy-950">{answeredCount}</strong> of {totalQuestions} questions.
              {answeredCount < totalQuestions && (
                <span className="text-amber-600"> You have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''}.</span>
              )}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Once submitted, you cannot change your answers.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Review
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl text-sm shadow-md disabled:opacity-50 transition-all"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
