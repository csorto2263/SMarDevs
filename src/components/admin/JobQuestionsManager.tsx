'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ToggleLeft, ToggleRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { JobQuestion, Question } from '@/lib/supabase/types'

interface Props {
  jobId: string
  categoryId: string
  initialQuestions: (JobQuestion & { questions: Question })[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function JobQuestionsManager({ jobId, categoryId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const toggleQuestion = async (jqId: string, field: 'is_active' | 'is_required', currentValue: boolean | null) => {
    setSaving(jqId + field)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase.from('job_questions').update({ [field]: !currentValue }).eq('id', jqId)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update question' })
    } else {
      setQuestions(prev =>
        prev.map(q => q.id === jqId ? { ...q, [field]: !currentValue } : q)
      )
      setMessage({ type: 'success', text: 'Question updated' })
    }
    setSaving(null)
    setTimeout(() => setMessage(null), 2000)
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-navy-950 mb-2">Screening Questions</h2>
        <p className="text-sm text-gray-500">
          No questions assigned yet. Questions are auto-assigned based on category when the job is first created.
          Try saving the job with a category selected, then reload this page.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-navy-950">Screening Questions</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {questions.filter(q => q.is_active).length} of {questions.length} questions active
          </p>
        </div>
        {message && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {message.text}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {questions.map((jq) => (
          <div
            key={jq.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${jq.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-950">{jq.questions.question_text}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {jq.questions.question_type}
                </span>
                {jq.is_required && jq.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">Required</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleQuestion(jq.id, 'is_required', jq.is_required)}
                disabled={!jq.is_active || saving === jq.id + 'is_required'}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                  jq.is_required ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={jq.is_required ? 'Make optional' : 'Make required'}
              >
                {saving === jq.id + 'is_required' ? <Loader2 className="w-3 h-3 animate-spin" /> : jq.is_required ? 'Required' : 'Optional'}
              </button>
              <button
                onClick={() => toggleQuestion(jq.id, 'is_active', jq.is_active)}
                disabled={saving === jq.id + 'is_active'}
                className="text-gray-400 hover:text-brand-600 transition-colors disabled:opacity-40"
                title={jq.is_active ? 'Deactivate' : 'Activate'}
              >
                {saving === jq.id + 'is_active' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : jq.is_active ? (
                  <ToggleRight className="w-6 h-6 text-brand-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
