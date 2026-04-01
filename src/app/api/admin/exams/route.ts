import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { requireStaff } from '@/lib/auth'

// GET /api/admin/exams?category_id=&search=&active=&page=
export async function GET(req: NextRequest) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const category_id = searchParams.get('category_id') || ''
  const search      = searchParams.get('search') || ''
  const active      = searchParams.get('active')
  const page        = parseInt(searchParams.get('page') || '1')
  const limit       = 20
  const offset      = (page - 1) * limit

  const admin = createAdminClientAny()

  let query = admin
    .from('exams')
    .select(`
      id, title, description, duration_minutes, passing_score, question_count,
      is_active, created_at,
      exam_categories(id, name)
    `, { count: 'exact' })

  if (category_id) query = query.eq('category_id', category_id)
  if (active === 'true') query = query.eq('is_active', true)
  if (active === 'false') query = query.eq('is_active', false)
  if (search) query = query.ilike('title', `%${search}%`)

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ exams: data || [], total: count ?? 0 })
}

// POST /api/admin/exams — Create a new exam with questions and options
export async function POST(req: NextRequest) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, description, category_id, duration_minutes, passing_score, questions } = body

  if (!title || !category_id) {
    return NextResponse.json({ error: 'Title and category are required' }, { status: 400 })
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: 'At least one question is required' }, { status: 400 })
  }

  const admin = createAdminClientAny()

  // Create the exam
  const { data: exam, error: examErr } = await admin
    .from('exams')
    .insert({
      title,
      description: description || null,
      category_id,
      duration_minutes: duration_minutes || 60,
      passing_score: passing_score || 70,
      question_count: questions.length,
      is_active: true,
      created_by: caller.id,
    })
    .select()
    .single()

  if (examErr) return NextResponse.json({ error: examErr.message }, { status: 500 })

  // Insert questions and their options
  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi]
    const { data: question, error: qErr } = await admin
      .from('exam_questions')
      .insert({
        exam_id: exam.id,
        question_text: q.question_text,
        question_type: q.question_type || 'single_choice',
        points: q.points || 1,
        sort_order: qi,
      })
      .select()
      .single()

    if (qErr) {
      console.error('[exams] Question insert error:', qErr.message)
      continue
    }

    // Insert options
    if (q.options && Array.isArray(q.options)) {
      const optionsToInsert = q.options.map((opt: { option_text: string; is_correct: boolean }, oi: number) => ({
        question_id: question.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct || false,
        sort_order: oi,
      }))
      await admin.from('exam_options').insert(optionsToInsert)
    }
  }

  await logAudit({
    entity_type: 'exam',
    entity_id: exam.id,
    action: 'create',
    performed_by: caller.id,
    metadata: { title, category_id, question_count: questions.length },
  })

  return NextResponse.json({ exam }, { status: 201 })
}
