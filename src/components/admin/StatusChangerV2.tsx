'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { Client } from '@/lib/types'

const stages = [
  { value: 'applied',          label: 'Applied',          color: 'bg-gray-500'    },
  { value: 'screening',        label: 'Screening',        color: 'bg-blue-500'    },
  { value: 'interview',        label: 'Interview',        color: 'bg-indigo-500'  },
  { value: 'technical_review', label: 'Technical Review', color: 'bg-purple-500'  },
  { value: 'final_interview',  label: 'Final Interview',  color: 'bg-amber-500'   },
  { value: 'offer',            label: 'Offer',            color: 'bg-emerald-500' },
  { value: 'hired',            label: 'Hired',            color: 'bg-green-500'   },
  { value: 'rejected',         label: 'Rejected',         color: 'bg-red-500'     },
  { value: 'withdrawn',        label: 'Withdrawn',        color: 'bg-gray-400'    },
]

const MIN_COMMENT = 80

const PIPELINE_ORDER = ['applied', 'screening', 'interview', 'technical_review', 'final_interview', 'offer', 'hired']

function requiresJustification(from: string, to: string): boolean {
  // All transitions require justification
  return from !== to
}

function isValidTransition(from: string, to: string): boolean {
  // Rejected and withdrawn allowed from any stage
  if (['rejected', 'withdrawn'].includes(to)) return true
  const fromIdx = PIPELINE_ORDER.indexOf(from)
  const toIdx = PIPELINE_ORDER.indexOf(to)
  if (fromIdx === -1 || toIdx === -1) return false
  // Only allow moving to the immediate next stage
  return toIdx === fromIdx + 1
}

interface Props {
  applicationId: string
  currentStatus: string
  applicantName: string
  jobTitle?: string
  jobClientId?: string | null
  jobCategoryName?: string
  applicantHeadline?: string
}

