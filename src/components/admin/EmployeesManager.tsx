'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Search, MoreVertical, Pencil, Archive, ArchiveRestore, Eye,
  X, Loader2, CheckCircle2, AlertCircle, UserCheck,
  ChevronLeft, ChevronRight, DollarSign, Calendar,
} from 'lucide-react'
import type { Employee, Client } from '@/lib/types'

const PER_PAGE = 10

const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Junior', mid: 'Mid-Level', senior: 'Senior', lead: 'Lead', principal: 'Principal',
}
const EMP_TYPE_LABELS: Record<string, string> = {
  full_time_contractor:  'Full-Time Contractor',
  part_time_contractor:  'Part-Time Contractor',
  full_time_employee:    'Full-Time Employee',
  part_time_employee:    'Part-Time Employee',
}

// ── Toast ─────────────────────────────────────────────────────────────────────
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

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({ title, description, confirmLabel, danger, onConfirm, onCancel, loading }: {
  title: string; description: string; confirmLabel: string; danger?: boolean
  onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-navy-950 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'}`}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Employee Edit Modal ────────────────────────────────────────────────────────
function EmployeeEditModal({ employee, clients, onClose, onSaved }: {
  employee: Employee; clients: Client[]; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({
    full_name:          employee.full_name          || '',
    email:              employee.email              || '',
    phone:              employee.phone              || '',
    address:            employee.address            || '',
    linkedin_url:       employee.linkedin_url       || '',
    role_title:         employee.role_title         || '',
    role_category:      employee.role_category      || '',
    seniority:          employee.seniority          || '',
    start_date:         employee.start_date         || '',
    employment_type:    employee.employment_type    || '',
    monthly_salary_usd: employee.monthly_salary_usd ? String(employee.monthly_salary_usd) : '',
    client_id:          employee.client_id          || '',
    status:             employee.status             || 'active',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/admin/employees/${employee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, monthly_salary_usd: form.monthly_salary_usd ? Number(form.monthly_salary_usd) : null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSaved(); onClose()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }

  const inp = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const lbl = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-navy-950">Edit Employee</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={lbl}>Full Name *</label><input value={form.full_name} onChange={e => set('full_name', e.target.value)} required className={inp} /></div>
              <div><label className={lbl}>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className={inp} /></div>
              <div><label className={lbl}>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>LinkedIn</label><input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} className={inp} /></div>
              <div className="md:col-span-2"><label className={lbl}>Address</label><input value={form.address} onChange={e => set('address', e.target.value)} className={inp} /></div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Client *</label>
                <select value={form.client_id} onChange={e => set('client_id', e.target.value)} required className={inp}>
                  <option value="">Select client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Role Title *</label><input value={form.role_title} onChange={e => set('role_title', e.target.value)} required className={inp} /></div>
              <div><label className={lbl}>Category</label><input value={form.role_category} onChange={e => set('role_category', e.target.value)} placeholder="e.g., Frontend Development" className={inp} /></div>
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
                <label className={lbl}>Employment Type</label>
                <select value={form.employment_type} onChange={e => set('employment_type', e.target.value)} className={inp}>
                  <option value="">Select…</option>
                  <option value="full_time_contractor">Full-Time Contractor</option>
                  <option value="part_time_contractor">Part-Time Contractor</option>
                  <option value="full_time_employee">Full-Time Employee</option>
                  <option value="part_time_employee">Part-Time Employee</option>
                </select>
              </div>
              <div><label className={lbl}>Start Date</label><input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Monthly Salary (USD)</label><input type="number" value={form.monthly_salary_usd} onChange={e => set('monthly_salary_usd', e.target.value)} placeholder="e.g., 4500" className={inp} /></div>
              <div>
                <label className={lbl}>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl text-sm disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Action Menu ────────────────────────────────────────────────────────────────
function ActionMenu({ employee, onEdit, onArchive, onStatusChange }: {
  employee: Employee
  onEdit: (e: Employee) => void
  onArchive: (e: Employee) => void
  onStatusChange: (e: Employee) => void
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const scrollHandler = () => setOpen(false)
    document.addEventListener('mousedown', handler)
    document.addEventListener('scroll', scrollHandler, true)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('scroll', scrollHandler, true)
    }
  }, [])

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 260
      const openAbove = spaceBelow < menuHeight
      setMenuStyle({
        position: 'fixed',
        ...(openAbove ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
        right: window.innerWidth - rect.right,
        zIndex: 9999,
      })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div ref={menuRef} style={menuStyle} className="w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1 overflow-hidden">
          <Link href={`/admin/employees/${employee.id}`} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 text-gray-400" /> View Details
          </Link>
          <button onClick={() => { setOpen(false); onEdit(employee) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Pencil className="w-4 h-4 text-gray-400" /> Edit
          </button>
          <button onClick={() => { setOpen(false); onStatusChange(employee) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <UserCheck className="w-4 h-4 text-gray-400" /> Change Status
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { setOpen(false); onArchive(employee) }} className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${employee.is_archived ? 'text-brand-600 hover:bg-brand-50' : 'text-amber-600 hover:bg-amber-50'}`}>
            {employee.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            {employee.is_archived ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      )}
    </>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function EmployeesManager({ initialClientId }: { initialClientId?: string }) {
  const [employees,    setEmployees]    = useState<Employee[]>([])
  const [total,        setTotal]        = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [page,         setPage]         = useState(1)
  const [search,       setSearch]       = useState('')
  const [clientFilter, setClientFilter] = useState(initialClientId || '')
  const [statusFilter, setStatusFilter] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [clients,      setClients]      = useState<Client[]>([])

  const [editEmployee,    setEditEmployee]    = useState<Employee | null>(null)
  const [archiveTarget,   setArchiveTarget]   = useState<Employee | null>(null)
  const [statusTarget,    setStatusTarget]    = useState<Employee | null>(null)
  const [actionLoading,   setActionLoading]   = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type })

  // Fetch clients for filter + edit modal
  useEffect(() => {
    fetch('/api/admin/clients?status=active&page=1')
      .then(r => r.json())
      .then(d => setClients(d.clients || []))
  }, [])

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:     String(page),
        archived: String(showArchived),
        ...(search        ? { search }                : {}),
        ...(clientFilter  ? { client_id: clientFilter } : {}),
        ...(statusFilter  ? { status: statusFilter }  : {}),
      })
      const res  = await fetch(`/api/admin/employees?${params}`)
      const data = await res.json()
      if (res.ok) { setEmployees(data.employees || []); setTotal(data.total || 0) }
    } finally { setLoading(false) }
  }, [page, search, clientFilter, statusFilter, showArchived])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleArchive = async () => {
    if (!archiveTarget) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/employees/${archiveTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: !archiveTarget.is_archived }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      showToast(archiveTarget.is_archived ? 'Employee restored' : 'Employee archived', 'success')
      fetchEmployees()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error')
    } finally { setActionLoading(false); setArchiveTarget(null) }
  }

  const handleStatusChange = async () => {
    if (!statusTarget) return
    setActionLoading(true)
    const newStatus = statusTarget.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`/api/admin/employees/${statusTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      showToast(`Status changed to ${newStatus}`, 'success')
      fetchEmployees()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error')
    } finally { setActionLoading(false); setStatusTarget(null) }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {editEmployee && (
        <EmployeeEditModal
          employee={editEmployee}
          clients={clients}
          onClose={() => setEditEmployee(null)}
          onSaved={() => { showToast('Employee updated', 'success'); fetchEmployees() }}
        />
      )}
      {archiveTarget && (
        <ConfirmDialog
          title={archiveTarget.is_archived ? 'Restore Employee' : 'Archive Employee'}
          description={`"${archiveTarget.full_name}" will be ${archiveTarget.is_archived ? 'restored' : 'archived'}.`}
          confirmLabel={archiveTarget.is_archived ? 'Restore' : 'Archive'}
          danger={!archiveTarget.is_archived}
          onConfirm={handleArchive}
          onCancel={() => setArchiveTarget(null)}
          loading={actionLoading}
        />
      )}
      {statusTarget && (
        <ConfirmDialog
          title="Change Employee Status"
          description={`Change "${statusTarget.full_name}" from ${statusTarget.status} to ${statusTarget.status === 'active' ? 'inactive' : 'active'}?`}
          confirmLabel="Confirm Change"
          onConfirm={handleStatusChange}
          onCancel={() => setStatusTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Employees</h1>
          <p className="text-gray-500 mt-1">{total} {showArchived ? 'archived' : 'active'} employee{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name, email or role…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
        </div>
        <select
          value={clientFilter}
          onChange={e => { setClientFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
        >
          <option value="">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <label className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition-colors select-none">
          <input type="checkbox" checked={showArchived} onChange={e => { setShowArchived(e.target.checked); setPage(1) }} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          See Archived
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-950 mb-1">{showArchived ? 'No archived employees' : 'No employees yet'}</h3>
            <p className="text-sm text-gray-500">Employees are created automatically when a candidate is hired.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Client</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Salary</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Start Date</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0">
                            {emp.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/admin/employees/${emp.id}`} className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
                              {emp.full_name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-0.5">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-navy-950">{emp.role_title}</p>
                        {emp.seniority && <p className="text-xs text-gray-500">{SENIORITY_LABELS[emp.seniority] || emp.seniority}</p>}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {emp.clients?.name || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {emp.monthly_salary_usd ? (
                          <span className="text-sm text-navy-950 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-green-500" />
                            {emp.monthly_salary_usd.toLocaleString()}/mo
                          </span>
                        ) : <span className="text-sm text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          emp.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {emp.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          {emp.start_date ? (
                            <><Calendar className="w-3.5 h-3.5 text-gray-400" />{new Date(emp.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                          ) : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ActionMenu
                          employee={emp}
                          onEdit={setEditEmployee}
                          onArchive={setArchiveTarget}
                          onStatusChange={setStatusTarget}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
