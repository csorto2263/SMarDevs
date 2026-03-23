'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Archive, ArchiveRestore, MoreVertical, X, Loader2 } from 'lucide-react'
import type { Client } from '@/lib/types'

function ClientModal({ client, onClose, onSaved }: {
  client: Client; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({
    name:                    client.name                    || '',
    company_address:         client.company_address         || '',
    company_phone:           client.company_phone           || '',
    website:                 client.website                 || '',
    primary_contact_name:    client.primary_contact_name    || '',
    primary_contact_email:   client.primary_contact_email   || '',
    primary_contact_phone:   client.primary_contact_phone   || '',
    secondary_contact_name:  client.secondary_contact_name  || '',
    secondary_contact_email: client.secondary_contact_email || '',
    secondary_contact_phone: client.secondary_contact_phone || '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res  = await fetch(`/api/admin/clients/${client.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
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
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-navy-950">Edit Client</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className={lbl}>Company Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} required className={inp} /></div>
            <div><label className={lbl}>Phone</label><input value={form.company_phone} onChange={e => set('company_phone', e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Website</label><input value={form.website} onChange={e => set('website', e.target.value)} className={inp} /></div>
            <div className="md:col-span-2"><label className={lbl}>Address</label><input value={form.company_address} onChange={e => set('company_address', e.target.value)} className={inp} /></div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Primary Contact</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className={lbl}>Name</label><input value={form.primary_contact_name} onChange={e => set('primary_contact_name', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Email</label><input type="email" value={form.primary_contact_email} onChange={e => set('primary_contact_email', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Phone</label><input value={form.primary_contact_phone} onChange={e => set('primary_contact_phone', e.target.value)} className={inp} /></div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Secondary Contact</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className={lbl}>Name</label><input value={form.secondary_contact_name} onChange={e => set('secondary_contact_name', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Email</label><input type="email" value={form.secondary_contact_email} onChange={e => set('secondary_contact_email', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Phone</label><input value={form.secondary_contact_phone} onChange={e => set('secondary_contact_phone', e.target.value)} className={inp} /></div>
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

export default function ClientDetailActions({ client }: { client: Client }) {
  const router = useRouter()
  const [open,        setOpen]        = useState(false)
  const [showEdit,    setShowEdit]    = useState(false)
  const [archiving,   setArchiving]   = useState(false)
  const isArchived = client.status === 'archived'

  const handleArchive = async () => {
    setArchiving(true)
    await fetch(`/api/admin/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: isArchived ? 'active' : 'archived' }),
    })
    setArchiving(false)
    router.refresh()
  }

  return (
    <>
      {showEdit && <ClientModal client={client} onClose={() => setShowEdit(false)} onSaved={() => { setShowEdit(false); router.refresh() }} />}
      <div className="relative">
        <button onClick={() => setOpen(o => !o)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-10 z-20 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
              <button onClick={() => { setOpen(false); setShowEdit(true) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Pencil className="w-4 h-4 text-gray-400" /> Edit Client
              </button>
              <div className="border-t border-gray-100" />
              <button onClick={() => { setOpen(false); handleArchive() }} disabled={archiving} className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${isArchived ? 'text-brand-600 hover:bg-brand-50' : 'text-amber-600 hover:bg-amber-50'}`}>
                {archiving ? <Loader2 className="w-4 h-4 animate-spin" /> : isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                {isArchived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
