'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, Plus, MoreVertical, Pencil, Archive, ArchiveRestore,
  KeyRound, Trash2, X, Loader2, CheckCircle2, AlertCircle,
  UserCog, ChevronLeft, ChevronRight, ShieldCheck, User
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  status: string
  phone: string | null
  created_at: string
  updated_at: string
}

const ROLES = ['admin', 'member']
const ROLE_LABELS: Record<string, string> = { admin: 'Admin', member: 'Member' }
const STATUS_LABELS: Record<string, string> = { active: 'Active', archived: 'Archived' }

const COUNTRIES = [
  { code: 'HN', dial: '+504', name: 'Honduras' },
  { code: 'US', dial: '+1',   name: 'United States' },
  { code: 'CA', dial: '+1',   name: 'Canada' },
  { code: 'MX', dial: '+52',  name: 'Mexico' },
  { code: 'GT', dial: '+502', name: 'Guatemala' },
  { code: 'SV', dial: '+503', name: 'El Salvador' },
  { code: 'NI', dial: '+505', name: 'Nicaragua' },
  { code: 'CR', dial: '+506', name: 'Costa Rica' },
  { code: 'PA', dial: '+507', name: 'Panama' },
  { code: 'DO', dial: '+1',   name: 'Dominican Republic' },
  { code: 'CO', dial: '+57',  name: 'Colombia' },
  { code: 'VE', dial: '+58',  name: 'Venezuela' },
  { code: 'PE', dial: '+51',  name: 'Peru' },
  { code: 'EC', dial: '+593', name: 'Ecuador' },
  { code: 'BO', dial: '+591', name: 'Bolivia' },
  { code: 'CL', dial: '+56',  name: 'Chile' },
  { code: 'AR', dial: '+54',  name: 'Argentina' },
  { code: 'BR', dial: '+55',  name: 'Brazil' },
  { code: 'UY', dial: '+598', name: 'Uruguay' },
  { code: 'PY', dial: '+595', name: 'Paraguay' },
  { code: 'GB', dial: '+44',  name: 'United Kingdom' },
  { code: 'ES', dial: '+34',  name: 'Spain' },
  { code: 'DE', dial: '+49',  name: 'Germany' },
  { code: 'FR', dial: '+33',  name: 'France' },
  { code: 'IT', dial: '+39',  name: 'Italy' },
  { code: 'PT', dial: '+351', name: 'Portugal' },
  { code: 'IN', dial: '+91',  name: 'India' },
  { code: 'AU', dial: '+61',  name: 'Australia' },
]

function countryFlag(code: string) {
  return Array.from(code.toUpperCase()).map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))).join('')
}

function parsePhone(stored: string | null): { dial: string; number: string } {
  if (!stored) return { dial: '+504', number: '' }
  const match = COUNTRIES.slice().sort((a, b) => b.dial.length - a.dial.length).find(c => stored.startsWith(c.dial + ' '))
  if (match) return { dial: match.dial, number: stored.slice(match.dial.length + 1) }
  return { dial: '+504', number: stored }
}
const PER_PAGE = 10

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium transition-all ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  )
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
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

