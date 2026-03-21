'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Shield, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      setEmail(user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || '')
        setRole(profile.role || 'admin')
        setMemberSince(
          profile.created_at
            ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : ''
        )
      }
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setStatus('idle')

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', userId)

    setSaving(false)
    setStatus(error ? 'error' : 'success')
    if (!error) setTimeout(() => setStatus('idle'), 3000)
  }

  const inputClasses = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const readonlyClasses = 'w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-navy-950 flex items-center gap-2'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-navy-950 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600" />
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className={inputClasses}
            />
          </div>

          {/* Read-only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className={readonlyClasses}>
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              {email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <div className={readonlyClasses}>
              <Shield className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="capitalize">{role}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Member Since</label>
            <div className={readonlyClasses}>
              {memberSince || '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {status === 'success' && (
            <div className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Profile updated successfully
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              Failed to save. Try again.
            </div>
          )}
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800">
        <p className="font-medium mb-1">Need to update your password?</p>
        <p className="text-blue-600">
          Password changes can be done through the{' '}
          <a
            href="https://supabase.com/dashboard/project/mwalppgmkrmclwwugaev/auth/users"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-800"
          >
            Supabase Auth dashboard
          </a>.
        </p>
      </div>
    </div>
  )
}
