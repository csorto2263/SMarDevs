'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Plus, MoreVertical, Pencil, Archive, ArchiveRestore,
  X, Loader2, CheckCircle2, AlertCircle, Building2,
  ChevronLeft, ChevronRight, Eye, Globe, Phone, Mail, User,
} from 'lucide-react'
import type { Client } from '@/lib/types'

const PER_PAGE = 10

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
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'}`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Client Modal (Create / Edit) ───────────────────────────────────────────────
function ClientModal({ client, onClose, onSaved }: {
  client: Client | null; onClose: () => void; onSaved: () => void
}) {
  const isEdit = !!client
  const [form, setForm] = useState({
    name:                    client?.name                    || '',
    company_address:         client?.company_address         || '',
    company_phone:           client?.company_phone           || '',
    website:                 client?.website                 || '',
    primary_contact_name:    client?.primary_contact_name    || '',
    primary_contact_email:   client?.primary_contact_email   || '',
    primary_contact_phone:   client?.primary_contact_phone   || '',
    secondary_contact_name:  client?.secondary_contact_name  || '',
    secondary_contact_email: client?.secondary_contact_email || '',
    secondary_contact_phone: client?.secondary_contact_phone || '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Client name is required'); return }
    setLoading(true)
    setError('')
    try {
      const url    = isEdit ? `/api/admin/clients/${client!.id}` : '/api/admin/clients'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      onSaved()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const lbl = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-navy-950">{isEdit ? 'Edit Client' : 'Add Client'}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          {/* Company info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Company Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Acme Corp" className={inp} />
              </div>
              <div>
                <label className={lbl}>Company Phone</label>
                <input value={form.company_phone} onChange={e => set('company_phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inp} />
              </div>
              <div>
                <label className={lbl}>Website</label>
                <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://acme.com" className={inp} />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Company Address</label>
                <input value={form.company_address} onChange={e => set('company_address', e.target.value)} placeholder="123 Main St, City, State, Country" className={inp} />
              </div>
            </div>
          </div>

          {/* Primary contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Primary Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Full Name</label>
                <input value={form.primary_contact_name} onChange={e => set('primary_contact_name', e.target.value)} placeholder="Jane Smith" className={inp} />
              </div>
              <div>
                <label className={lbl}>Email</label>
                <input type="email" value={form.primary_contact_email} onChange={e => set('primary_contact_email', e.target.value)} placeholder="jane@acme.com" className={inp} />
              </div>
              <div>
                <label className={lbl}>Phone</label>
                <input value={form.primary_contact_phone} onChange={e => set('primary_contact_phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inp} />
              </div>
            </div>
          </div>

          {/* Secondary contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Secondary Contact <span className="text-gray-400 font-normal normal-case">(optional)</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Full Name</label>
                <input value={form.secondary_contact_name} onChange={e => set('secondary_contact_name', e.target.value)} placeholder="John Doe" className={inp} />
              </div>
              <div>
                <label className={lbl}>Email</label>
                <input type="email" value={form.secondary_contact_email} onChange={e => set('secondary_contact_email', e.target.value)} placeholder="john@acme.com" className={inp} />
              </div>
              <div>
                <label className={lbl}>Phone</label>
                <input value={form.secondary_contact_phone} onChange={e => set('secondary_contact_phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inp} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all text-sm disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Action Menu ────────────────────────────────────────────────────────────────
function ActionMenu({ client, onEdit, onArchive }: {
  client: Client
  onEdit: (c: Client) => void
  onArchive: (c: Client) => void
}) {
  const [open, setOpen] = useState(false)
  const isArchived = client.status === 'archived'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
            <Link
              href={`/admin/clients/${client.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-400" />
              View Details
            </Link>
            <button
              onClick={() => { setOpen(false); onEdit(client) }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
              Edit
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={() => { setOpen(false); onArchive(client) }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${isArchived ? 'text-brand-600 hover:bg-brand-50' : 'text-amber-600 hover:bg-amber-50'}`}
            >
              {isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              {isArchived ? 'Unarchive' : 'Archive'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ClientsManager() {
  const [clients,      setClients]      = useState<Client[]>([])
  const [total,        setTotal]        = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [page,         setPage]         = useState(1)
  const [search,       setSearch]       = useState('')
  const [showArchived, setShowArchived] = useState(false)

  const [showCreate,      setShowCreate]      = useState(false)
  const [editClient,      setEditClient]      = useState<Client | null>(null)
  const [archiveTarget,   setArchiveTarget]   = useState<Client | null>(null)
  const [actionLoading,   setActionLoading]   = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type })

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:   String(page),
        status: showArchived ? 'archived' : 'active',
        ...(search ? { search } : {}),
      })
      const res  = await fetch(`/api/admin/clients?${params}`)
      const data = await res.json()
      if (res.ok) { setClients(data.clients || []); setTotal(data.total || 0) }
    } finally {
      setLoading(false)
    }
  }, [page, search, showArchived])

  useEffect(() => { fetchClients() }, [fetchClients])

  // Debounce search
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleArchive = async () => {
    if (!archiveTarget) return
    setActionLoading(true)
    try {
      const newStatus = archiveTarget.status === 'archived' ? 'active' : 'archived'
      const res = await fetch(`/api/admin/clients/${archiveTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(newStatus === 'archived' ? 'Client archived' : 'Client restored', 'success')
      fetchClients()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error')
    } finally {
      setActionLoading(false)
      setArchiveTarget(null)
    }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      {showCreate && (
        <ClientModal client={null} onClose={() => setShowCreate(false)} onSaved={() => { showToast('Client added', 'success'); fetchClients() }} />
      )}
      {editClient && (
        <ClientModal client={editClient} onClose={() => setEditClient(null)} onSaved={() => { showToast('Client updated', 'success'); fetchClients() }} />
      )}
      {archiveTarget && (
        <ConfirmDialog
          title={archiveTarget.status === 'archived' ? 'Restore Client' : 'Archive Client'}
          description={archiveTarget.status === 'archived'
            ? `"${archiveTarget.name}" will be restored and become active again.`
            : `"${archiveTarget.name}" will be archived. It won't be deleted but will be hidden from the active list.`}
          confirmLabel={archiveTarget.status === 'archived' ? 'Restore' : 'Archive'}
          danger={archiveTarget.status !== 'archived'}
          onConfirm={handleArchive}
          onCancel={() => setArchiveTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Clients</h1>
          <p className="text-gray-500 mt-1">{total} {showArchived ? 'archived' : 'active'} client{total !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-600/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name or contact email…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
        </div>
        <label className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition-colors select-none">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={e => { setShowArchived(e.target.checked); setPage(1) }}
            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          See Archived
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-950 mb-1">
              {showArchived ? 'No archived clients' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {showArchived ? 'Archived clients will appear here.' : 'Add your first client to get started.'}
            </p>
            {!showArchived && (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Client
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Primary Contact</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Website</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Added</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/admin/clients/${client.id}`} className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
                              {client.name}
                            </Link>
                            {client.company_address && (
                              <p className="text-xs text-gray-500 mt-0.5">{client.company_address}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {client.primary_contact_name ? (
                          <div>
                            <p className="text-sm text-navy-950 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              {client.primary_contact_name}
                            </p>
                            {client.primary_contact_email && (
                              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {client.primary_contact_email}
                              </p>
                            )}
                            {client.primary_contact_phone && (
                              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {client.primary_contact_phone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {client.website ? (
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 transition-colors">
                            <Globe className="w-3.5 h-3.5" />
                            {client.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          client.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {client.status === 'active' ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">
                          {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ActionMenu
                          client={client}
                          onEdit={setEditClient}
                          onArchive={setArchiveTarget}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
