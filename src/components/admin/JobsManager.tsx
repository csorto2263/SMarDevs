'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Search, Plus, MoreHorizontal, Pencil, Copy, Eye, EyeOff,
  Archive, Trash2, ExternalLink, Globe, ChevronLeft, ChevronRight,
  Briefcase, X, Loader2, CheckCircle2, AlertCircle, Building2,
} from 'lucide-react'

const PER_PAGE = 10

interface Job {
  id: string
  title: string
  slug: string
  status: string
  seniority: string
  location: string
  application_count: number
  created_at: string
  client_id: string | null
  job_categories: { id: string; name: string } | null
  clients: { id: string; name: string } | null
}

interface Client {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface Props {
  initialClients: Client[]
  initialCategories: Category[]
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  )
}

// ── Status badge config ────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string }> = {
  draft:     { label: 'Draft',     color: 'bg-gray-100 text-gray-700' },
  published: { label: 'Published', color: 'bg-green-100 text-green-700' },
  closed:    { label: 'Closed',    color: 'bg-red-100 text-red-700' },
  archived:  { label: 'Archived',  color: 'bg-gray-100 text-gray-500' },
}

const seniorityLabel: Record<string, string> = {
  junior:    'Junior',
  mid:       'Mid-Level',
  senior:    'Senior',
  lead:      'Lead',
  principal: 'Principal',
}

// ── Action Menu ────────────────────────────────────────────────────────────────
function ActionMenu({ job, onAction }: { job: Job; onAction: (id: string, action: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const act = (action: string) => { setOpen(false); onAction(job.id, action) }

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1.5 animate-fade-in">
          <Link
            href={`/admin/jobs/${job.id}/edit`}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Pencil className="w-4 h-4 text-gray-400" /> Edit
          </Link>
          <Link
            href={`/careers/${job.slug}`}
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="w-4 h-4 text-gray-400" /> View Public Page
          </Link>
          <button
            onClick={() => act('duplicate')}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-400" /> Duplicate
          </button>
          <div className="border-t border-gray-100 my-1.5" />
          {job.status === 'draft' && (
            <button onClick={() => act('publish')} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors">
              <Eye className="w-4 h-4" /> Publish
            </button>
          )}
          {job.status === 'published' && (
            <>
              <button onClick={() => act('unpublish')} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors">
                <EyeOff className="w-4 h-4" /> Unpublish
              </button>
              <button onClick={() => act('close')} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <Archive className="w-4 h-4" /> Close Position
              </button>
            </>
          )}
          {job.status === 'closed' && (
            <button onClick={() => act('archive')} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Archive className="w-4 h-4" /> Archive
            </button>
          )}
          <div className="border-t border-gray-100 my-1.5" />
          <button onClick={() => act('delete')} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function JobsManager({ initialClients, initialCategories }: Props) {
  const router = useRouter()
  const [jobs, setJobs]         = useState<Job[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)

  // Filters
  const [search,     setSearch]     = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter,    setStatusFilter]    = useState('all')
  const [clientFilter,    setClientFilter]    = useState('')
  const [categoryFilter,  setCategoryFilter]  = useState('')
  const [page, setPage] = useState(1)

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type })

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [statusFilter, clientFilter, categoryFilter])

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(clientFilter   && { client_id:   clientFilter }),
      ...(categoryFilter && { category_id: categoryFilter }),
    })
    const res = await fetch(`/api/admin/jobs?${params}`)
    if (res.ok) {
      const d = await res.json()
      setJobs(d.jobs || [])
      setTotal(d.total || 0)
    }
    setLoading(false)
  }, [page, debouncedSearch, statusFilter, clientFilter, categoryFilter])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  // Actions
  const handleAction = async (id: string, action: string) => {
    const job = jobs.find(j => j.id === id)
    if (!job) return

    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete "${job.title}"? This cannot be undone.`)) return
    }

    setActingId(id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any

    try {
      switch (action) {
        case 'publish':
          await supabase.from('jobs').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id)
          showToast(`"${job.title}" published`, 'success')
          break
        case 'unpublish':
          await supabase.from('jobs').update({ status: 'draft', published_at: null }).eq('id', id)
          showToast(`"${job.title}" unpublished`, 'success')
          break
        case 'close':
          await supabase.from('jobs').update({ status: 'closed', closed_at: new Date().toISOString() }).eq('id', id)
          showToast(`"${job.title}" closed`, 'success')
          break
        case 'archive':
          await supabase.from('jobs').update({ status: 'archived' }).eq('id', id)
          showToast(`"${job.title}" archived`, 'success')
          break
        case 'duplicate': {
          const { data: orig } = await supabase.from('jobs').select('*').eq('id', id).single()
          if (orig) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _id, created_at, updated_at, published_at, closed_at, application_count, slug, ...rest } = orig
            await supabase.from('jobs').insert({
              ...rest,
              title: `${rest.title} (Copy)`,
              slug: `${slug}-copy-${Date.now()}`,
              status: 'draft',
              application_count: 0,
            })
            showToast(`"${job.title}" duplicated`, 'success')
          }
          break
        }
        case 'delete':
          await supabase.from('jobs').delete().eq('id', id)
          showToast(`"${job.title}" deleted`, 'success')
          break
      }
    } catch {
      showToast('Action failed', 'error')
    }

    setActingId(null)
    router.refresh()
    fetchJobs()
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const hasFilters = debouncedSearch || statusFilter !== 'all' || clientFilter || categoryFilter

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Jobs</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading…' : `${total} total position${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-600/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </select>

        {/* Client filter */}
        {initialClients.length > 0 && (
          <select
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="">All Clients</option>
            {initialClients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        {/* Category filter */}
        {initialCategories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {initialCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-950 mb-1">
              {hasFilters ? 'No jobs match your filters' : 'No jobs yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {hasFilters ? 'Try adjusting your search or filters' : 'Create your first job listing to get started'}
            </p>
            {hasFilters ? (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); setClientFilter(''); setCategoryFilter('') }}
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
              >
                <X className="w-4 h-4" /> Clear filters
              </button>
            ) : (
              <Link href="/admin/jobs/new" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
                <Plus className="w-4 h-4" /> Create Job
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seniority</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map(job => (
                  <tr key={job.id} className={`hover:bg-gray-50/50 transition-colors ${actingId === job.id ? 'opacity-60' : ''}`}>
                    {/* Position */}
                    <td className="px-5 py-4">
                      <div>
                        <Link href={`/admin/jobs/${job.id}/edit`} className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <Globe className="w-3 h-3" />
                          {job.location}
                        </p>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-5 py-4">
                      {job.clients ? (
                        <Link
                          href={`/admin/clients/${job.clients.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-600 transition-colors font-medium"
                        >
                          <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {job.clients.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{job.job_categories?.name || '—'}</span>
                    </td>

                    {/* Seniority */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{seniorityLabel[job.seniority] || job.seniority}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[job.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {statusConfig[job.status]?.label || job.status}
                      </span>
                    </td>

                    {/* Applications */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{job.application_count || 0}</span>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <ActionMenu job={job} onAction={handleAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 min-w-[80px] text-center">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
