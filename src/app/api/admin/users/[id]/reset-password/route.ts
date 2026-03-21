import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

// POST /api/admin/users/[id]/reset-password
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin = createAdminClient()

  const { data: profile, error: profileError } = await admin
    .from('profiles').select('email').eq('id', id).single()
  if (profileError || !profile?.email) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Use implicit flow to avoid PKCE browser storage requirement
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false, flowType: 'implicit' } }
  )

  // This uses the SMTP configured in Supabase (Gmail) to send the email
  const { error } = await anonClient.auth.resetPasswordForEmail(profile.email, {
    redirectTo: `${siteUrl}/admin/reset-password`,
  })

  if (error) {
    console.error('[reset-password] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, emailSent: true, message: `Password reset email sent to ${profile.email}` })
}
