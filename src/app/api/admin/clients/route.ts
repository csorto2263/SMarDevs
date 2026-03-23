import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

// GET /api/admin/clients
export async function GET(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search   = searchParams.get('search') || ''
  const status   = searchParams.get('status') || 'active'
  const page     = parseInt(searchParams.get('page') || '1')
  const limit    = 10
  const offset   = (page - 1) * limit

  const admin = createAdminClientAny()
  let query = admin
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('status', status)

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,primary_contact_email.ilike.%${search}%,primary_contact_name.ilike.%${search}%`
    )
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ clients: data, total: count ?? 0 })
}

// POST /api/admin/clients
export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const {
    name,
    company_address,
    company_phone,
    website,
    primary_contact_name,
    primary_contact_email,
    primary_contact_phone,
    secondary_contact_name,
    secondary_contact_email,
    secondary_contact_phone,
  } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Client name is required' }, { status: 400 })

  const admin = createAdminClientAny()
  const { data, error } = await admin
    .from('clients')
    .insert({
      name: name.trim(),
      company_address: company_address || null,
      company_phone:   company_phone   || null,
      website:         website         || null,
      primary_contact_name:    primary_contact_name    || null,
      primary_contact_email:   primary_contact_email   || null,
      primary_contact_phone:   primary_contact_phone   || null,
      secondary_contact_name:  secondary_contact_name  || null,
      secondary_contact_email: secondary_contact_email || null,
      secondary_contact_phone: secondary_contact_phone || null,
      status:     'active',
      created_by: caller.id,
      updated_by: caller.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({ entity_type: 'client', entity_id: data.id, action: 'create', performed_by: caller.id, metadata: { name } })

  return NextResponse.json({ client: data }, { status: 201 })
}
