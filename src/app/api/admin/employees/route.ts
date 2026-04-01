import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/employees
export async function GET(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search     = searchParams.get('search')    || ''
  const client_id  = searchParams.get('client_id') || ''
  const status     = searchParams.get('status')    || ''
  const archived   = searchParams.get('archived')  === 'true'
  const page       = parseInt(searchParams.get('page') || '1')
  const limit      = 10
  const offset     = (page - 1) * limit

  const admin = createAdminClientAny()
  let query = admin
    .from('employees')
    .select('*, clients(id, name)', { count: 'exact' })
    .eq('is_archived', archived)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,role_title.ilike.%${search}%`)
  }
  if (client_id) query = query.eq('client_id', client_id)
  if (status)    query = query.eq('status', status)

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ employees: data, total: count ?? 0 })
}

// POST /api/admin/employees
export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const {
    full_name, email, phone, address, linkedin_url,
    role_title, role_category, seniority, start_date, employment_type,
    monthly_salary_usd, client_id, source_application_id,
  } = body

  if (!full_name?.trim()) return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
  if (!email?.trim())     return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  if (!role_title?.trim()) return NextResponse.json({ error: 'Role title is required' }, { status: 400 })
  if (!client_id)          return NextResponse.json({ error: 'Client is required' }, { status: 400 })

  const admin = createAdminClientAny()
  const { data, error } = await admin
    .from('employees')
    .insert({
      full_name:    full_name.trim(),
      email:        email.trim(),
      phone:        phone        || null,
      address:      address      || null,
      linkedin_url: linkedin_url || null,
      role_title:   role_title.trim(),
      role_category:     role_category     || null,
      seniority:         seniority         || null,
      start_date:        start_date        || null,
      employment_type:   employment_type   || null,
      monthly_salary_usd: monthly_salary_usd ? Number(monthly_salary_usd) : null,
      client_id,
      source_application_id: source_application_id || null,
      status:     'active',
      is_archived: false,
      created_by: caller.id,
      updated_by: caller.id,
    })
    .select('*, clients(id, name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    entity_type: 'employee', entity_id: data.id, action: 'create',
    performed_by: caller.id, metadata: { full_name, client_id }
  })

  return NextResponse.json({ employee: data }, { status: 201 })
}
