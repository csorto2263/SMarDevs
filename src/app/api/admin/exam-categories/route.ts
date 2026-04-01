import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { requireStaff } from '@/lib/auth'

// GET /api/admin/exam-categories
export async function GET() {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClientAny()
  const { data, error } = await admin
    .from('exam_categories')
    .select('id, name, description')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ categories: data || [] })
}

// POST /api/admin/exam-categories
export async function POST(req: NextRequest) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const admin = createAdminClientAny()
  const { data, error } = await admin
    .from('exam_categories')
    .insert({ name: name.trim(), description: description?.trim() || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ category: data }, { status: 201 })
}