// ── Comment / Justification Modal ─────────────────────────────────────────────
function CommentModal({
  toStatus, onConfirm, onCancel, loading,
}: {
  toStatus: string; onConfirm: (comment: string) => void; onCancel: () => void; loading: boolean
}) {
  const [comment, setComment] = useState('')
  const trimmed   = comment.trim()
  const charCount = trimmed.length
  const isValid   = charCount >= MIN_COMMENT

  const stageLabel = stages.find(s => s.value === toStatus)?.label || toStatus

  const isRejection = toStatus === 'rejected'
  const isWithdrawal = toStatus === 'withdrawn'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
        <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isRejection ? 'bg-red-100' : isWithdrawal ? 'bg-gray-100' : 'bg-amber-100'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${isRejection ? 'text-red-600' : isWithdrawal ? 'text-gray-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-950">Justification Required</h2>
            <p className="text-sm text-gray-500">Moving to <span className="font-medium text-navy-950">{stageLabel}</span></p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Please provide a clear reason for this status change. This will be recorded in the pipeline history.
        </p>

        <div className="relative">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            placeholder={
              isRejection
                ? 'Describe the reason for rejection (e.g., candidate did not meet technical requirements for X and Y…)'
                : isWithdrawal
                ? 'Describe why the candidate withdrew (e.g., candidate accepted another offer, personal reasons…)'
                : 'Explain the reason for this stage change…'
            }
            className={`w-full px-4 py-3 border rounded-xl text-sm text-navy-950 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all ${
              comment.length > 0 && !isValid
                ? 'border-amber-300 focus:ring-amber-500/30 focus:border-amber-400'
                : isValid
                ? 'border-green-300 focus:ring-green-500/30 focus:border-green-400'
                : 'border-gray-200 focus:ring-brand-500/30 focus:border-brand-500'
            }`}
          />
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs ${
              charCount === 0 ? 'text-gray-400' :
              !isValid ? 'text-amber-600' : 'text-green-600'
            }`}>
              {charCount === 0
                ? `Minimum ${MIN_COMMENT} characters required`
                : !isValid
                ? `${MIN_COMMENT - charCount} more characters needed`
                : <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Looks good</span>
              }
            </p>
            <p className={`text-xs font-medium ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
              {charCount} / {MIN_COMMENT}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-5">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
          <button
            onClick={() => isValid && onConfirm(trimmed)}
            disabled={!isValid || loading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isRejection ? 'bg-red-600 hover:bg-red-700' :
              isWithdrawal ? 'bg-gray-600 hover:bg-gray-700' :
              'bg-brand-600 hover:bg-brand-500'
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm & Move to {stageLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Hire Modal ─────────────────────────────────────────────────────────────────
function HireModal({
  applicantName, jobTitle, jobClientId, applicantHeadline,
  onConfirm, onCancel, loading,
}: {
  applicantName: string
  jobTitle?: string
  jobClientId?: string | null
  applicantHeadline?: string
  onConfirm: (comment: string, hireData: Record<string, unknown>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [clients,  setClients]  = useState<Client[]>([])
  const [fetching, setFetching] = useState(true)

  const [comment, setComment] = useState('')
  const [form, setForm] = useState({
    client_id:          jobClientId || '',
    role_title:         jobTitle    || '',
    role_category:      applicantHeadline || '',
    seniority:          '',
    start_date:         new Date().toISOString().split('T')[0],
    employment_type:    '',
    monthly_salary_usd: '',
  })

  useEffect(() => {
    fetch('/api/admin/clients?status=active&page=1')
      .then(r => r.json())
      .then(d => { setClients(d.clients || []); setFetching(false) })
  }, [])

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const trimmed   = comment.trim()
  const charCount = trimmed.length
  const isCommentValid = charCount >= MIN_COMMENT
  const isFormValid    = !!form.client_id && !!form.role_title && isCommentValid

  const inp = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const lbl = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-navy-950">Confirm Hire</h2>
              <p className="text-sm text-gray-500">{applicantName}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Full Name</label>
                <input value={applicantName} disabled className={`${inp} bg-gray-100 text-gray-500 cursor-not-allowed`} />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Client *</label>
                {fetching ? (
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                  <select value={form.client_id} onChange={e => set('client_id', e.target.value)} required className={inp}>
                    <option value="">Select client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
                {!form.client_id && <p className="text-xs text-red-500 mt-1">Client is required to proceed.</p>}
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Final Role Title *</label>
                <input value={form.role_title} onChange={e => set('role_title', e.target.value)} required placeholder="e.g., Senior Frontend Developer" className={inp} />
              </div>
              <div>
                <label className={lbl}>Category</label>
                <input value={form.role_category} onChange={e => set('role_category', e.target.value)} placeholder="e.g., Frontend Development" className={inp} />
              </div>
              <div>
                <label className={lbl}>Seniority</label>
                <select value={form.seniority} onChange={e => set('seniority', e.target.value)} className={inp}>
                  <option value="">Select…</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="principal">Principal</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Start Date</label>
                <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inp} />
              </div>
              <div>
                <label className={lbl}>Employment Type</label>
                <select value={form.employment_type} onChange={e => set('employment_type', e.target.value)} className={inp}>
                  <option value="">Select…</option>
                  <option value="full_time_contractor">Full-Time Contractor</option>
                  <option value="part_time_contractor">Part-Time Contractor</option>
                  <option value="full_time_employee">Full-Time Employee</option>
                  <option value="part_time_employee">Part-Time Employee</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Monthly Salary (USD)</label>
                <input type="number" value={form.monthly_salary_usd} onChange={e => set('monthly_salary_usd', e.target.value)} placeholder="e.g., 4500" className={inp} />
              </div>
            </div>
          </div>

          {/* Justification */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Hire Justification *</h3>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Describe why this candidate was selected (skills, interview performance, cultural fit…)"
              className={`w-full px-4 py-3 border rounded-xl text-sm text-navy-950 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all ${
                comment.length > 0 && !isCommentValid
                  ? 'border-amber-300 focus:ring-amber-500/30'
                  : isCommentValid
                  ? 'border-green-300 focus:ring-green-500/30'
                  : 'border-gray-200 focus:ring-brand-500/30 focus:border-brand-500'
              }`}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className={`text-xs ${charCount === 0 ? 'text-gray-400' : !isCommentValid ? 'text-amber-600' : 'text-green-600'}`}>
                {charCount === 0 ? `Minimum ${MIN_COMMENT} characters` : !isCommentValid ? `${MIN_COMMENT - charCount} more characters needed` : '✓ Looks good'}
              </p>
              <p className={`text-xs font-medium ${isCommentValid ? 'text-green-600' : 'text-gray-400'}`}>{charCount} / {MIN_COMMENT}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
          <button
            onClick={() => isFormValid && onConfirm(trimmed, { ...form, monthly_salary_usd: form.monthly_salary_usd ? Number(form.monthly_salary_usd) : null })}
            disabled={!isFormValid || loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <CheckCircle2 className="w-4 h-4" />
            Confirm Hire
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main StatusChangerV2 ───────────────────────────────────────────────────────
export default function StatusChangerV2({
  applicationId, currentStatus, applicantName, jobTitle, jobClientId, applicantHeadline,
}: Props) {
  const router = useRouter()
  const [selected,        setSelected]        = useState(currentStatus)
  const [loading,         setLoading]         = useState(false)
  const [pendingStatus,   setPendingStatus]   = useState<string | null>(null)
  const [showCommentModal,setShowCommentModal]= useState(false)
  const [showHireModal,   setShowHireModal]   = useState(false)
  const [error,           setError]           = useState<string | null>(null)

  const initiateChange = (newStatus: string) => {
    if (newStatus === selected || loading) return
    // Enforce strict pipeline flow
    if (!isValidTransition(selected, newStatus)) return
    setError(null)
    setPendingStatus(newStatus)

    if (newStatus === 'hired') {
      setShowHireModal(true)
    } else {
      // All transitions require justification
      setShowCommentModal(true)
    }
  }

  const executeChange = async (
    newStatus: string,
    comment: string | null,
    hireData: Record<string, unknown> | null
  ) => {
    setLoading(true)
    setShowCommentModal(false)
    setShowHireModal(false)

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status: newStatus,
          comment:    comment || undefined,
          hire_data:  hireData || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSelected(newStatus)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Status change failed')
      // Don't reset selected — keep current
    } finally {
      setLoading(false)
      setPendingStatus(null)
    }
  }

  return (
    <>
      {/* Comment modal */}
      {showCommentModal && pendingStatus && (
        <CommentModal
          toStatus={pendingStatus}
          onConfirm={(comment) => executeChange(pendingStatus, comment, null)}
          onCancel={() => { setShowCommentModal(false); setPendingStatus(null) }}
          loading={loading}
        />
      )}

      {/* Hire modal */}
      {showHireModal && pendingStatus === 'hired' && (
        <HireModal
          applicantName={applicantName}
          jobTitle={jobTitle}
          jobClientId={jobClientId}
          applicantHeadline={applicantHeadline}
          onConfirm={(comment, hireData) => executeChange('hired', comment, hireData)}
          onCancel={() => { setShowHireModal(false); setPendingStatus(null) }}
          loading={loading}
        />
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Pipeline Stage</h3>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <X className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2 mb-4">
          {stages.map((stage) => {
            const isCurrent    = stage.value === selected
            const isPast       = stages.findIndex(s => s.value === selected) > stages.findIndex(s => s.value === stage.value)
            const isPending    = stage.value === pendingStatus && loading
            const canTransition = isValidTransition(selected, stage.value)
            const isDisabled   = loading || isCurrent || !canTransition

            return (
              <button
                key={stage.value}
                onClick={() => initiateChange(stage.value)}
                disabled={isDisabled}
                title={
                  isCurrent ? 'Current stage' :
                  !canTransition ? 'Complete previous stages first' :
                  'Requires written justification'
                }
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                  isCurrent
                    ? 'bg-brand-50 border border-brand-200 text-brand-700 shadow-sm cursor-default'
                    : canTransition
                    ? isPast
                      ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-600'
                    : isPast
                    ? 'bg-gray-50/50 text-gray-300 cursor-not-allowed'
                    : 'text-gray-200 cursor-not-allowed'
                } disabled:cursor-not-allowed`}
              >
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isCurrent ? stage.color : isPast ? 'bg-gray-300' : canTransition ? 'bg-gray-300' : 'bg-gray-200'}`} />
                <span className="flex-1">{stage.label}</span>
                {isPending && <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin text-brand-500" />}
                {!isCurrent && !isPending && canTransition && (
                  <span className="text-[10px] text-gray-400 ml-auto">note req.</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
