'use client'

import { useState } from 'react'
import { History, X, ArrowRight, User, MessageSquare } from 'lucide-react'
import type { StatusHistoryEntry } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  applied:          'Applied',
  screening:        'Screening',
  interview:        'Interview',
  technical_review: 'Technical Review',
  final_interview:  'Final Interview',
  offer:            'Offer',
  hired:            'Hired',
  rejected:         'Rejected',
  withdrawn:        'Withdrawn',
}

const STATUS_COLORS: Record<string, string> = {
  applied:          'bg-gray-100 text-gray-600',
  screening:        'bg-blue-100 text-blue-700',
  interview:        'bg-indigo-100 text-indigo-700',
  technical_review: 'bg-purple-100 text-purple-700',
  final_interview:  'bg-amber-100 text-amber-700',
  offer:            'bg-emerald-100 text-emerald-700',
  hired:            'bg-green-100 text-green-700',
  rejected:         'bg-red-100 text-red-700',
  withdrawn:        'bg-gray-100 text-gray-500',
}

const STATUS_DOT: Record<string, string> = {
  applied:          'bg-gray-400',
  screening:        'bg-blue-500',
  interview:        'bg-indigo-500',
  technical_review: 'bg-purple-500',
  final_interview:  'bg-amber-500',
  offer:            'bg-emerald-500',
  hired:            'bg-green-500',
  rejected:         'bg-red-500',
  withdrawn:        'bg-gray-400',
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: any[]
  count: number
}

export default function PipelineHistoryDrawer({ history, count }: Props) {
  const [open, setOpen] = useState(false)

  const sorted = [...(history || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) as StatusHistoryEntry[]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
      >
        <History className="w-4 h-4" />
        View History ({count})
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-navy-950">Pipeline History</h2>
                <p className="text-sm text-gray-500 mt-0.5">{count} status change{count !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {sorted.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No history recorded yet.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100" />

                  <div className="space-y-6">
                    {sorted.map((entry, i) => (
                      <div key={entry.id} className="relative flex gap-4">
                        {/* Dot */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${STATUS_DOT[entry.to_status] || 'bg-gray-300'}`}>
                            <span className="w-2 h-2 rounded-full bg-white/70" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-1">
                          {/* Status transition */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {entry.from_status && (
                              <>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[entry.from_status] || 'bg-gray-100 text-gray-600'}`}>
                                  {STATUS_LABELS[entry.from_status] || entry.from_status}
                                </span>
                                <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                              </>
                            )}
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[entry.to_status] || 'bg-gray-100 text-gray-600'}`}>
                              {STATUS_LABELS[entry.to_status] || entry.to_status}
                            </span>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(entry as any).profiles?.full_name && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(entry as any).profiles.full_name}
                              </span>
                            )}
                            <span>·</span>
                            <span>
                              {new Date(entry.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* Comment / note */}
                          {entry.note && (
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <MessageSquare className="w-3 h-3 text-gray-400" />
                                <span className="text-xs font-medium text-gray-500">Justification</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{entry.note}</p>
                            </div>
                          )}

                          {/* First entry marker */}
                          {i === sorted.length - 1 && (
                            <p className="text-xs text-gray-400 mt-1 italic">Application created</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
