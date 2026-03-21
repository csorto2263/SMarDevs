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

// PATCH /api/admin/users/[id] — edit or archive
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { full_name, role, status, phone } = body

  const admin = createAdminClient()
  const updates: Record<string, string | null> = { updated_at: new Date().toISOString() }
  if (full_name !== undefined) updates.full_name = full_name
  if (role !== undefined) updates.role = role
  if (status !== undefined) updates.status = status
  if (phone !== undefined) updates.phone = phone || null

  const { data, error } = await admin.from('profiles').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If archiving, ban the user in auth too
  if (status === 'archived') {
    await admin.auth.admin.updateUserById(id, { ban_duration: '876000h' }) // 100 years
  } else if (status === 'active') {
    await admin.auth.admin.updateUserById(id, { ban_duration: 'none' })
  }

  return NextResponse.json({ user: data })
}

// DELETE /api/admin/users/[id] — remove user permanently
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  // Prevent self-deletion
  if (id === caller.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
