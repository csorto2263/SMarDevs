'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Parse the hash from the URL (#access_token=...&type=recovery|invite)
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (accessToken && (type === 'recovery' || type === 'invite')) {
      // Set the session using the tokens from the URL hash
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken || '' })
        .then(({ error }) => {
          if (error) {
            setError('Invalid or expired reset link. Please request a new one.')
          } else {
            setReady(true)
          }
        })
      return
    }

    // Fallback: listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    // Also check if there's already a valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true); setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      setDone(true)
      await supabase.auth.signOut()
      setTimeout(() => router.push('/admin/login'), 2500)
    }
  }

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold shadow-md">S</span>
            <span className="text-2xl font-bold text-navy-950">SMar<span className="text-brand-600">Devs</span></span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-navy-950 mb-2">Password Updated!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to login...</p>
            </div>
          ) : !ready ? (
            <div className="text-center py-8">
              {error ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 font-medium mb-2">Invalid reset link</p>
                  <p className="text-gray-400 text-sm">{error}</p>
                </>
              ) : (
                <>
                  <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Verifying your reset link...</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-navy-950">Set New Password</h1>
                  <p className="text-sm text-gray-500">Choose a strong password</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password *</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Min. 8 characters"
                      className={inputCls}
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                      placeholder="Repeat your password"
                      className={`${inputCls} ${confirm && confirm !== password ? 'border-red-400' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
