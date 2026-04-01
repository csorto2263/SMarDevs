import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { requireStaff } from '@/lib/auth'

// GET /api/admin/jobs?search=&status=&client_id=&category_id=&page=
export async function GET(req: NextRequest) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search      = searchParams.get('search')      || ''
  const status      = searchParams.get('status')      || 'all'
  const client_id   = searchParams.get('client_id')   || ''
  const category_id = searchParams.get('category_id') || ''
  const page        = parseInt(searchParams.get('page') || '1')
  const limit       = 10
  const offset      = (page - 1) * limit

  const admin = createAdminClientAny()

  let query = admin
    .from('jobs')
    .select(`
      id, title, slug, status, seniority, location,
      application_count, created_at, client_id,
      job_categories(id, name),
      clients(id, name)
    `, { count: 'exact' })

  if (status !== 'all') {
    query = query.eq('status', status)
  }
  if (client_id) {
    query = query.eq('client_id', client_id)
  }
  if (category_id) {
    query = query.eq('category_id', category_id)
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ jobs: data, total: count ?? 0 })
}
