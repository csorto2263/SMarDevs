'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Archive, ArchiveRestore, MoreVertical, X, Loader2, UserCheck } from 'lucide-react'
import type { Employee, Client } from '@/lib/types'

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
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res  = await fetch(`/api/admin/employees/${employee.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, monthly_salary_usd: form.monthly_salary_usd ? Number(form.monthly_salary_usd) : null }) })
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
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lbl}>Full Name *</label><input value={form.full_name} onChange={e => set('full_name', e.target.value)} required className={inp} /></div>
            <div><label className={lbl}>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className={inp} /></div>
            <div><label className={lbl}>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className={inp} /></div>
            <div><label className={lbl}>LinkedIn</label><input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} className={inp} /></div>
            <div className="md:col-span-2"><label className={lbl}>Address</label><input value={form.address} onChange={e => set('address', e.target.value)} className={inp} /></div>
            <div className="md:col-span-2">
              <label className={lbl}>Client *</label>
              <select value={form.client_id} onChange={e => set('client_id', e.target.value)} required className={inp}>
                <option value="">Select…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Role Title *</label><input value={form.role_title} onChange={e => set('role_title', e.target.value)} required className={inp} /></div>
            <div><label className={lbl}>Category</label><input value={form.role_category} onChange={e => set('role_category', e.target.value)} className={inp} /></div>
            <div>
              <label className={lbl}>Seniority</label>
              <select value={form.seniority} onChange={e => set('seniority', e.target.value)} className={inp}>
                <option value="">Select…</option><option value="junior">Junior</option><option value="mid">Mid-Level</option><option value="senior">Senior</option><option value="lead">Lead</option><option value="principal">Principal</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Employment Type</label>
              <select value={form.employment_type} onChange={e => set('employment_type', e.target.value)} className={inp}>
                <option value="">Select…</option><option value="full_time_contractor">Full-Time Contractor</option><option value="part_time_contractor">Part-Time Contractor</option><option value="full_time_employee">Full-Time Employee</option><option value="part_time_employee">Part-Time Employee</option>
              </select>
            </div>
            <div><label className={lbl}>Start Date</label><input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Monthly Salary (USD)</label><input type="number" value={form.monthly_salary_usd} onChange={e => set('monthly_salary_usd', e.target.value)} className={inp} /></div>
            <div>
              <label className={lbl}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
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

export default function EmployeeDetailActions({ employee, clients }: { employee: Employee; clients: Client[] }) {
  const router = useRouter()
  const [open,      setOpen]      = useState(false)
  const [showEdit,  setShowEdit]  = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleArchive = async () => {
    setLoading(true)
    await fetch(`/api/admin/employees/${employee.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_archived: !employee.is_archived }),
    })
    setLoading(false); router.refresh()
  }

  const handleStatusChange = async () => {
    setLoading(true)
    await fetch(`/api/admin/employees/${employee.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: employee.status === 'active' ? 'inactive' : 'active' }),
    })
    setLoading(false); router.refresh()
  }

  return (
    <>
      {showEdit && <EmployeeEditModal employee={employee} clients={clients} onClose={() => setShowEdit(false)} onSaved={() => { setShowEdit(false); router.refresh() }} />}
      <div className="relative">
        <button onClick={() => setOpen(o => !o)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-10 z-20 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
              <button onClick={() => { setOpen(false); setShowEdit(true) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Pencil className="w-4 h-4 text-gray-400" /> Edit Employee
              </button>
              <button onClick={() => { setOpen(false); handleStatusChange() }} disabled={loading} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <UserCheck className="w-4 h-4 text-gray-400" />
                {employee.status === 'active' ? 'Mark Inactive' : 'Mark Active'}
              </button>
              <div className="border-t border-gray-100" />
              <button onClick={() => { setOpen(false); handleArchive() }} disabled={loading} className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm ${employee.is_archived ? 'text-brand-600 hover:bg-brand-50' : 'text-amber-600 hover:bg-amber-50'}`}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : employee.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                {employee.is_archived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
