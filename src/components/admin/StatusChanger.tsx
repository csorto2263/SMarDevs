'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

const stages = [
  { value: 'applied', label: 'Applied', color: 'bg-gray-500' },
  { value: 'screening', label: 'Screening', color: 'bg-blue-500' },
  { value: 'interview', label: 'Interview', color: 'bg-indigo-500' },
  { value: 'technical_review', label: 'Technical Review', color: 'bg-purple-500' },
  { value: 'final_interview', label: 'Final Interview', color: 'bg-amber-500' },
  { value: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { value: 'hired', label: 'Hired', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-400' },
]

interface Props {
  applicationId: string
  currentStatus: string
}

export default function StatusChanger({ applicationId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(currentStatus)

  const handleChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    setLoading(true)
    setSelected(newStatus)

    const supabase = createClient()
    const { error } = await supabase
      .from('applications')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ status: newStatus as any })
      .eq('id', applicationId)

    if (error) {
      console.error('Status change failed:', error)
      setSelected(currentStatus)
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-navy-950 mb-4 uppercase tracking-wider">Pipeline Stage</h3>

      {/* Visual pipeline */}
      <div className="space-y-2 mb-4">
        {stages.map((stage) => {
          const isCurrent = stage.value === selected
          const isPast = stages.findIndex(s => s.value === selected) > stages.findIndex(s => s.value === stage.value)

          return (
            <button
              key={stage.value}
              onClick={() => handleChange(stage.value)}
              disabled={loading}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                isCurrent
                  ? 'bg-brand-50 border border-brand-200 text-brand-700 shadow-sm'
                  : isPast
                  ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isCurrent ? stage.color : isPast ? 'bg-gray-300' : 'bg-gray-200'}`} />
              {stage.label}
              {isCurrent && loading && <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
