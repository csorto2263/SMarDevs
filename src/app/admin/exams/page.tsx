'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Search, Plus, BookOpen, Loader2, ChevronLeft, ChevronRight,
  FileText, Timer, BarChart3, MoreVertical, Eye, Pencil,
  ToggleLeft, ToggleRight, Trash2,
} from 'lucide-react'

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
}

interface Category {
  id: string
  name: string
}

interface ExamActionMenuProps {
  exam: Exam
  onToggleActive: (exam: Exam) => void
  onDelete: (id: string) => void
  deleting: boolean
}

function ExamActionMenu({ exam, onToggleActive, onDelete, deleting }: ExamActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const menuHeight = 200
      const spaceBelow = window.innerHeight - rect.bottom
      const openAbove = spaceBelow < menuHeight
      setMenuStyle({
        position: 'fixed',
        ...(openAbove
          ? { bottom: window.innerHeight - rect.top + 4 }
          : { top: rect.bottom + 4 }),
        right: window.innerWidth - rect.right,
        zIndex: 9999,
      })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleScroll = () => setOpen(false)
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  return (
    <div className="relative inline-flex">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm"
        >
          <Link
            href={`/admin/exams/${exam.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-400" />
            View Details
          </Link>
          <Link
            href={`/admin/exams/${exam.id}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-400" />
            Edit Exam
          </Link>

          <div className="border-t border-gray-100 my-1" />

          <button
            onClick={() => { setOpen(false); onToggleActive(exam) }}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {exam.is_active
              ? <ToggleLeft className="w-4 h-4 text-gray-400" />
              : <ToggleRight className="w-4 h-4 text-gray-400" />}
            {exam.is_active ? 'Deactivate' : 'Activate'}
          </button>

          <div className="border-t border-gray-100 my-1" />

          <button
            onClick={() => { setOpen(false); onDelete(exam.id) }}
            disabled={deleting}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchExams = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (categoryFilter) params.set('category_id', categoryFilter)
    if (activeFilter) params.set('active', activeFilter)
    params.set('page', String(page))

    try {
      const res = await fetch(`/api/admin/exams?${params}`)
      const data = await res.json()
      setExams(data.exams || [])
      setTotal(data.total || 0)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [search, categoryFilter, activeFilter, page])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/exam-categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch {
      // silent
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])
  useEffect(() => { fetchExams() }, [fetchExams])

  const toggleActive = async (exam: Exam) => {
    await fetch(`/api/admin/exams/${exam.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !exam.is_active }),
    })
    fetchExams()
  }

  const deleteExam = async (id: string) => {
    if (!confirm('Delete this exam? This cannot be undone.')) return
    setDeleting(id)
    const res = await fetch(`/api/admin/exams/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || 'Failed to delete')
    }
    setDeleting(null)
    fetchExams()
  }

  const totalPages = Math.ceil(total / 20)
  const selectClasses = 'px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Exam Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage technical assessments and questions</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          New Exam
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search exams..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className={selectClasses}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value); setPage(1) }}
          className={selectClasses}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No exams found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pass %</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exams.map(exam => (
                  <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/exams/${exam.id}`} className="group">
                        <p className="font-medium text-navy-950 group-hover:text-brand-600 transition-colors">{exam.title}</p>
                        {exam.description && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{exam.description}</p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {exam.exam_categories?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <FileText className="w-3.5 h-3.5" />
                        {exam.question_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <Timer className="w-3.5 h-3.5" />
                        {exam.duration_minutes}m
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {exam.passing_score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        exam.is_active
                          ? 'text-green-700 bg-green-50'
                          : 'text-gray-500 bg-gray-100'
                      }`}>
                        {exam.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        {exam.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ExamActionMenu
                        exam={exam}
                        onToggleActive={toggleActive}
                        onDelete={deleteExam}
                        deleting={deleting === exam.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{total} exam{total !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