// ── User Modal (Create / Edit) ────────────────────────────────────────────────
function UserModal({ user, onClose, onSaved }: {
  user: UserProfile | null; onClose: () => void; onSaved: () => void
}) {
  const isEdit = !!user
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [emailError, setEmailError] = useState('')
  const [role, setRole] = useState(user?.role || 'member')
  const parsedPhone = parsePhone(user?.phone ?? null)
  const [phoneDial, setPhoneDial] = useState(parsedPhone.dial)
  const [phoneNumber, setPhoneNumber] = useState(parsedPhone.number)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (v: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
    setEmailError(ok || !v ? '' : 'Enter a valid email (e.g. john@company.com)')
    return ok
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEdit && !validateEmail(email)) return
    setLoading(true); setError('')
    const phone = phoneNumber.trim() ? `${phoneDial} ${phoneNumber.trim()}` : ''
    try {
      const res = await fetch(
        isEdit ? `/api/admin/users/${user!.id}` : '/api/admin/users',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(isEdit ? { full_name: fullName, role, phone } : { email, full_name: fullName, role, phone }),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      onSaved()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-navy-950">{isEdit ? 'Edit User' : 'Create User'}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <div>
            <label className={labelCls}>Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" className={inputCls} />
          </div>

          {!isEdit && (
            <div>
              <label className={labelCls}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value) }}
                onBlur={e => validateEmail(e.target.value)}
                required
                placeholder="john@company.com"
                className={`${inputCls} ${emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              />
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
              <p className="mt-1.5 text-xs text-gray-400">A password reset link will be sent to this email so the user can set their password.</p>
            </div>
          )}

          <div>
            <label className={labelCls}>Role *</label>
            <select value={role} onChange={e => setRole(e.target.value)} required className={inputCls}>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Celular *</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 transition-all">
              <select
                value={phoneDial}
                onChange={e => setPhoneDial(e.target.value)}
                className="shrink-0 bg-gray-50 border-r border-gray-200 px-2 py-2.5 text-sm text-navy-950 focus:outline-none cursor-pointer"
              >
                {COUNTRIES.map(c => (
                  <option key={`${c.code}-${c.dial}`} value={c.dial}>
                    {countryFlag(c.code)} {c.dial} {c.name}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/[^\d\s\-().+]/g, ''))}
                required
                placeholder="9988-7766"
                className="flex-1 px-4 py-2.5 text-sm text-navy-950 placeholder-gray-400 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Three-dot action menu ─────────────────────────────────────────────────────
function ActionMenu({ user, onEdit, onArchive, onResetPassword, onRemove }: {
  user: UserProfile
  onEdit: () => void
  onArchive: () => void
  onResetPassword: () => void
  onRemove: () => void
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
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
      })
    }
    setOpen(v => !v)
  }

  const isArchived = user.status === 'archived'

  const item = (icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean) => (
    <button
      onClick={() => { setOpen(false); onClick() }}
      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors ${danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      {icon} {label}
    </button>
  )

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div ref={menuRef} style={menuStyle} className="w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
          {item(<Pencil className="w-4 h-4" />, 'Edit', onEdit)}
          {item(
            isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />,
            isArchived ? 'Unarchive' : 'Archive',
            onArchive
          )}
          {item(<KeyRound className="w-4 h-4" />, 'Reset Password', onResetPassword)}
          <div className="my-1 border-t border-gray-100" />
          {item(<Trash2 className="w-4 h-4" />, 'Remove', onRemove, true)}
        </div>
      )}
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UsersManager() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [searchInput, setSearchInput] = useState('')

  // Modals / dialogs
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<UserProfile | null>(null)
  const [removeTarget, setRemoveTarget] = useState<UserProfile | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type })

  // Recovery link modal (when email can't be sent)
  const [recoveryLink, setRecoveryLink] = useState<{ email: string; link: string; message: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const copyLink = async () => {
    if (!recoveryLink) return
    await navigator.clipboard.writeText(recoveryLink.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    if (roleFilter) params.set('role', roleFilter)
    if (statusFilter) params.set('status', statusFilter)
    try {
      const res = await fetch(`/api/admin/users?${params}`)
      const json = await res.json()
      if (res.ok) { setUsers(json.users || []); setTotal(json.total || 0) }
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleSaved = () => {
    setShowCreate(false); setEditUser(null)
    showToast(editUser ? 'User updated successfully' : 'User created — invite sent')
    fetchUsers()
  }

  const handleArchive = async () => {
    if (!archiveTarget) return
    setActionLoading(true)
    const newStatus = archiveTarget.status === 'archived' ? 'active' : 'archived'
    try {
      const res = await fetch(`/api/admin/users/${archiveTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      showToast(`User ${newStatus === 'archived' ? 'archived' : 'unarchived'} successfully`)
      fetchUsers()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error', 'error')
    } finally {
      setActionLoading(false); setArchiveTarget(null)
    }
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${removeTarget.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      showToast('User removed permanently')
      fetchUsers()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error', 'error')
    } finally {
      setActionLoading(false); setRemoveTarget(null)
    }
  }

  const handleResetPassword = async (user: UserProfile) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      if (json.link && !json.emailSent) {
        // Email couldn't be sent — show the link for manual sharing
        setRecoveryLink({ email: user.email, link: json.link, message: json.message })
      } else {
        showToast(json.message || 'Password reset email sent')
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error', 'error')
    }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 flex items-center gap-2.5">
            <UserCog className="w-7 h-7 text-brand-600" />
            Users
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} user{total !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-brand-600/25 text-sm"
        >
          <Plus className="w-4 h-4" />
          New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all bg-white"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <UserCog className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Celular</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                          {(user.full_name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-navy-950 truncate">{user.full_name || <span className="text-gray-400 italic">No name</span>}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${user.role === 'admin' ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {user.phone || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {STATUS_LABELS[user.status] || user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <ActionMenu
                        user={user}
                        onEdit={() => setEditUser(user)}
                        onArchive={() => setArchiveTarget(user)}
                        onResetPassword={() => handleResetPassword(user)}
                        onRemove={() => setRemoveTarget(user)}
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 font-medium px-2">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {(showCreate || editUser) && (
        <UserModal
          user={editUser}
          onClose={() => { setShowCreate(false); setEditUser(null) }}
          onSaved={handleSaved}
        />
      )}

      {archiveTarget && (
        <ConfirmDialog
          title={archiveTarget.status === 'archived' ? 'Unarchive User' : 'Archive User'}
          description={
            archiveTarget.status === 'archived'
              ? `Restore access for ${archiveTarget.email}? They will be able to sign in again.`
              : `Archive ${archiveTarget.email}? They will be signed out and lose access to the admin panel.`
          }
          confirmLabel={archiveTarget.status === 'archived' ? 'Unarchive' : 'Archive'}
          onConfirm={handleArchive}
          onCancel={() => setArchiveTarget(null)}
          loading={actionLoading}
        />
      )}

      {removeTarget && (
        <ConfirmDialog
          title="Remove User"
          description={`Permanently delete ${removeTarget.email}? This action cannot be undone and will remove all their data.`}
          confirmLabel="Remove Permanently"
          danger
          onConfirm={handleRemove}
          onCancel={() => setRemoveTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* Recovery link modal */}
      {recoveryLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRecoveryLink(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-navy-950">Password Reset Link</h2>
                  <p className="text-xs text-gray-500">For: {recoveryLink.email}</p>
                </div>
              </div>
              <button onClick={() => setRecoveryLink(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700">{recoveryLink.message}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">Copy this link and send it to the user:</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={recoveryLink.link}
                className="flex-1 px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono truncate focus:outline-none"
                onClick={e => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={copyLink}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">This link expires in 1 hour.</p>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
