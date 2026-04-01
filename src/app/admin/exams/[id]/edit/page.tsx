'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, GripVertical, Loader2,
  CheckCircle2, AlertCircle,
} from 'lucide-react'

interface QuestionOption {
  option_text: string
  is_correct: boolean
}

interface Question {
  question_text: string
  question_type: 'single_choice' | 'multiple_choice'
  points: number
  options: QuestionOption[]
}

interface Category {
  id: string
  name: string
}

export default function EditExamPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [duration, setDuration] = useState(60)
  const [passingScore, setPassingScore] = useState(70)

  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/exam-categories').then(r => r.json()),
      fetch(`/api/admin/exams/${id}`).then(r => r.json()),
    ]).then(([catData, examData]) => {
      setCategories(catData.categories || [])

      const exam = examData.exam
      if (!exam) { setError('Exam not found'); setLoading(false); return }

      setTitle(exam.title || '')
      setDescription(exam.description || '')
      setCategoryId(exam.exam_categories?.id || exam.category_id || '')
      setDuration(exam.duration_minutes || 60)
      setPassingScore(exam.passing_score || 70)

      const qs: Question[] = (exam.exam_questions || []).map((q: {
        question_text: string
        question_type: 'single_choice' | 'multiple_choice'
        points: number
        exam_options: { option_text: string; is_correct: boolean }[]
      }) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        options: (q.exam_options || []).map((o: { option_text: string; is_correct: boolean }) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
        })),
      }))

      setQuestions(qs.length > 0 ? qs : [{
        question_text: '',
        question_type: 'single_choice',
        points: 1,
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ],
      }])

      setLoading(false)
    }).catch(() => {
      setError('Failed to load exam')
      setLoading(false)
    })
  }, [id])

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      question_type: 'single_choice',
      points: 1,
      options: [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    }])
  }

  const removeQuestion = (qi: number) => {
    if (questions.length <= 1) return
    setQuestions(questions.filter((_, i) => i !== qi))
  }

  const updateQuestion = (qi: number, field: string, value: string | number) => {
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q))
  }

  const updateOption = (qi: number, oi: number, field: string, value: string | boolean) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q
      const newOptions = q.options.map((opt, j) => {
        if (j !== oi) {
          if (field === 'is_correct' && value === true && q.question_type === 'single_choice') {
            return { ...opt, is_correct: false }
          }
          return opt
        }
        return { ...opt, [field]: value }
      })
      return { ...q, options: newOptions }
    }))
  }

  const addOption = (qi: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q
      return { ...q, options: [...q.options, { option_text: '', is_correct: false }] }
    }))
  }

  const removeOption = (qi: number, oi: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qi || q.options.length <= 2) return q
      return { ...q, options: q.options.filter((_, j) => j !== oi) }
    }))
  }

  const validate = (): string | null => {
    if (!title.trim()) return 'Exam title is required'
    if (!categoryId) return 'Category is required'
    if (questions.length === 0) return 'At least one question is required'

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question_text.trim()) return `Question ${i + 1} text is required`
      if (q.options.filter(o => o.option_text.trim()).length < 2) return `Question ${i + 1} needs at least 2 options`
      if (!q.options.some(o => o.is_correct)) return `Question ${i + 1} needs at least one correct answer`
    }
    return null
  }

  const handleSave = async () => {
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category_id: categoryId,
          duration_minutes: duration,
          passing_score: passingScore,
          questions: questions.map(q => ({
            question_text: q.question_text.trim(),
            question_type: q.question_type,
            points: q.points,
            options: q.options.filter(o => o.option_text.trim()).map(o => ({
              option_text: o.option_text.trim(),
              is_correct: o.is_correct,
            })),
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/admin/exams/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const inp = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const lbl = 'block text-sm font-medium text-gray-700 mb-1.5'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Link href={`/admin/exams/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Exam
      </Link>

      <h1 className="text-2xl font-bold text-navy-950">Edit Exam</h1>

      {error && (
        <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Exam details */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Exam Details</h2>
        <div>
          <label className={lbl}>Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Fundamentals" className={inp} />
        </div>
        <div>
          <label className={lbl}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Brief description..." className={inp} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={lbl}>Category *</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inp}>
              <option value="">Select...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Duration (min)</label>
            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={5} max={180} className={inp} />
          </div>
          <div>
            <label className={lbl}>Passing Score (%)</label>
            <input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} min={0} max={100} className={inp} />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Questions ({questions.length})</h2>
          <button
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Question
          </button>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 pt-2">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <span className="text-xs font-bold text-gray-400 w-6">{qi + 1}</span>
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={q.question_text}
                  onChange={e => updateQuestion(qi, 'question_text', e.target.value)}
                  rows={2}
                  placeholder="Enter question..."
                  className={inp}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <select
                      value={q.question_type}
                      onChange={e => updateQuestion(qi, 'question_type', e.target.value)}
                      className={`${inp} !py-2`}
                    >
                      <option value="single_choice">Single Choice</option>
                      <option value="multiple_choice">Multiple Choice</option>
                    </select>
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={q.points}
                      onChange={e => updateQuestion(qi, 'points', Number(e.target.value))}
                      min={1}
                      max={10}
                      className={`${inp} !py-2 text-center`}
                      title="Points"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 pl-2">
                  <p className="text-xs text-gray-400">Options (click radio/checkbox to mark correct):</p>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateOption(qi, oi, 'is_correct', q.question_type === 'single_choice' ? true : !opt.is_correct)}
                        className={`w-5 h-5 shrink-0 flex items-center justify-center border-2 transition-all ${
                          q.question_type === 'single_choice' ? 'rounded-full' : 'rounded'
                        } ${opt.is_correct ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        {opt.is_correct && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </button>
                      <input
                        value={opt.option_text}
                        onChange={e => updateOption(qi, oi, 'option_text', e.target.value)}
                        placeholder={`Option ${oi + 1}`}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                      />
                      {q.options.length > 2 && (
                        <button
                          onClick={() => removeOption(qi, oi)}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(qi)}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    + Add option
                  </button>
                </div>
              </div>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qi)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm text-gray-500">{questions.length} question{questions.length !== 1 ? 's' : ''} total</p>
        <div className="flex gap-3">
          <Link href={`/admin/exams/${id}`} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl text-sm shadow-md disabled:opacity-50 transition-all"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
