'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MoreHorizontal, Pencil, Copy, Eye, EyeOff, Archive, Trash2, ExternalLink } from 'lucide-react'
import { logAuditClient } from '@/lib/audit-client'

interface JobActionsProps {
  job: {
    id: string
    slug: string
    status: string
    title: string
  }
}

export default function JobActions({ job }: JobActionsProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleAction = async (action: string) => {
    setLoading(true)
    const supabase = createClient()

    try {
      switch (action) {
        case 'publish':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.from('jobs').update({ status: 'published' as any, published_at: new Date().toISOString() }).eq('id', job.id)
          break
        case 'unpublish':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.from('jobs').update({ status: 'draft' as any, published_at: null }).eq('id', job.id)
          break
        case 'close':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.from('jobs').update({ status: 'closed' as any, closed_at: new Date().toISOString() }).eq('id', job.id)
          break
        case 'archive':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.from('jobs').update({ status: 'archived' as any }).eq('id', job.id)
          break
        case 'duplicate': {
          const { data: original } = await supabase.from('jobs').select('*').eq('id', job.id).single()
          if (original) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            const { id, created_at, updated_at, published_at, closed_at, application_count, slug, ...rest } = original as any
            await supabase.from('jobs').insert({
              ...rest,
              title: `${rest.title} (Copy)`,
              slug: `${slug}-copy-${Date.now()}`,
              status: 'draft',
              application_count: 0,
            })
          }
          break
        }
        case 'delete':
          if (confirm(`Are you sure you want to delete "${job.title}"? This cannot be undone.`)) {
            await supabase.from('jobs').delete().eq('id', job.id)
          }
          break
      }
      // Audit log for all actions
      if (action !== 'delete' || confirm) {
        logAuditClient({
          entity_type: 'job',
          entity_id: job.id,
          action,
          metadata: { title: job.title, previous_status: job.status },
        })
      }
    } catch (err) {
      console.error('Action failed:', err)
    } finally {
      setLoading(false)
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <MoreHorizontal className="w-5 h-5" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1.5 animate-fade-in">
          <Link
            href={`/admin/jobs/${job.id}/edit`}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Pencil className="w-4 h-4 text-gray-400" />
            Edit
          </Link>
          <Link
            href={`/careers/${job.slug}`}
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            View Public Page
          </Link>
          <button
            onClick={() => handleAction('duplicate')}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-400" />
            Duplicate
          </button>
          <div className="border-t border-gray-100 my-1.5" />
          {job.status === 'draft' && (
            <button
              onClick={() => handleAction('publish')}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Publish
            </button>
          )}
          {job.status === 'published' && (
            <>
              <button
                onClick={() => handleAction('unpublish')}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                Unpublish
              </button>
              <button
                onClick={() => handleAction('close')}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Archive className="w-4 h-4" />
                Close Position
              </button>
            </>
          )}
          {job.status === 'closed' && (
            <button
              onClick={() => handleAction('archive')}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>
          )}
          <div className="border-t border-gray-100 my-1.5" />
          <button
            onClick={() => handleAction('delete')}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
