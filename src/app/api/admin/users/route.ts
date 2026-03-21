import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

// GET /api/admin/users — list with search, filter, pagination
export async function GET(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || ''
  const status = searchParams.get('status') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10
  const offset = (page - 1) * limit

  const admin = createAdminClient()
  let query = admin.from('profiles').select('*', { count: 'exact' })

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (role) query = query.eq('role', role)
  if (status) query = query.eq('status', status)

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ users: data, total: count ?? 0 })
}

// POST /api/admin/users — create user
export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { email, full_name, role = 'member', phone } = body

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  const admin = createAdminClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Invite the user — sends invitation email automatically via configured SMTP
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/admin/reset-password`,
    data: { full_name, role },
  })

  if (inviteError) return NextResponse.json({ error: inviteError.message }, { status: 400 })

  const userId = invited.user.id

  // Ensure profile has correct role (trigger handles it but upsert guarantees it)
  await admin.from('profiles').upsert(
    { id: userId, email, full_name: full_name || null, role, phone: phone || null, status: 'active' },
    { onConflict: 'id' }
  )

  return NextResponse.json({ user: { id: userId, email } }, { status: 201 })
}
